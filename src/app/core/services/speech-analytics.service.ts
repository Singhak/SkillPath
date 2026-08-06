import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResourceService } from './user-resource.service';
import { environment } from '../../environments/environment';

export interface SpeechMetrics {
  wpm: number; // words per minute (gross)
  netWpm?: number; // words per active speaking minute
  totalWords: number;
  fillerWordsCount: number;
  fillerBreakdown: { [word: string]: number };
  durationSeconds: number;
  silenceSeconds?: number;
  pausesCount?: number;
  silencePercentage?: number;
  clarityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  feedback: string;
}

const COMMON_FILLER_WORDS = [
  'um', 'umm', 'ummm', 'uh', 'uhh', 'uhhh', 'err', 'errr', 'ah', 'ahh', 'aah', 'aaah', 'mm', 'mmm', 'hmm', 'hmmm',
  'like', 'you know', 'basically', 'actually', 'literally',
  'so', 'kind of', 'sort of', 'i mean', 'right', 'anyway'
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

  // Live real-time indicators
  readonly liveSilenceSeconds = signal<number>(0);
  readonly livePauseCount = signal<number>(0);
  readonly liveVocalFillerCount = signal<number>(0);
  readonly liveVolumeLevel = signal<number>(0);

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
  private currentSilenceStart: number | null = null;
  private pauseAlreadyCounted: boolean = false;

  // Adaptive noise calibration & vocal filler tracking
  private noiseFloorSamples: number[] = [];
  private adaptiveNoiseFloor: number = 6;
  private acousticVocalFillers: number = 0;
  private currentVocalSoundStart: number | null = null;
  private lastVocalFillerLoggedTime: number = 0;

  constructor() {
    this.initWebSpeechAPI();
  }

  private initWebSpeechAPI(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

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

  private async startAudioSignalAnalysis(): Promise<void> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.4;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.totalSilenceMs = 0;
      this.pausesCount = 0;
      this.currentSilenceStart = null;
      this.pauseAlreadyCounted = false;
      this.noiseFloorSamples = [];
      this.adaptiveNoiseFloor = 6;
      this.acousticVocalFillers = 0;
      this.currentVocalSoundStart = null;
      this.lastVocalFillerLoggedTime = 0;
      this.lastSpeechTimestamp = Date.now();

      this.liveSilenceSeconds.set(0);
      this.livePauseCount.set(0);
      this.liveVocalFillerCount.set(0);

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
          } else {
            const silenceDuration = now - this.currentSilenceStart;
            // Noticeable pause cutoff (>= 800ms)
            if (silenceDuration >= 800 && !this.pauseAlreadyCounted) {
              this.pausesCount++;
              this.pauseAlreadyCounted = true;
              this.livePauseCount.set(this.pausesCount);
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

          // 4. Acoustic Vocal Hesitation Engine ("umm", "aaa", "uhh", "hmm")
          // If volume is active (vocalizing) with high low-frequency vocal resonance (lowFreqRatio > 0.45)
          // AND no text tokens returned from SpeechRecognition for >350ms, it is a hesitation sound!
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
      fillerBreakdown['umm/aaa (vocal)'] = this.acousticVocalFillers;
    }

    const silenceSeconds = Math.min(durationSeconds, Math.round(this.totalSilenceMs / 1000));
    const silencePercentage = durationSeconds > 0 ? Math.round((silenceSeconds / durationSeconds) * 100) : 0;
    const activeSpeakingSeconds = Math.max(1, durationSeconds - silenceSeconds);

    const durationMinutes = durationSeconds / 60;
    const wpm = durationMinutes > 0 ? Math.round(totalWords / durationMinutes) : 0;
    const netWpm = Math.round(totalWords / (activeSpeakingSeconds / 60));

    let clarityScore = 95;
    if (wpm < 100) clarityScore -= 15;
    if (wpm > 170) clarityScore -= 20;

    // Penalty for long silences and frequent pauses
    if (silencePercentage > 30) clarityScore -= 15;
    if (this.pausesCount > 3) clarityScore -= 10;

    const totalHesitations = totalFillerCount + this.pausesCount;
    const confidenceScore = Math.max(25, Math.round(100 - (totalHesitations * 4) - (silencePercentage * 0.5)));

    let feedback = 'Great speech pacing and clear articulation!';
    if (wpm < 110) feedback = 'Try speaking slightly faster to project energy and confidence.';
    else if (wpm > 165) feedback = 'Pacing is a bit fast. Pause slightly after key statements.';
    
    if (this.pausesCount > 2 || silencePercentage > 20) {
      feedback += ` Detected ${this.pausesCount} pauses (${silenceSeconds}s silence total). Reduce long pauses for a smooth delivery.`;
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
      silencePercentage,
      clarityScore: Math.min(100, Math.max(35, clarityScore)),
      confidenceScore: Math.min(100, Math.max(25, confidenceScore)),
      feedback,
    };

    this.speechMetrics.set(metrics);

    // If AI evaluation mode is requested, call backend AI endpoint
    if (useAi) {
      this.http.post<any>(this.apiUrl, { transcript: text, durationSeconds, silenceSeconds, pausesCount: this.pausesCount, vocalFillers: this.acousticVocalFillers }).subscribe({
        next: (res) => {
          if (res) {
            if (res.creditsDeducted) {
              this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
            }
            this.speechMetrics.set({
              ...metrics,
              wpm: res.wpm || metrics.wpm,
              fillerWordsCount: res.fillerWordsCount ?? metrics.fillerWordsCount,
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


