import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResourceService } from './user-resource.service';
import { environment } from '../../environments/environment';

export interface LongPauseLog {
  timestampSec: number;
  durationSec: number;
}

export interface SpeechMetrics {
  wpm: number; // words per minute (gross)
  netWpm?: number; // words per active speaking minute
  totalWords: number;
  fillerWordsCount: number;
  fillerBreakdown: { [word: string]: number };
  durationSeconds: number;
  silenceSeconds: number;
  pausesCount: number; // standard pauses >= 800ms
  longPausesCount: number; // awkward long pauses >= 4s
  longPauseLogs: LongPauseLog[];
  silencePercentage: number;

  // Tone, Pitch & Cadence Variance Analysis
  avgPitchHz: number;
  pitchVariance: number; // standard deviation of pitch in Hz
  toneCategory: 'Monotone' | 'Steady' | 'Engaging Inflection' | 'Dynamic';
  vocalInflectionScore: number; // 0 - 100 score
  cadenceRhythm: 'Consistent Pacing' | 'Hesitant & Paused' | 'Rapid Rush';

  clarityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  feedback: string;
}

const COMMON_FILLER_WORDS = [
  'um', 'umm', 'ummm', 'uh', 'uhh', 'uhhh', 'err', 'errr', 'ah', 'ahh', 'aah', 'aaah', 'mm', 'mmm', 'hmm', 'hmmm',
  'like', 'you know', 'basically', 'actually', 'literally',
  'so', 'kind of', 'sort of', 'i mean', 'right', 'anyway'
];

export const SUPPORTED_SPEECH_LANGUAGES = [
  { code: 'en-US', label: 'English (United States)' },
  { code: 'en-GB', label: 'English (United Kingdom)' },
  { code: 'es-ES', label: 'Spanish (Español)' },
  { code: 'fr-FR', label: 'French (Français)' },
  { code: 'de-DE', label: 'German (Deutsch)' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
];

@Injectable({
  providedIn: 'root',
})
export class SpeechAnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly userResourceService = inject(UserResourceService);
  private readonly apiUrl = `${environment.apiUrl}/ai-evaluations/voice`;

  readonly isRecording = signal<boolean>(false);
  readonly liveTranscript = signal<string>('');
  readonly speechMetrics = signal<SpeechMetrics | null>(null);
  readonly selectedLanguage = signal<string>('en-US');

  // Live real-time indicators
  readonly liveSilenceSeconds = signal<number>(0);
  readonly livePauseCount = signal<number>(0);
  readonly liveLongPauseCount = signal<number>(0);
  readonly liveVocalFillerCount = signal<number>(0);
  readonly liveVolumeLevel = signal<number>(0);
  readonly livePitchHz = signal<number>(0);
  readonly liveToneCategory = signal<'Monotone' | 'Steady' | 'Engaging Inflection' | 'Dynamic'>('Steady');
  readonly liveInflectionScore = signal<number>(80);

  private recognition: any = null;
  private startTime: number = 0;
  private finalizedText: string = '';
  private lastSpeechTimestamp: number = 0;

  // Audio Context & Acoustic Signal Analysis (Web Audio API)
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  private totalSilenceMs: number = 0;
  private pausesCount: number = 0;
  private longPausesCount: number = 0;
  private longPauseLogs: LongPauseLog[] = [];
  private currentSilenceStart: number | null = null;
  private pauseAlreadyCounted: boolean = false;
  private longPauseAlreadyCounted: boolean = false;

  // Adaptive noise calibration & vocal filler tracking
  private noiseFloorSamples: number[] = [];
  private adaptiveNoiseFloor: number = 6;
  private acousticVocalFillers: number = 0;
  private currentVocalSoundStart: number | null = null;
  private lastVocalFillerLoggedTime: number = 0;

  // Pitch & Vocal Inflection Tracking
  private pitchSamples: number[] = [];

  constructor() {
    this.initWebSpeechAPI();
  }

  setLanguage(langCode: string): void {
    this.selectedLanguage.set(langCode);
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  private initWebSpeechAPI(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.selectedLanguage();

        this.recognition.onresult = (event: any) => {
          this.lastSpeechTimestamp = Date.now(); // Record exact timestamp when text tokens arrive
          let currentSessionText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSessionText += event.results[i][0].transcript;
          }
          const fullText = (this.finalizedText ? this.finalizedText + ' ' : '') + currentSessionText;
          this.liveTranscript.set(fullText);
        };

        this.recognition.onend = () => {
          this.finalizedText = this.liveTranscript();
          if (this.isRecording()) {
            try {
              this.recognition.start();
            } catch {
              // already running or stopped
            }
          }
        };

        this.recognition.onerror = (event: any) => {
          if (event?.error === 'no-speech' && this.isRecording()) {
            return;
          }
          if (event?.error !== 'no-speech') {
            this.isRecording.set(false);
            this.stopAudioSignalAnalysis();
          }
        };
      }
    }
  }

  private autoCorrelate(buf: Float32Array, sampleRate: number): number {
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.015) return -1; // Insufficient signal for pitch

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    const sliced = buf.subarray(r1, r2);
    const slicedSize = sliced.length;
    if (slicedSize < 64) return -1;

    const c = new Float32Array(slicedSize);
    for (let i = 0; i < slicedSize; i++) {
      for (let j = 0; j < slicedSize - i; j++) {
        c[i] = c[i] + sliced[j] * sliced[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < slicedSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    if (T0 > 0 && T0 < slicedSize - 1) {
      const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);
    }

    const freq = sampleRate / T0;
    // Standard human speech fundamental frequency (75Hz to 380Hz)
    if (freq >= 75 && freq <= 380) {
      return Math.round(freq);
    }
    return -1;
  }

  private calculatePitchStats(pitches: number[]): { avgPitchHz: number; pitchVariance: number; toneCategory: 'Monotone' | 'Steady' | 'Engaging Inflection' | 'Dynamic'; vocalInflectionScore: number } {
    if (!pitches || pitches.length < 5) {
      return {
        avgPitchHz: 165,
        pitchVariance: 22,
        toneCategory: 'Steady',
        vocalInflectionScore: 80,
      };
    }

    const sum = pitches.reduce((a, b) => a + b, 0);
    const avgPitchHz = Math.round(sum / pitches.length);

    const varianceSum = pitches.reduce((acc, val) => acc + Math.pow(val - avgPitchHz, 2), 0);
    const pitchVariance = Math.round(Math.sqrt(varianceSum / pitches.length) * 10) / 10;

    let toneCategory: 'Monotone' | 'Steady' | 'Engaging Inflection' | 'Dynamic' = 'Steady';
    let vocalInflectionScore = 82;

    if (pitchVariance < 14) {
      toneCategory = 'Monotone';
      vocalInflectionScore = 60;
    } else if (pitchVariance >= 14 && pitchVariance < 28) {
      toneCategory = 'Steady';
      vocalInflectionScore = 80;
    } else if (pitchVariance >= 28 && pitchVariance < 52) {
      toneCategory = 'Engaging Inflection';
      vocalInflectionScore = 95;
    } else {
      toneCategory = 'Dynamic';
      vocalInflectionScore = 88;
    }

    return { avgPitchHz, pitchVariance, toneCategory, vocalInflectionScore };
  }

  private async startAudioSignalAnalysis(): Promise<void> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.3;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const floatTimeBuffer = new Float32Array(this.analyser.fftSize);

      this.totalSilenceMs = 0;
      this.pausesCount = 0;
      this.longPausesCount = 0;
      this.longPauseLogs = [];
      this.currentSilenceStart = null;
      this.pauseAlreadyCounted = false;
      this.longPauseAlreadyCounted = false;
      this.noiseFloorSamples = [];
      this.adaptiveNoiseFloor = 6;
      this.acousticVocalFillers = 0;
      this.currentVocalSoundStart = null;
      this.lastVocalFillerLoggedTime = 0;
      this.lastSpeechTimestamp = Date.now();
      this.pitchSamples = [];

      this.liveSilenceSeconds.set(0);
      this.livePauseCount.set(0);
      this.liveLongPauseCount.set(0);
      this.liveVocalFillerCount.set(0);
      this.livePitchHz.set(0);
      this.liveToneCategory.set('Steady');
      this.liveInflectionScore.set(80);

      let lastFrameTime = Date.now();

      const processAudio = () => {
        if (!this.isRecording() || !this.analyser) return;

        const now = Date.now();
        const deltaMs = Math.min(100, now - lastFrameTime);
        lastFrameTime = now;

        this.analyser.getByteFrequencyData(dataArray);

        // 1. Calculate RMS volume level
        let sum = 0;
        let lowFreqSum = 0;
        let totalEnergy = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          sum += val * val;
          totalEnergy += val;
          // Bins 2 to 16 represent ~80Hz to ~360Hz (vocal fundamental frequencies for umm/aaa/humming)
          if (i >= 2 && i <= 16) {
            lowFreqSum += val;
          }
        }

        const rms = Math.sqrt(sum / bufferLength);
        const lowFreqRatio = totalEnergy > 0 ? lowFreqSum / totalEnergy : 0;
        this.liveVolumeLevel.set(Math.min(100, Math.round((rms / 45) * 100)));

        // 2. Dynamic Adaptive Ambient Noise Calibration (first 1.5 seconds)
        if (now - this.startTime < 1500) {
          this.noiseFloorSamples.push(rms);
          const avgSample = this.noiseFloorSamples.reduce((a, b) => a + b, 0) / this.noiseFloorSamples.length;
          this.adaptiveNoiseFloor = Math.max(4, Math.round(avgSample + 5));
        }

        const SILENCE_THRESHOLD = this.adaptiveNoiseFloor;
        const VOCAL_THRESHOLD = SILENCE_THRESHOLD + 4;

        // 3. Silence & Pause Tracking Engine
        if (rms < SILENCE_THRESHOLD) {
          // Continuous quiet
          if (this.currentSilenceStart === null) {
            this.currentSilenceStart = now;
            this.pauseAlreadyCounted = false;
            this.longPauseAlreadyCounted = false;
          } else {
            const silenceDuration = now - this.currentSilenceStart;
            
            // Standard pause cutoff (>= 800ms)
            if (silenceDuration >= 800 && !this.pauseAlreadyCounted) {
              this.pausesCount++;
              this.pauseAlreadyCounted = true;
              this.livePauseCount.set(this.pausesCount);
            }

            // Long awkward pause cutoff (>= 4000ms / 4s)
            if (silenceDuration >= 4000 && !this.longPauseAlreadyCounted) {
              this.longPausesCount++;
              this.longPauseAlreadyCounted = true;
              this.liveLongPauseCount.set(this.longPausesCount);

              const timestampSec = Math.max(0, Math.round((this.currentSilenceStart - this.startTime) / 1000));
              this.longPauseLogs.push({
                timestampSec,
                durationSec: Math.round(silenceDuration / 1000 * 10) / 10,
              });
            } else if (silenceDuration >= 4000 && this.longPauseAlreadyCounted && this.longPauseLogs.length > 0) {
              // Update duration of active long pause
              this.longPauseLogs[this.longPauseLogs.length - 1].durationSec = Math.round(silenceDuration / 1000 * 10) / 10;
            }
          }
          this.totalSilenceMs += deltaMs;
          this.liveSilenceSeconds.set(Math.round(this.totalSilenceMs / 1000));
          this.currentVocalSoundStart = null;
        } else {
          // Voice activity detected
          if (this.currentSilenceStart !== null) {
            this.currentSilenceStart = null;
          }

          // 4. Acoustic Vocal Pitch & Inflection Analysis
          this.analyser.getFloatTimeDomainData(floatTimeBuffer);
          const detectedPitch = this.autoCorrelate(floatTimeBuffer, this.audioContext?.sampleRate || 44100);
          if (detectedPitch > 0) {
            this.pitchSamples.push(detectedPitch);
            this.livePitchHz.set(detectedPitch);

            // Periodically compute live pitch stats every 10 samples
            if (this.pitchSamples.length % 10 === 0) {
              const stats = this.calculatePitchStats(this.pitchSamples);
              this.liveToneCategory.set(stats.toneCategory);
              this.liveInflectionScore.set(stats.vocalInflectionScore);
            }
          }

          // 5. Acoustic Vocal Hesitation Engine ("umm", "aaa", "uhh", "hmm")
          if (rms > VOCAL_THRESHOLD && lowFreqRatio > 0.45) {
            const timeSinceLastWordToken = now - this.lastSpeechTimestamp;

            if (timeSinceLastWordToken > 350) {
              if (this.currentVocalSoundStart === null) {
                this.currentVocalSoundStart = now;
              } else {
                const vocalSoundDuration = now - this.currentVocalSoundStart;
                // If sustained vocal sound for >350ms without words AND cooldown > 1200ms
                if (vocalSoundDuration >= 350 && (now - this.lastVocalFillerLoggedTime > 1200)) {
                  this.acousticVocalFillers++;
                  this.lastVocalFillerLoggedTime = now;
                  this.liveVocalFillerCount.set(this.acousticVocalFillers);
                }
              }
            } else {
              this.currentVocalSoundStart = null;
            }
          } else {
            this.currentVocalSoundStart = null;
          }
        }

        this.animFrameId = requestAnimationFrame(processAudio);
      };

      this.animFrameId = requestAnimationFrame(processAudio);
    } catch {
      // Microphone access blocked or AudioContext unavailable
    }
  }

  private stopAudioSignalAnalysis(): void {
    if (this.currentSilenceStart !== null) {
      this.totalSilenceMs += (Date.now() - this.currentSilenceStart);
      this.currentSilenceStart = null;
    }

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }

  startRecording(): void {
    this.finalizedText = '';
    this.liveTranscript.set('');
    this.speechMetrics.set(null);
    this.startTime = Date.now();
    this.isRecording.set(true);

    this.startAudioSignalAnalysis();

    if (this.recognition) {
      try {
        this.recognition.lang = this.selectedLanguage();
        this.recognition.start();
      } catch {
        // Fallback simulated timer
      }
    }
  }

  stopRecording(useAi: boolean = false): SpeechMetrics {
    this.isRecording.set(false);
    this.stopAudioSignalAnalysis();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const transcript = this.liveTranscript() || 'I am demonstrating the AI interview speech analytics tool. Basically, I want to show how Angular Signals and RxJS work together, um, in a high performance application like this.';

    return this.analyzeTranscript(transcript, durationSeconds, useAi);
  }

  analyzeTranscript(text: string, durationSeconds: number, useAi: boolean = false): SpeechMetrics {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    const fillerBreakdown: { [word: string]: number } = {};
    let textFillerCount = 0;

    for (const word of words) {
      if (COMMON_FILLER_WORDS.includes(word)) {
        fillerBreakdown[word] = (fillerBreakdown[word] || 0) + 1;
        textFillerCount++;
      }
    }

    // Combine text-detected fillers with acoustic non-lexical vocal sounds ("umm", "aaa")
    const totalFillerCount = textFillerCount + this.acousticVocalFillers;
    if (this.acousticVocalFillers > 0) {
      fillerBreakdown['umm/aaa (vocal sound)'] = this.acousticVocalFillers;
    }

    const silenceSeconds = Math.min(durationSeconds, Math.round(this.totalSilenceMs / 1000));
    const silencePercentage = durationSeconds > 0 ? Math.round((silenceSeconds / durationSeconds) * 100) : 0;
    const activeSpeakingSeconds = Math.max(1, durationSeconds - silenceSeconds);

    const durationMinutes = durationSeconds / 60;
    const wpm = durationMinutes > 0 ? Math.round(totalWords / durationMinutes) : 0;
    const netWpm = Math.round(totalWords / (activeSpeakingSeconds / 60));

    // Pitch & Vocal Inflection Stats
    const pitchStats = this.calculatePitchStats(this.pitchSamples);

    let cadenceRhythm: 'Consistent Pacing' | 'Hesitant & Paused' | 'Rapid Rush' = 'Consistent Pacing';
    if (wpm > 175) cadenceRhythm = 'Rapid Rush';
    else if (this.pausesCount > 4 || silencePercentage > 30) cadenceRhythm = 'Hesitant & Paused';

    let clarityScore = 95;
    if (wpm < 100) clarityScore -= 15;
    if (wpm > 170) clarityScore -= 20;

    // Penalty for long silences and frequent pauses
    if (silencePercentage > 30) clarityScore -= 15;
    if (this.pausesCount > 3) clarityScore -= 10;
    if (this.longPausesCount > 0) clarityScore -= (this.longPausesCount * 8);

    // Adjust clarity score for monotone delivery
    if (pitchStats.toneCategory === 'Monotone') clarityScore -= 10;

    const totalHesitations = totalFillerCount + this.pausesCount + (this.longPausesCount * 2);
    const confidenceScore = Math.max(25, Math.round(100 - (totalHesitations * 3.5) - (silencePercentage * 0.4)));

    let feedback = 'Great speech pacing, vocal pitch inflection, and clear articulation!';
    if (wpm < 110) feedback = 'Try speaking slightly faster to project energy and confidence.';
    else if (wpm > 165) feedback = 'Pacing is a bit fast. Pause slightly after key statements.';
    
    if (this.longPausesCount > 0) {
      feedback += ` Captured ${this.longPausesCount} long awkward pause(s) (>4s). Work on bridging transitions smoothly.`;
    } else if (this.pausesCount > 2 || silencePercentage > 20) {
      feedback += ` Detected ${this.pausesCount} pauses (${silenceSeconds}s silence total). Reduce frequent pauses for smooth delivery.`;
    }

    if (pitchStats.toneCategory === 'Monotone') {
      feedback += ' Your pitch variation is relatively flat. Try adding vocal expression and enthusiasm.';
    }

    if (totalFillerCount > 1) {
      feedback += ` Watch out for filler sounds & hesitations (${totalFillerCount} captured, e.g. "${Object.keys(fillerBreakdown).slice(0, 3).join(', ')}").`;
    }

    const metrics: SpeechMetrics = {
      wpm,
      netWpm,
      totalWords,
      fillerWordsCount: totalFillerCount,
      fillerBreakdown,
      durationSeconds,
      silenceSeconds,
      pausesCount: this.pausesCount,
      longPausesCount: this.longPausesCount,
      longPauseLogs: this.longPauseLogs,
      silencePercentage,
      avgPitchHz: pitchStats.avgPitchHz,
      pitchVariance: pitchStats.pitchVariance,
      toneCategory: pitchStats.toneCategory,
      vocalInflectionScore: pitchStats.vocalInflectionScore,
      cadenceRhythm,
      clarityScore: Math.min(100, Math.max(30, clarityScore)),
      confidenceScore: Math.min(100, Math.max(25, confidenceScore)),
      feedback,
    };

    this.speechMetrics.set(metrics);

    // If AI evaluation mode is requested, call backend AI endpoint
    if (useAi) {
      this.http.post<any>(this.apiUrl, {
        transcript: text,
        durationSeconds,
        silenceSeconds,
        pausesCount: this.pausesCount,
        longPausesCount: this.longPausesCount,
        vocalFillers: this.acousticVocalFillers,
        pitchVariance: pitchStats.pitchVariance,
        toneCategory: pitchStats.toneCategory,
        vocalInflectionScore: pitchStats.vocalInflectionScore,
        selectedLanguage: this.selectedLanguage(),
      }).subscribe({
        next: (res) => {
          if (res) {
            if (res.creditsDeducted) {
              this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
            }
            this.speechMetrics.set({
              ...metrics,
              wpm: res.wpm || metrics.wpm,
              fillerWordsCount: res.fillerWordsCount ?? metrics.fillerWordsCount,
              longPausesCount: res.longPausesCount ?? metrics.longPausesCount,
              toneCategory: res.toneCategory || metrics.toneCategory,
              pitchVariance: res.pitchVariance ?? metrics.pitchVariance,
              vocalInflectionScore: res.vocalInflectionScore ?? metrics.vocalInflectionScore,
              confidenceScore: res.confidenceScore ?? metrics.confidenceScore,
              clarityScore: res.clarityScore ?? metrics.clarityScore,
              feedback: res.feedback || metrics.feedback,
            });
          }
        },
        error: () => { }
      });
    }

    return metrics;
  }
}



