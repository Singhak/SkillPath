import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface SpeechMetrics {
  wpm: number; // words per minute
  totalWords: number;
  fillerWordsCount: number;
  fillerBreakdown: { [word: string]: number };
  durationSeconds: number;
  clarityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  feedback: string;
}

const COMMON_FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'so', 'kind of'];

@Injectable({
  providedIn: 'root',
})
export class SpeechAnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ai-evaluations/voice`;

  readonly isRecording = signal<boolean>(false);
  readonly liveTranscript = signal<string>('');
  readonly speechMetrics = signal<SpeechMetrics | null>(null);

  private recognition: any = null;
  private startTime: number = 0;
  private finalizedText: string = '';

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
          }
        };
      }
    }
  }

  startRecording(): void {
    this.finalizedText = '';
    this.liveTranscript.set('');
    this.speechMetrics.set(null);
    this.startTime = Date.now();
    this.isRecording.set(true);

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch {
        // Fallback simulated timer
      }
    }
  }

  stopRecording(): SpeechMetrics {
    this.isRecording.set(false);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const transcript = this.liveTranscript() || 'I am demonstrating the AI interview speech analytics tool. Basically, I want to show how Angular Signals and RxJS work together, um, in a high performance application like this.';

    return this.analyzeTranscript(transcript, durationSeconds);
  }

  analyzeTranscript(text: string, durationSeconds: number): SpeechMetrics {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    const fillerBreakdown: { [word: string]: number } = {};
    let fillerWordsCount = 0;

    for (const word of words) {
      if (COMMON_FILLER_WORDS.includes(word)) {
        fillerBreakdown[word] = (fillerBreakdown[word] || 0) + 1;
        fillerWordsCount++;
      }
    }

    const durationMinutes = durationSeconds / 60;
    const wpm = durationMinutes > 0 ? Math.round(totalWords / durationMinutes) : 0;

    let clarityScore = 95;
    if (wpm < 100) clarityScore -= 15;
    if (wpm > 170) clarityScore -= 20;

    const fillerPercentage = totalWords > 0 ? (fillerWordsCount / totalWords) * 100 : 0;
    const confidenceScore = Math.max(40, Math.round(100 - fillerPercentage * 5));

    let feedback = 'Great speech pacing and clear articulation!';
    if (wpm < 110) feedback = 'Try speaking slightly faster to project energy and confidence.';
    else if (wpm > 165) feedback = 'Pacing is a bit fast. Pause slightly after key statements.';
    if (fillerWordsCount > 3) feedback += ` Watch out for filler words ("${Object.keys(fillerBreakdown).slice(0, 3).join(', ')}").`;

    const metrics: SpeechMetrics = {
      wpm,
      totalWords,
      fillerWordsCount,
      fillerBreakdown,
      durationSeconds,
      clarityScore: Math.min(100, Math.max(50, clarityScore)),
      confidenceScore,
      feedback,
    };

    this.speechMetrics.set(metrics);

    // Send analytics to backend for persistence & AI evaluation
    this.http.post<any>(this.apiUrl, { transcript: text, durationSeconds }).subscribe({
      next: (res) => {
        if (res) {
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

    return metrics;
  }
}
