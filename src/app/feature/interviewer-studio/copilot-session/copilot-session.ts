import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InterviewerCopilotService } from '../../../core/services/interviewer-copilot.service';

@Component({
  selector: 'app-copilot-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './copilot-session.html',
  styleUrls: ['./copilot-session.css'],
})
export class CopilotSessionComponent implements OnInit, OnDestroy {
  readonly copilotService = inject(InterviewerCopilotService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  activeMatrix = this.copilotService.activeMatrix;
  currentIdx = this.copilotService.currentQuestionIndex;
  speechActive = this.copilotService.speechAssistActive;
  transcript = this.copilotService.liveTranscript;
  autoCheckedCount = this.copilotService.autoCheckedRubricsCount;

  manualScore = 4;
  manualNotes = '';

  showLevelUp = signal<boolean>(false);
  showHint = signal<boolean>(false);
  showRedFlags = signal<boolean>(false);

  // Live Timer & Channel Sync State
  elapsedSeconds = signal<number>(0);
  copiedCandidateLink = false;
  private timerInterval: any = null;
  private syncChannel: BroadcastChannel | null = null;

  candidateCodeSnippet = signal<string>('');

  private codePollInterval: any = null;

  ngOnInit(): void {
    if (!this.activeMatrix()) {
      this.copilotService.loadSessionFromStorage();
    }
    this.startTimer();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.syncChannel = new BroadcastChannel('interviewer_session_sync');
      this.syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'CANDIDATE_CODE_UPDATE') {
          if (typeof event.data.code === 'string') {
            this.candidateCodeSnippet.set(event.data.code);
          }
        }
      };
    }
    this.broadcastActiveQuestion();
    this.startBackendCodePolling();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.codePollInterval) {
      clearInterval(this.codePollInterval);
    }
    if (this.syncChannel) {
      this.syncChannel.close();
    }
  }

  private startBackendCodePolling(): void {
    const poll = () => {
      const sessionId = this.activeMatrix()?.id;
      if (!sessionId) return;

      this.http.get<any>(`${environment.apiUrl}/interviews/session/${sessionId}/sync`).subscribe({
        next: (data) => {
          if (data && typeof data.candidateCode === 'string' && data.candidateCode.trim()) {
            this.candidateCodeSnippet.set(data.candidateCode);
          }
        },
        error: () => {},
      });
    };

    poll();
    this.codePollInterval = setInterval(poll, 2000);
  }

  private startTimer(): void {
    const matrix = this.activeMatrix();
    if (matrix && matrix.startedAt) {
      const startMs = new Date(matrix.startedAt).getTime();
      this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));

      this.timerInterval = setInterval(() => {
        this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
      }, 1000);
    }
  }

  get startTimeFormatted(): string {
    const matrix = this.activeMatrix();
    if (!matrix || !matrix.startedAt) return '--:--';
    return new Date(matrix.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  get elapsedFormatted(): string {
    const totalSec = this.elapsedSeconds();
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get allocatedMinutes(): number {
    return this.activeMatrix()?.config?.totalDurationMinutes || 60;
  }

  get pacingStatus(): { text: string; cssClass: string } {
    const elapsedMins = this.elapsedSeconds() / 60;
    const allocated = this.allocatedMinutes;

    if (elapsedMins > allocated) {
      return { text: 'Time Exceeded', cssClass: 'exceeded' };
    } else if (elapsedMins > allocated * 0.8) {
      return { text: 'Running Low on Time', cssClass: 'warning' };
    }
    return { text: 'On Track', cssClass: 'on-track' };
  }

  get currentQuestion() {
    const matrix = this.activeMatrix();
    if (!matrix || !matrix.questions) return null;
    return matrix.questions[this.currentIdx()] || null;
  }

  get totalQuestions() {
    return this.activeMatrix()?.questions.length || 0;
  }

  toggleSpeech(): void {
    this.copilotService.toggleSpeechAssist();
  }

  simulateSpeechDemo(): void {
    const q = this.currentQuestion;
    if (!q) return;
    const keywords = q.rubricItems.flatMap((r) => r.keywords).slice(0, 4);
    const demoText = `Regarding ${q.technology}, I focus on ${keywords.join(', ')} and scaling architecture.`;
    this.copilotService.simulateCandidateSpeech(demoText);
  }

  toggleRubric(rubricId: string): void {
    const q = this.currentQuestion;
    if (q) {
      this.copilotService.toggleRubricItem(q.id, rubricId);
    }
  }

  rateCurrentQuestion(score: number): void {
    this.manualScore = score;
    const q = this.currentQuestion;
    if (q) {
      this.copilotService.rateCurrentQuestion(q.id, score, this.manualNotes);
    }
  }

  onNotesChange(): void {
    const q = this.currentQuestion;
    if (q) {
      this.copilotService.rateCurrentQuestion(q.id, this.manualScore, this.manualNotes);
    }
  }

  private getCandidateShareUrl(): string {
    if (typeof window === 'undefined') return '';
    const matrix = this.activeMatrix();
    const sessionId = matrix?.id || 'default';
    let url = `${window.location.origin}/candidate-view?sessionId=${sessionId}`;

    if (matrix) {
      try {
        const payload = btoa(encodeURIComponent(JSON.stringify(matrix)));
        url += `&data=${payload}`;
      } catch {
        // Fallback to basic link
      }
    }
    return url;
  }

  openCandidateWindow(): void {
    if (typeof window !== 'undefined') {
      const url = this.getCandidateShareUrl();
      const sessionId = this.activeMatrix()?.id || 'default';
      window.open(url, `CandidateCanvasWindow_${sessionId}`, 'width=1000,height=750');
      this.broadcastActiveQuestion();
    }
  }

  syncEnabled = this.copilotService.isSyncEnabled;

  toggleSync(): void {
    this.copilotService.toggleLiveSync();
  }

  endInterviewNow(): void {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to end this interview session now? The candidate workstation will be marked as complete.')) {
        this.copilotService.endSessionImmediately();
        this.finishInterview();
      }
    }
  }

  unlockedDeviceNotice = false;

  unlockCandidateDevice(): void {
    const sessionId = this.activeMatrix()?.id;
    if (!sessionId) return;

    this.http.post<any>(`${environment.apiUrl}/interviews/session/${sessionId}/unlock`, {}).subscribe({
      next: () => {
        this.unlockedDeviceNotice = true;
        setTimeout(() => (this.unlockedDeviceNotice = false), 3500);
      },
    });
  }

  copyCandidateLink(): void {
    if (typeof window !== 'undefined') {
      const url = this.getCandidateShareUrl();
      navigator.clipboard.writeText(url).then(() => {
        this.copiedCandidateLink = true;
        setTimeout(() => (this.copiedCandidateLink = false), 3000);
      });
    }
  }

  private broadcastActiveQuestion(): void {
    this.copilotService.saveAndBroadcastSessionState();
  }

  prev(): void {
    this.saveCurrentState();
    this.copilotService.prevQuestion();
    this.loadStateForActive();
    this.broadcastActiveQuestion();
  }

  next(): void {
    this.saveCurrentState();
    this.copilotService.nextQuestion();
    this.loadStateForActive();
    this.broadcastActiveQuestion();
  }

  private saveCurrentState(): void {
    const q = this.currentQuestion;
    if (q) {
      this.copilotService.rateCurrentQuestion(q.id, this.manualScore, this.manualNotes);
    }
  }

  private loadStateForActive(): void {
    const q = this.currentQuestion;
    if (q && q.interviewerRating) {
      this.manualScore = q.interviewerRating.score;
      this.manualNotes = q.interviewerRating.notes;
    } else {
      this.manualScore = 4;
      this.manualNotes = '';
    }
    this.showLevelUp.set(false);
    this.showHint.set(false);
    this.showRedFlags.set(false);
  }

  finishInterview(): void {
    this.saveCurrentState();
    this.copilotService.finalizeAndGenerateReport();
    this.router.navigate(['/interviewer-studio/report']);
  }
}
