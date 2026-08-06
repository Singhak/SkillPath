import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  InterviewRequirementConfig,
  InterviewQuestionItem,
  InterviewSessionMatrix,
  TeamTemplate,
  CandidateAssessmentReport,
  TechWeightConfig,
  RubricItem,
} from '../models/interviewer-studio.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewerCopilotService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeMatrix = signal<InterviewSessionMatrix | null>(null);
  readonly currentQuestionIndex = signal<number>(0);
  readonly speechAssistActive = signal<boolean>(false);
  readonly liveTranscript = signal<string>('');
  readonly autoCheckedRubricsCount = signal<number>(0);
  readonly isSyncEnabled = signal<boolean>(true);
  readonly isSessionEnded = signal<boolean>(false);
  readonly activeReport = signal<CandidateAssessmentReport | null>(null);

  // Pre-configured Team Templates
  readonly teamTemplates = signal<TeamTemplate[]>([
    {
      id: 'template-mean-aws-senior',
      title: 'Senior MEAN Stack + AWS Architecture',
      description: 'Standard 60-min technical deep-dive for senior full-stack engineers with heavy Node.js, Angular, MongoDB, and AWS cloud expertise.',
      role: 'Senior Full Stack Engineer',
      experienceLevel: 'Senior (5-8 Yrs)',
      roundType: 'Deep Technical (60 Min)',
      tags: ['MEAN Stack', 'AWS', 'Node.js', 'MongoDB', 'Angular'],
      technologies: [
        { name: 'JavaScript / Node.js', weightPercentage: 30, questionCount: 3 },
        { name: 'Angular (v15+)', weightPercentage: 25, questionCount: 2 },
        { name: 'MongoDB & Mongoose', weightPercentage: 20, questionCount: 2 },
        { name: 'AWS Cloud Services', weightPercentage: 15, questionCount: 2 },
        { name: 'Behavioral & System Design', weightPercentage: 10, questionCount: 1 },
      ],
    },
    {
      id: 'template-frontend-angular',
      title: 'Senior Angular Specialist',
      description: 'Focused round on Angular architecture, Signals, RxJS performance, micro-frontends, and web performance metrics.',
      role: 'Senior Frontend Developer',
      experienceLevel: 'Senior (5-8 Yrs)',
      roundType: 'Deep Technical (60 Min)',
      tags: ['Angular', 'RxJS', 'Signals', 'TypeScript'],
      technologies: [
        { name: 'Angular Core & Signals', weightPercentage: 40, questionCount: 4 },
        { name: 'TypeScript & Async Patterns', weightPercentage: 30, questionCount: 3 },
        { name: 'RxJS & State Management', weightPercentage: 20, questionCount: 2 },
        { name: 'Web Performance & Security', weightPercentage: 10, questionCount: 1 },
      ],
    },
    {
      id: 'template-backend-node-aws',
      title: 'Node.js + AWS Microservices Lead',
      description: 'High-throughput backend engineering, AWS Serverless architecture, MongoDB scaling, and distributed locks.',
      role: 'Backend Architect',
      experienceLevel: 'Staff / Lead (8+ Yrs)',
      roundType: 'System Design & Architecture (60 Min)',
      tags: ['Node.js', 'AWS Lambda', 'MongoDB', 'System Design'],
      technologies: [
        { name: 'Node.js Microservices', weightPercentage: 35, questionCount: 3 },
        { name: 'AWS Architecture (Lambda/SQS)', weightPercentage: 30, questionCount: 3 },
        { name: 'MongoDB Aggregation & Scaling', weightPercentage: 20, questionCount: 2 },
        { name: 'Distributed Systems & Security', weightPercentage: 15, questionCount: 2 },
      ],
    },
  ]);

  private syncChannel: BroadcastChannel | null = null;
  private speechRecognition: any = null;
  private copilotFinalizedText: string = '';

  constructor() {
    this.initSyncChannel();
    this.initWebSpeech();
    this.loadSavedTemplates();
    this.loadSessionFromStorage();
  }

  private initSyncChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.syncChannel = new BroadcastChannel('interviewer_session_sync');
    }
  }

  loadSessionFromStorage(targetSessionId?: string, encodedData?: string | null): void {
    if (encodedData) {
      try {
        const decodedJson = decodeURIComponent(atob(encodedData));
        const matrix: InterviewSessionMatrix = JSON.parse(decodedJson);
        if (matrix && matrix.questions && Array.isArray(matrix.questions)) {
          this.activeMatrix.set(matrix);
          if (typeof window !== 'undefined' && window.localStorage && matrix.id) {
            localStorage.setItem(`skillpath_active_matrix_${matrix.id}`, JSON.stringify(matrix));
            localStorage.setItem('skillpath_active_matrix', JSON.stringify(matrix));
            localStorage.setItem('skillpath_last_session_id', matrix.id);
          }
          return;
        }
      } catch (err) {
        console.warn('Unable to decode candidate URL session payload', err);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const sId = targetSessionId || localStorage.getItem('skillpath_last_session_id');
        const matrixKey = sId ? `skillpath_active_matrix_${sId}` : 'skillpath_active_matrix';
        const idxKey = sId ? `skillpath_current_question_index_${sId}` : 'skillpath_current_question_index';

        const savedMatrix = localStorage.getItem(matrixKey) || localStorage.getItem('skillpath_active_matrix');
        const savedIdx = localStorage.getItem(idxKey) || localStorage.getItem('skillpath_current_question_index');
        const savedReport = localStorage.getItem('skillpath_latest_assessment_report');

        if (savedMatrix) {
          const matrix: InterviewSessionMatrix = JSON.parse(savedMatrix);
          this.activeMatrix.set(matrix);
        }
        if (savedIdx !== null) {
          const idx = parseInt(savedIdx, 10);
          if (!isNaN(idx)) {
            this.currentQuestionIndex.set(idx);
          }
        }
        if (savedReport) {
          this.activeReport.set(JSON.parse(savedReport));
        }
      } catch {
        // Fallback gracefully
      }
    }
  }

  toggleLiveSync(): boolean {
    const newState = !this.isSyncEnabled();
    this.isSyncEnabled.set(newState);
    this.saveAndBroadcastSessionState();
    return newState;
  }

  endSessionImmediately(): void {
    this.isSessionEnded.set(true);
    this.saveAndBroadcastSessionState();
  }

  saveAndBroadcastSessionState(): void {
    const matrix = this.activeMatrix();
    const index = this.currentQuestionIndex();
    const sessionId = matrix?.id;
    const isSyncEnabled = this.isSyncEnabled();
    const isEnded = this.isSessionEnded();

    if (typeof window !== 'undefined' && window.localStorage) {
      if (matrix) {
        localStorage.setItem('skillpath_active_matrix', JSON.stringify(matrix));
        if (sessionId) {
          localStorage.setItem(`skillpath_active_matrix_${sessionId}`, JSON.stringify(matrix));
          localStorage.setItem('skillpath_last_session_id', sessionId);
        }
      }
      localStorage.setItem('skillpath_current_question_index', String(index));
      if (sessionId) {
        localStorage.setItem(`skillpath_current_question_index_${sessionId}`, String(index));
      }
    }

    // Server-side cross-computer API synchronization
    if (sessionId) {
      this.http.post(`${environment.apiUrl}/interviews/session/${sessionId}/sync`, {
        currentQuestionIndex: index,
        matrix,
        isSyncEnabled,
        isEnded,
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channelNames = ['interviewer_session_sync'];
      if (sessionId) {
        channelNames.push(`interviewer_session_sync_${sessionId}`);
      }

      channelNames.forEach((name) => {
        try {
          const bc = new BroadcastChannel(name);
          bc.postMessage({
            type: 'SYNC_MATRIX',
            matrix,
            index,
            sessionId,
            isSyncEnabled,
            isEnded,
          });
          bc.postMessage({
            type: 'SYNC_QUESTION',
            index,
            sessionId,
            isSyncEnabled,
            isEnded,
          });
          bc.close();
        } catch {
          // Fallback
        }
      });
    }
  }

  private loadSavedTemplates(): void {
    // Fetch team templates from backend API
    this.http.get<TeamTemplate[]>(`${environment.apiUrl}/interviews/templates`).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (serverTemplates) => {
        if (serverTemplates && serverTemplates.length > 0) {
          this.teamTemplates.set(serverTemplates);
        }
      },
      error: () => {
        // Fallback to local storage if offline
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = localStorage.getItem('skillpath_team_templates');
          if (saved) {
            try {
              const customTemplates = JSON.parse(saved);
              this.teamTemplates.update((current) => [...current, ...customTemplates]);
            } catch {
              // Fallback to default
            }
          }
        }
      },
    });
  }

  saveCustomTemplate(template: TeamTemplate): void {
    this.teamTemplates.update((current) => [template, ...current]);
    if (typeof window !== 'undefined' && window.localStorage) {
      const customOnly = this.teamTemplates().filter((t) => t.id.startsWith('custom-'));
      localStorage.setItem('skillpath_team_templates', JSON.stringify(customOnly));
    }
    // Async save to backend team template library
    this.http.post(`${environment.apiUrl}/interviews/templates`, template).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // --- Dynamic Question Matrix Generator ---
  generateInterviewMatrix(config: InterviewRequirementConfig): InterviewSessionMatrix {
    const questions: InterviewQuestionItem[] = [];

    config.technologies.forEach((tech) => {
      const techQuestions = this.getQuestionsForTech(tech.name, config.experienceLevel, config.roundType, tech.questionCount);
      questions.push(...techQuestions);
    });

    const matrix: InterviewSessionMatrix = {
      id: `session-${Date.now()}`,
      config,
      questions,
      startedAt: new Date().toISOString(),
    };

    this.activeMatrix.set(matrix);
    this.currentQuestionIndex.set(0);
    this.saveAndBroadcastSessionState();
    return matrix;
  }

  private getQuestionsForTech(
    techName: string,
    experience: string,
    roundType: string,
    count: number
  ): InterviewQuestionItem[] {
    const bank = TECH_QUESTION_BANK[techName] || TECH_QUESTION_BANK['JavaScript / Node.js'];
    // Filter or pick best questions matching count
    const selected = bank.slice(0, Math.max(1, count));
    return selected.map((q, idx) => ({
      ...q,
      id: `${techName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}-${idx}`,
      rubricItems: q.rubricItems.map((r) => ({ ...r, checked: false })),
    }));
  }

  // --- Speech Recognition Auto-Rubric Tagging ---
  private initWebSpeech(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';

        this.speechRecognition.onresult = (event: any) => {
          let currentSessionText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSessionText += event.results[i][0].transcript;
          }
          const fullText = (this.copilotFinalizedText ? this.copilotFinalizedText + ' ' : '') + currentSessionText;
          this.liveTranscript.set(fullText);
          this.matchTranscriptWithActiveRubrics(fullText.toLowerCase());
        };

        this.speechRecognition.onend = () => {
          this.copilotFinalizedText = this.liveTranscript();
          if (this.speechAssistActive()) {
            try {
              this.speechRecognition.start();
            } catch {
              // already active or stopped
            }
          }
        };

        this.speechRecognition.onerror = (event: any) => {
          if (event?.error === 'no-speech' && this.speechAssistActive()) {
            return;
          }
          if (event?.error !== 'no-speech') {
            this.speechAssistActive.set(false);
          }
        };
      }
    }
  }

  toggleSpeechAssist(): boolean {
    const newState = !this.speechAssistActive();
    this.speechAssistActive.set(newState);

    if (newState && this.speechRecognition) {
      try {
        this.copilotFinalizedText = '';
        this.liveTranscript.set('');
        this.speechRecognition.start();
      } catch {
        // Already started
      }
    } else if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch {
        // Already stopped
      }
    }
    return newState;
  }

  simulateCandidateSpeech(spokenText: string): void {
    this.speechAssistActive.set(true);
    this.liveTranscript.set(spokenText);
    this.matchTranscriptWithActiveRubrics(spokenText.toLowerCase());
  }

  private matchTranscriptWithActiveRubrics(spokenText: string): void {
    const matrix = this.activeMatrix();
    const idx = this.currentQuestionIndex();
    if (!matrix || !matrix.questions[idx]) return;

    const currentQ = matrix.questions[idx];
    let updated = false;

    currentQ.rubricItems.forEach((rubric) => {
      if (!rubric.checked) {
        const matches = rubric.keywords.some((keyword) => spokenText.includes(keyword.toLowerCase()));
        if (matches) {
          rubric.checked = true;
          updated = true;
          this.autoCheckedRubricsCount.update((n) => n + 1);
        }
      }
    });

    if (updated) {
      this.activeMatrix.set({ ...matrix });
      this.saveAndBroadcastSessionState();
    }
  }

  toggleRubricItem(questionId: string, rubricId: string): void {
    const matrix = this.activeMatrix();
    if (!matrix) return;

    const q = matrix.questions.find((item) => item.id === questionId);
    if (q) {
      const r = q.rubricItems.find((item) => item.id === rubricId);
      if (r) {
        r.checked = !r.checked;
        this.activeMatrix.set({ ...matrix });
        this.saveAndBroadcastSessionState();
      }
    }
  }

  rateCurrentQuestion(questionId: string, score: number, notes: string): void {
    const matrix = this.activeMatrix();
    if (!matrix) return;

    const q = matrix.questions.find((item) => item.id === questionId);
    if (q) {
      q.interviewerRating = {
        score,
        notes,
        completedAt: new Date().toISOString(),
      };
      this.activeMatrix.set({ ...matrix });
      this.saveAndBroadcastSessionState();
    }
  }

  nextQuestion(): void {
    const matrix = this.activeMatrix();
    if (matrix && this.currentQuestionIndex() < matrix.questions.length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
      this.liveTranscript.set('');
      this.saveAndBroadcastSessionState();
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
      this.liveTranscript.set('');
      this.saveAndBroadcastSessionState();
    }
  }

  // --- Generate Post-Interview Candidate Assessment Report ---
  finalizeAndGenerateReport(): CandidateAssessmentReport {
    const matrix = this.activeMatrix();
    if (!matrix) throw new Error('No active interview matrix found');

    matrix.endedAt = new Date().toISOString();

    let totalWeightedScore = 0;
    let maxPossibleScore = 0;

    const techMap: { [key: string]: { scoreTotal: number; maxTotal: number; count: number } } = {};
    const categoryMap: { [key: string]: { scoreTotal: number; maxTotal: number; count: number } } = {};

    const detailedQuestionScores = matrix.questions.map((q) => {
      const rubricMatchCount = q.rubricItems.filter((r) => r.checked).length;
      const totalRubricCount = q.rubricItems.length;

      // Auto score calculation if not manually rated
      let finalScore = q.interviewerRating?.score || 0;
      if (!q.interviewerRating && totalRubricCount > 0) {
        finalScore = Math.round((rubricMatchCount / totalRubricCount) * 5);
      }

      totalWeightedScore += finalScore;
      maxPossibleScore += 5;

      // Tech rollup
      if (!techMap[q.technology]) {
        techMap[q.technology] = { scoreTotal: 0, maxTotal: 0, count: 0 };
      }
      techMap[q.technology].scoreTotal += finalScore;
      techMap[q.technology].maxTotal += 5;
      techMap[q.technology].count += 1;

      // Category rollup
      if (!categoryMap[q.category]) {
        categoryMap[q.category] = { scoreTotal: 0, maxTotal: 0, count: 0 };
      }
      categoryMap[q.category].scoreTotal += finalScore;
      categoryMap[q.category].maxTotal += 5;
      categoryMap[q.category].count += 1;

      return {
        questionText: q.questionText,
        technology: q.technology,
        score: finalScore,
        notes: q.interviewerRating?.notes || 'No manual notes added.',
        rubricMatchCount,
        totalRubricCount,
      };
    });

    const overallScorePercent = maxPossibleScore > 0 ? Math.round((totalWeightedScore / maxPossibleScore) * 100) : 0;

    let recommendation: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire' = 'Lean Hire';
    if (overallScorePercent >= 85) recommendation = 'Strong Hire';
    else if (overallScorePercent >= 70) recommendation = 'Hire';
    else if (overallScorePercent >= 55) recommendation = 'Lean Hire';
    else recommendation = 'No Hire';

    const technologyScores = Object.keys(techMap).map((tech) => ({
      techName: tech,
      score: Math.round((techMap[tech].scoreTotal / techMap[tech].maxTotal) * 100),
      questionsEvaluated: techMap[tech].count,
    }));

    const categoryScores = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      score: Math.round((categoryMap[cat].scoreTotal / categoryMap[cat].maxTotal) * 100),
    }));

    const strengths: string[] = [];
    const areasForImprovement: string[] = [];

    technologyScores.forEach((t) => {
      if (t.score >= 75) {
        strengths.push(`Demonstrated high proficiency in ${t.techName} (${t.score}%)`);
      } else {
        areasForImprovement.push(`Needs improvement in ${t.techName} fundamentals (${t.score}%)`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Communicated thoughts clearly during problem breakdown.');
    }

    const start = matrix.startedAt ? new Date(matrix.startedAt) : new Date();
    const end = matrix.endedAt ? new Date(matrix.endedAt) : new Date();
    const startTimeFormatted = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const durationMins = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));
    const durationFormatted = `${durationMins} min${durationMins > 1 ? 's' : ''}`;

    const report: CandidateAssessmentReport = {
      sessionId: matrix.id,
      candidateName: matrix.config.candidateName || 'Candidate',
      jobTitle: matrix.config.jobTitle || 'Full Stack Engineer',
      experienceLevel: matrix.config.experienceLevel,
      roundType: matrix.config.roundType,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      startTimeFormatted,
      durationFormatted,
      overallScore: overallScorePercent,
      recommendation,
      summaryFeedback: `Candidate scored ${overallScorePercent}% overall. Recommendation: ${recommendation.toUpperCase()}. Displayed key strengths in ${strengths[0] || 'core technologies'}.`,
      strengths,
      areasForImprovement,
      technologyScores,
      categoryScores,
      detailedQuestionScores,
    };

    matrix.overallScore = overallScorePercent;
    matrix.recommendation = recommendation;
    this.activeMatrix.set({ ...matrix });
    this.activeReport.set(report);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('skillpath_latest_assessment_report', JSON.stringify(report));
    }

    // Save report asynchronously to backend API
    this.http.post(`${environment.apiUrl}/interviews/reports`, report).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    return report;
  }
}

// --- Comprehensive Curated Question Bank for MEAN Stack + AWS & Beyond ---
const TECH_QUESTION_BANK: { [techName: string]: Omit<InterviewQuestionItem, 'id'>[] } = {
  'JavaScript / Node.js': [
    {
      technology: 'JavaScript / Node.js',
      category: 'CodingSnippet',
      difficulty: 'Hard',
      estimatedMinutes: 8,
      questionText: 'Explain the execution output of this code snippet and how Node.js event loop prioritizes Microtasks vs Macrotasks.',
      contextOrCodeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');`,
      idealAnswerSummary: 'Correct order is 1, 5, 4, 3, 2. process.nextTick runs in the nextTickQueue before microtasks (Promises), which execute before macrotasks (timers).',
      rubricItems: [
        { id: 'r1', title: 'Identified sync output first (1, 5)', keywords: ['sync', 'synchronous', 'call stack', '1', '5'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Identified process.nextTick precedence (4)', keywords: ['nextTick', 'nextTickQueue', 'priority', '4'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Identified Promise microtask queue (3)', keywords: ['microtask', 'promise', 'then', '3'], checked: false, scoreWeight: 1 },
        { id: 'r4', title: 'Identified setTimeout macrotask queue (2)', keywords: ['macrotask', 'timer', 'settimeout', 'event loop phase', '2'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'What happens if a process.nextTick recursively calls process.nextTick? How does Node prevent or cause I/O starvation?',
        simplifyingHint: 'Think about which queue has the absolute highest priority in Node.js before Promise callbacks.',
        redFlags: ['Confuses Node.js event loop with multi-threading', 'Thinks setTimeout(0) runs instantly before sync code'],
      },
    },
    {
      technology: 'JavaScript / Node.js',
      category: 'ScenarioBased',
      difficulty: 'Medium',
      estimatedMinutes: 7,
      questionText: 'Your Node.js API server experiences high memory usage (heap out of memory) under heavy traffic. How do you profile and prevent memory leaks?',
      idealAnswerSummary: 'Use heap snapshots via v8 inspect/clinic.js, check for unclosed event listeners, global variable accumulation, unhandled promises, and streaming large payloads with stream pipelines instead of buffer in-memory loading.',
      rubricItems: [
        { id: 'r1', title: 'Mentioned Heap Snapshots / V8 Profiler', keywords: ['heap snapshot', 'v8', 'clinic.js', 'chrome devtools', 'memwatch'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Identified Event Listener & Closure Leaks', keywords: ['event listener', 'closure', 'global variable', 'circular reference'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Advocated Node Streams over In-Memory Buffers', keywords: ['stream', 'pipeline', 'buffer', 'chunk', 'highWaterMark'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'How would you tune V8 garbage collection flags (--max-old-space-size) in a Kubernetes pod container?',
        simplifyingHint: 'Consider what happens when you read a 2GB file directly into memory using fs.readFile vs fs.createReadStream.',
        redFlags: ['Suggests restarting server automatically without root cause fix', 'Does not know what a heap snapshot is'],
      },
    },
    {
      technology: 'JavaScript / Node.js',
      category: 'Conceptual',
      difficulty: 'Medium',
      estimatedMinutes: 6,
      questionText: 'Explain Node.js Worker Threads vs Cluster module. When would you use each?',
      idealAnswerSummary: 'Cluster forks multiple Node.js processes sharing a server port for multi-core HTTP scaling. Worker threads run isolated JS threads with shared memory (SharedArrayBuffer) inside a single process, ideal for CPU-bound tasks like image processing or cryptography.',
      rubricItems: [
        { id: 'r1', title: 'Cluster Module (Multi-Process IPC & Port Sharing)', keywords: ['cluster', 'fork', 'process', 'ipc', 'port', 'multi core'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Worker Threads (CPU Intensive & SharedArrayBuffer)', keywords: ['worker threads', 'cpu', 'sharedarraybuffer', 'thread pool', 'threads'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'How do Worker Threads pass memory efficiently without copying data using Transferable Objects?',
        simplifyingHint: 'Which one creates multiple process IDs (PIDs) and which one operates within a single process?',
        redFlags: ['Thinks Node.js Worker Threads make JavaScript multi-threaded for normal I/O calls'],
      },
    },
  ],
  'Angular (v15+)': [
    {
      technology: 'Angular (v15+)',
      category: 'ScenarioBased',
      difficulty: 'Hard',
      estimatedMinutes: 8,
      questionText: 'Explain Angular Signals vs RxJS Observables. How do Signals improve change detection performance over Zone.js?',
      idealAnswerSummary: 'Signals provide fine-grained reactivity directly notifying dependent DOM nodes without requiring Zone.js global component tree dirty checking. RxJS handles async data streams, cancellation, and event composition.',
      rubricItems: [
        { id: 'r1', title: 'Fine-Grained Change Detection without Zone.js', keywords: ['fine-grained', 'zone.js', 'dirty check', 'reactivity', 'signal'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Signal Primitives (writable, computed, effect)', keywords: ['writable', 'computed', 'effect', 'untracked'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Interoperability (toSignal / toObservable)', keywords: ['tosignal', 'toobservable', 'rxjs interop'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'When would an effect() be dangerous to use for state mutation, and why does untracked() exist?',
        simplifyingHint: 'How does Angular know exactly which DOM element to update when a signal value changes compared to OnPush?',
        redFlags: ['Believes Signals completely replace RxJS for all asynchronous WebSocket or HTTP operations'],
      },
    },
    {
      technology: 'Angular (v15+)',
      category: 'Architecture',
      difficulty: 'Medium',
      estimatedMinutes: 7,
      questionText: 'How do you optimize initial bundle loading and runtime performance in a large enterprise Angular application?',
      idealAnswerSummary: 'Lazy loading routes, Standalone components, deferrable views (@defer), OnPush change detection, image optimization (NgOptimizedImage), bundle budget enforcement, and SSR with hydration.',
      rubricItems: [
        { id: 'r1', title: 'Lazy Loading & @defer block optimizations', keywords: ['lazy loading', 'defer', 'bundle size', 'code splitting'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'OnPush Change Detection Strategy', keywords: ['onpush', 'changedetectionstrategy', 'immutable'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Angular SSR & Event Replay / Hydration', keywords: ['ssr', 'hydration', 'angular universal', 'server side rendering'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'How does @defer (on viewport; prefetch on idle) work under the hood with ES dynamic imports?',
        simplifyingHint: 'What change detection strategy prevents child components from re-rendering unless an @Input reference changes?',
        redFlags: ['Does not use lazy loading for large feature modules'],
      },
    },
  ],
  'MongoDB & Mongoose': [
    {
      technology: 'MongoDB & Mongoose',
      category: 'ScenarioBased',
      difficulty: 'Hard',
      estimatedMinutes: 8,
      questionText: 'You have a collection of 50 million user order documents. Aggregation queries for sales reporting take 15 seconds. How do you optimize?',
      idealAnswerSummary: 'Analyze with explain("executionStats"), create compound index matching $match and $sort stages, place $match stage at the start of pipeline, use $facet or materialized views ($merge) for pre-aggregated stats.',
      rubricItems: [
        { id: 'r1', title: 'Used explain("executionStats") for index scan analysis', keywords: ['explain', 'executionstats', 'IXSCAN', 'COLLSCAN', 'index scan'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Compound Indexing & Pipeline Order Optimization', keywords: ['compound index', 'match stage', 'sort stage', 'esr rule'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Materialized Views / $merge for pre-aggregation', keywords: ['merge', 'out', 'materialized view', 'pre-aggregate', 'cron aggregation'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'Explain the ESR (Equality, Sort, Range) rule for multi-field compound indexes in MongoDB.',
        simplifyingHint: 'Where should the $match stage be placed in an aggregation pipeline to filter documents early?',
        redFlags: ['Performs array filtering in JavaScript memory after fetching all 50 million records'],
      },
    },
    {
      technology: 'MongoDB & Mongoose',
      category: 'Conceptual',
      difficulty: 'Medium',
      estimatedMinutes: 6,
      questionText: 'Explain MongoDB Transactions (ACID) vs Schema Embedding vs Referencing design patterns.',
      idealAnswerSummary: 'Embed for 1-to-1 or 1-to-few containment; Reference for 1-to-many or unbounded growing arrays. Multi-document transactions provide ACID compliance across collections using Replica Set wiredTiger engine.',
      rubricItems: [
        { id: 'r1', title: 'Document Embedding vs Referencing tradeoffs', keywords: ['embed', 'reference', '16mb limit', 'unbounded'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Multi-Document ACID Transactions with Sessions', keywords: ['transaction', 'acid', 'session', 'starttransaction', 'commitTransaction'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'Why does embedding an unbounded array lead to document fragmentation and the 16MB document size limit?',
        simplifyingHint: 'If an order has 5 items, embed or reference? What if a user has 1,000,000 log events?',
        redFlags: ['Thinks MongoDB does not support transactions at all'],
      },
    },
  ],
  'AWS Cloud Services': [
    {
      technology: 'AWS Cloud Services',
      category: 'Architecture',
      difficulty: 'Hard',
      estimatedMinutes: 8,
      questionText: 'Design a resilient AWS architecture for a MEAN stack application handling 100,000 daily active users with auto-scaling and security.',
      idealAnswerSummary: 'Route53 DNS -> CloudFront CDN -> S3 (Angular SPA frontend). ALB Load Balancer -> EC2 Auto Scaling Group or ECS Fargate (Node.js API). MongoDB Atlas or AWS DocumentDB in private subnet across Multi-AZ. Secrets Manager & IAM Roles.',
      rubricItems: [
        { id: 'r1', title: 'Static Frontend: CloudFront CDN + S3 Bucket', keywords: ['cloudfront', 's3', 'cdn', 'static host'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Backend: ALB + ECS Fargate / EC2 Auto Scaling', keywords: ['alb', 'load balancer', 'ecs', 'fargate', 'auto scaling', 'ec2'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Database & Security: Private Subnets, VPC, IAM, Secrets', keywords: ['vpc', 'private subnet', 'iam role', 'secrets manager', 'multi-az'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'How would you implement Zero-Downtime Blue/Green deployment using AWS ECS or AWS CodeDeploy?',
        simplifyingHint: 'Where should the frontend Angular app files be stored versus where the backend Node.js API runs?',
        redFlags: ['Puts MongoDB database in a public subnet with 0.0.0.0/0 open security group'],
      },
    },
    {
      technology: 'AWS Cloud Services',
      category: 'ScenarioBased',
      difficulty: 'Medium',
      estimatedMinutes: 7,
      questionText: 'How do you handle background processing (e.g. email sending, video processing) in a Serverless AWS Node.js stack?',
      idealAnswerSummary: 'Node API pushes messages to AWS SQS queue. AWS Lambda function triggers asynchronously from SQS batch with Dead Letter Queue (DLQ) for failed retries.',
      rubricItems: [
        { id: 'r1', title: 'Decoupling with AWS SQS Queue', keywords: ['sqs', 'queue', 'decouple', 'message queue'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Asynchronous Processing with AWS Lambda', keywords: ['lambda', 'serverless', 'trigger', 'event source mapping'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Dead Letter Queue (DLQ) for Error Handling', keywords: ['dlq', 'dead letter', 'retry', 'exponential backoff'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'How do you handle Lambda cold starts and concurrency limits when processing high SQS spikes?',
        simplifyingHint: 'Why is pushing an email job to a queue better than making the HTTP user request wait for the email to send?',
        redFlags: ['Runs synchronous blocking email calls directly inside the HTTP request loop'],
      },
    },
  ],
  'Behavioral & System Design': [
    {
      technology: 'Behavioral & System Design',
      category: 'BehavioralSTAR',
      difficulty: 'Medium',
      estimatedMinutes: 8,
      questionText: 'Describe a situation where a critical production bug occurred due to tech debt or architectural flaw. How did you handle the Situation, Task, Action, and Result (STAR)?',
      idealAnswerSummary: 'Evaluates STAR framework: Clear ownership, root cause analysis (post-mortem), blameless culture, immediate mitigation vs long-term refactoring, and preventative telemetry/monitoring.',
      rubricItems: [
        { id: 'r1', title: 'STAR Structure (Situation, Task, Action, Result)', keywords: ['situation', 'task', 'action', 'result', 'star'], checked: false, scoreWeight: 1 },
        { id: 'r2', title: 'Root Cause & Immediate Incident Containment', keywords: ['rollback', 'mitigation', 'root cause', 'post-mortem', 'monitoring'], checked: false, scoreWeight: 1 },
        { id: 'r3', title: 'Long-term Systemic Fix & Automated Prevention', keywords: ['test coverage', 'refactor', 'prevention', 'ci/cd', 'telemetry'], checked: false, scoreWeight: 1 },
      ],
      probes: {
        levelUpProbe: 'What telemetry metrics (SRE Golden Signals) did you establish to catch this error before users noticed?',
        simplifyingHint: 'Focus on what action YOU specifically took to fix the immediate issue and prevent it from recurring.',
        redFlags: ['Blames teammate or management', 'Does not take personal accountability'],
      },
    },
  ],
};
