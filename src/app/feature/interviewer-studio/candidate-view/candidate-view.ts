import { Component, inject, signal, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InterviewerCopilotService } from '../../../core/services/interviewer-copilot.service';
import { InterviewQuestionItem, InterviewSessionMatrix } from '../../../core/models/interviewer-studio.model';

@Component({
  selector: 'app-candidate-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="candidate-canvas">
      <!-- Interview Completed Thank You Screen -->
      <div *ngIf="isInterviewEnded(); else sessionActiveState" class="completed-card card">
        <span class="done-icon">🎉</span>
        <h2>Interview Session Completed!</h2>
        <p class="done-desc">
          Thank you for participating in your technical interview session for <strong>{{ activeMatrix()?.config?.jobTitle || 'this position' }}</strong>.
          Your pseudocode, solution notes, and responses have been successfully submitted to the interviewer.
        </p>
        <div class="done-meta">
          <span>✅ Status: Evaluation Submitted</span>
          <p>You may safely close this browser window now.</p>
        </div>
      </div>

      <ng-template #sessionActiveState>
        <!-- Anti-Cheating Device Lock Security Warning -->
        <div *ngIf="isDeviceLocked(); else mainWorkstation" class="locked-card card">
          <span class="lock-icon">🚨</span>
          <h2>Access Denied: Active Session on Another Device</h2>
          <p class="lock-desc">
            This interview session is currently active on another device/browser.
            Simultaneous access from multiple machines is strictly prohibited for proctoring and exam integrity.
          </p>
          <div class="lock-meta">
            <span>🔒 Active Device Lock Enforcement</span>
            <p>If you legitimately disconnected or switched devices, please ask your interviewer to click <strong>"🔓 Unlock Lock"</strong> on their dashboard.</p>
          </div>
          <button type="button" class="btn-sync" (click)="retryClaimSession()">
            🔄 Re-check Session Status
          </button>
        </div>

        <ng-template #mainWorkstation>
        <!-- Top Clean Header for Candidate -->
        <header class="canvas-header">
          <div class="brand">
            <span class="logo">⚡</span>
            <div>
              <h2 class="title">{{ activeMatrix()?.config?.jobTitle || 'Technical Interview Session' }}</h2>
              <p class="sub">Candidate Assessment Workspace</p>
            </div>
          </div>
          <div class="header-right">
            <span class="round-badge">{{ activeMatrix()?.config?.roundType || 'Technical Round' }}</span>
            <div class="timer-badge">
              <span>⏱️ Elapsed: {{ elapsedFormatted }}</span>
            </div>
          </div>
        </header>

        <!-- Main Candidate Workstation -->
        <main *ngIf="currentQuestion as q; else waitingState" class="canvas-main">
          <div class="question-container card">
            <div class="q-meta">
              <span class="tech-chip">{{ q.technology }}</span>
              <span class="cat-chip">{{ q.category }}</span>
              <span class="q-num">Question {{ currentIdx() + 1 }} of {{ totalQuestions }}</span>
            </div>
            <h1 class="q-prompt">{{ q.questionText }}</h1>

            <!-- Code Snippet / Context Box -->
            <div *ngIf="q.contextOrCodeSnippet" class="code-container">
              <div class="code-header">
                <span>Code Snippet / Problem Context</span>
              </div>
              <pre><code>{{ q.contextOrCodeSnippet }}</code></pre>
            </div>
          </div>

          <!-- Candidate Live Code & Scratchpad Editor -->
          <div class="editor-container card">
            <div class="editor-header">
              <span>📝 Candidate Code / Notes Scratchpad</span>
              <span class="hint-text">Type your solution or pseudocode here</span>
            </div>
            <textarea
              [(ngModel)]="candidateCode"
              (input)="onCodeChange()"
              placeholder="// Write your solution, pseudocode, or architectural notes here..."
              class="code-editor"
              rows="16"
            ></textarea>
          </div>
        </main>
      </ng-template>

        <ng-template #waitingState>
          <div class="waiting-card card">
            <span class="spinner">⏳</span>
            <h2>Waiting for Interviewer...</h2>
            <p>The interview session will begin shortly. If using Incognito Mode or a separate browser window, paste your interview link below:</p>
            <div class="sync-input-group">
              <input
                type="text"
                [(ngModel)]="manualLinkInput"
                placeholder="Paste full candidate link (e.g. http://localhost:4200/candidate-view?sessionId=...&data=...)"
                class="sync-input"
              />
              <button type="button" class="btn-sync" (click)="loadFromManualLink()">
                ⚡ Load Session
              </button>
            </div>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .candidate-canvas {
      min-height: 100vh;
      background: #090d16;
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 1.5rem;
    }
    .canvas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .logo {
      font-size: 2rem;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: #f8fafc;
    }
    .sub {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .round-badge {
      font-size: 0.8rem;
      padding: 0.3rem 0.7rem;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border-radius: 8px;
      font-weight: 600;
    }
    .timer-badge {
      font-size: 0.85rem;
      font-family: 'Fira Code', monospace;
      font-weight: 700;
      color: #38bdf8;
      padding: 0.3rem 0.7rem;
      background: rgba(15, 23, 42, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .canvas-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.5rem;
    }
    .q-meta {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }
    .tech-chip {
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      background: rgba(99, 102, 241, 0.25);
      color: #a5b4fc;
      border-radius: 6px;
      font-weight: 700;
    }
    .cat-chip {
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      background: rgba(168, 85, 247, 0.2);
      color: #d8b4fe;
      border-radius: 6px;
      font-weight: 600;
    }
    .q-num {
      margin-left: auto;
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .q-prompt {
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.4;
      margin: 0 0 1.2rem 0;
    }
    .code-container {
      background: #050811;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }
    .code-header {
      padding: 0.5rem 0.9rem;
      background: rgba(255, 255, 255, 0.05);
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .code-container pre {
      padding: 1rem;
      margin: 0;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      overflow-x: auto;
    }
    .editor-container {
      display: flex;
      flex-direction: column;
    }
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: #e2e8f0;
    }
    .hint-text {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 400;
    }
    .code-editor {
      flex: 1;
      width: 100%;
      padding: 1rem;
      background: #050811;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: #38bdf8;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      outline: none;
      resize: vertical;
    }
    .code-editor:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }
    .waiting-card {
      text-align: center;
      padding: 5rem 2rem;
      max-width: 500px;
      margin: 3rem auto;
    }
    .sync-input-group {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    .sync-input {
      flex: 1;
      padding: 0.75rem 1rem;
      background: #050811;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #f8fafc;
      font-size: 0.85rem;
      outline: none;
    }
    .btn-sync {
      padding: 0.75rem 1.2rem;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border: none;
      border-radius: 10px;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .locked-card {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 600px;
      margin: 4rem auto;
      border: 1px solid rgba(239, 68, 68, 0.4);
      background: rgba(24, 15, 26, 0.85);
      box-shadow: 0 12px 32px rgba(239, 68, 68, 0.15);
    }
    .lock-icon {
      font-size: 3.5rem;
      display: block;
      margin-bottom: 1rem;
    }
    .lock-desc {
      color: #fca5a5;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .lock-meta {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .lock-meta span {
      color: #f43f5e;
      font-weight: 700;
      display: block;
      margin-bottom: 0.4rem;
    }
    .completed-card {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 600px;
      margin: 4rem auto;
      border: 1px solid rgba(16, 185, 129, 0.4);
      background: rgba(15, 28, 23, 0.85);
      box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15);
    }
    .done-icon {
      font-size: 3.5rem;
      display: block;
      margin-bottom: 1rem;
    }
    .done-desc {
      color: #a7f3d0;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .done-meta {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #cbd5e1;
    }
    .done-meta span {
      color: #34d399;
      font-weight: 700;
      display: block;
      margin-bottom: 0.4rem;
    }
    @media (max-width: 900px) {
      .canvas-main { grid-template-columns: 1fr; }
    }
  `],
})
export class CandidateViewComponent implements OnInit, OnDestroy {
  readonly copilotService = inject(InterviewerCopilotService);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  activeMatrix = this.copilotService.activeMatrix;
  currentIdx = this.copilotService.currentQuestionIndex;

  manualLinkInput = '';
  candidateDeviceId = this.getOrCreateDeviceId();
  isDeviceLocked = signal<boolean>(false);
  isInterviewEnded = signal<boolean>(false);
  private candidateCodeMap: { [idx: number]: string } = {};

  elapsedSeconds = signal<number>(0);
  private timerInterval: any = null;
  private backendPollInterval: any = null;
  private channel: BroadcastChannel | null = null;
  private storageEventListener: ((e: StorageEvent) => void) | null = null;

  private getOrCreateDeviceId(): string {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let id = sessionStorage.getItem('candidate_device_id');
      if (!id) {
        id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('candidate_device_id', id);
      }
      return id;
    }
    return `dev_${Date.now()}`;
  }

  get candidateCode(): string {
    return this.candidateCodeMap[this.currentIdx()] || '';
  }

  set candidateCode(val: string) {
    this.candidateCodeMap[this.currentIdx()] = val;
  }

  sessionId: string | null = null;
  private sessionChannel: BroadcastChannel | null = null;

  ngOnInit(): void {
    let encodedData: string | null = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      this.sessionId = urlParams.get('sessionId');
      encodedData = urlParams.get('data');
    }

    // Hydrate session matrix and question index from encoded payload or storage
    this.copilotService.loadSessionFromStorage(this.sessionId || undefined, encodedData);
    this.claimSessionLock();
    this.startTimer();
    this.initSyncChannel();
    this.initStorageEventListener();
    this.startBackendPolling();
  }

  claimSessionLock(): void {
    const sId = this.sessionId || this.activeMatrix()?.id;
    if (!sId) return;

    this.http.post<any>(`${environment.apiUrl}/interviews/session/${sId}/claim`, {
      candidateDeviceId: this.candidateDeviceId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Candidate Device',
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 'GRANTED') {
          this.isDeviceLocked.set(false);
        }
      },
      error: (err) => {
        if (err.status === 403 || err.error?.reason === 'SESSION_LOCKED_OTHER_DEVICE') {
          this.isDeviceLocked.set(true);
        }
      },
    });
  }

  retryClaimSession(): void {
    this.claimSessionLock();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.backendPollInterval) clearInterval(this.backendPollInterval);
    if (this.channel) this.channel.close();
    if (this.sessionChannel) this.sessionChannel.close();
    if (typeof window !== 'undefined' && this.storageEventListener) {
      window.removeEventListener('storage', this.storageEventListener);
    }
  }

  private initSyncChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const handleMsg = (event: MessageEvent) => {
        if (!event.data) return;
        // Verify target session if event includes sessionId
        if (this.sessionId && event.data.sessionId && event.data.sessionId !== this.sessionId) {
          return;
        }

        if (event.data.type === 'SYNC_QUESTION' && typeof event.data.index === 'number') {
          this.copilotService.currentQuestionIndex.set(event.data.index);
        } else if (event.data.type === 'SYNC_MATRIX') {
          if (event.data.matrix) {
            this.copilotService.activeMatrix.set(event.data.matrix);
          }
          if (typeof event.data.index === 'number') {
            this.copilotService.currentQuestionIndex.set(event.data.index);
          }
        }
      };

      this.channel = new BroadcastChannel('interviewer_session_sync');
      this.channel.onmessage = handleMsg;

      if (this.sessionId) {
        this.sessionChannel = new BroadcastChannel(`interviewer_session_sync_${this.sessionId}`);
        this.sessionChannel.onmessage = handleMsg;
      }
    }
  }

  private initStorageEventListener(): void {
    if (typeof window !== 'undefined') {
      this.storageEventListener = (event: StorageEvent) => {
        const sId = this.sessionId || this.activeMatrix()?.id;
        const indexKey = sId ? `skillpath_current_question_index_${sId}` : 'skillpath_current_question_index';
        const matrixKey = sId ? `skillpath_active_matrix_${sId}` : 'skillpath_active_matrix';

        if ((event.key === indexKey || event.key === 'skillpath_current_question_index') && event.newValue !== null) {
          const idx = parseInt(event.newValue, 10);
          if (!isNaN(idx)) {
            this.copilotService.currentQuestionIndex.set(idx);
          }
        } else if ((event.key === matrixKey || event.key === 'skillpath_active_matrix') && event.newValue) {
          try {
            const matrix = JSON.parse(event.newValue);
            this.copilotService.activeMatrix.set(matrix);
          } catch {
            // Ignore parse errors
          }
        }
      };
      window.addEventListener('storage', this.storageEventListener);
    }
  }

  private startTimer(): void {
    const matrix = this.activeMatrix();
    if (matrix && matrix.startedAt) {
      const startMs = new Date(matrix.startedAt).getTime();
      this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));

      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          this.elapsedSeconds.set(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
        }, 1000);
      }
    }
  }

  get currentQuestion(): InterviewQuestionItem | null {
    const matrix = this.activeMatrix();
    if (!matrix || !matrix.questions) return null;
    return matrix.questions[this.currentIdx()] || null;
  }

  get totalQuestions(): number {
    return this.activeMatrix()?.questions.length || 0;
  }

  get elapsedFormatted(): string {
    const totalSec = this.elapsedSeconds();
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private startBackendPolling(): void {
    const poll = () => {
      const sId = this.sessionId || this.activeMatrix()?.id;
      if (!sId) return;

      this.http.get<any>(`${environment.apiUrl}/interviews/session/${sId}/sync`).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (data) => {
          if (data) {
            if (data.isEnded) {
              this.isInterviewEnded.set(true);
              return;
            }

            if (data.matrix && !this.activeMatrix()) {
              this.copilotService.activeMatrix.set(data.matrix);
            }

            // Sync index only if sync is enabled on interviewer side
            if (data.isSyncEnabled !== false) {
              if (typeof data.currentQuestionIndex === 'number' && data.currentQuestionIndex !== this.currentIdx()) {
                this.copilotService.currentQuestionIndex.set(data.currentQuestionIndex);
              }
            }
          }
        },
        error: () => {},
      });
    };

    poll();
    this.backendPollInterval = setInterval(poll, 1500);
  }

  onCodeChange(): void {
    // Send candidate live typing to interviewer dashboard
    if (this.channel) {
      this.channel.postMessage({
        type: 'CANDIDATE_CODE_UPDATE',
        code: this.candidateCode,
        questionIndex: this.currentIdx(),
      });
    }

    const sId = this.sessionId || this.activeMatrix()?.id;
    if (sId) {
      this.http.post(`${environment.apiUrl}/interviews/session/${sId}/sync`, { candidateCode: this.candidateCode }).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    }
  }

  loadFromManualLink(): void {
    if (!this.manualLinkInput.trim()) return;
    try {
      const urlStr = this.manualLinkInput.trim();
      const queryIdx = urlStr.indexOf('?');
      if (queryIdx !== -1) {
        const query = urlStr.substring(queryIdx);
        const params = new URLSearchParams(query);
        const sId = params.get('sessionId');
        const data = params.get('data');

        if (sId) this.sessionId = sId;
        this.copilotService.loadSessionFromStorage(sId || undefined, data);
        this.startTimer();
      }
    } catch {
      alert('Could not parse session link. Please ensure you copied the entire URL.');
    }
  }
}
