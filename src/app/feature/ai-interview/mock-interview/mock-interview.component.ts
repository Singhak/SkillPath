import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InterviewQuestion } from '../../../core/models/interview-question.model';
import { AiApiService } from '../../../core/services/apis/ai-api.service';
import { VoiceService } from '../../../shared/services/voice-service';
import { MockInterviewService } from '../../../core/services/mock-interview.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { AI_CREDIT_COST, EXPERIENCE_LEVELS, USER_ROLES } from '../../../shared/constants';
import { finalize, tap } from 'rxjs';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-mock-interview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    ProgressSpinnerModule,
    DividerModule,
    ChipModule,
    TagModule,
    FileUploadModule,
    AutoCompleteModule,
    SelectModule
  ],
  templateUrl: './mock-interview.component.html',
  styleUrls: ['./mock-interview.component.css'],
  providers: [MockInterviewService],
})
export class MockInterviewComponent {
  private readonly aiApiService = inject(AiApiService);
  private readonly voiceService = inject(VoiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly interviewService = inject(MockInterviewService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  readonly voiceState$ = this.voiceService.state$;

  // ------------------------------------------------
  // Interview State
  // ------------------------------------------------

  readonly session = this.interviewService.currentSession;
  readonly currentQuestion = this.interviewService.currentQuestion;
  readonly results = this.interviewService.allQuesAns;
  readonly currentIndex = this.interviewService.currentQuestionIndex;
  readonly totalQuestions = this.interviewService.totalQuestions;
  readonly progressPercent = this.interviewService.progress;
  readonly isFinished = this.interviewService.isFinished;
  readonly freeCredits = this.authService.freeCredits;
  readonly paidCredits = this.authService.paidCredits;
  readonly userRoles = USER_ROLES;
  readonly experienceLevels = EXPERIENCE_LEVELS;

  // Properties to hold filtered suggestions
  filteredExperienceLevels: string[] = [];
  filteredUserRoles: string[] = [];

  isEditingAnswer = signal(true);

  readonly source = signal<'ai' | 'upload'>('ai');
  readonly topic = signal('');
  readonly userRole = signal('');
  readonly experienceLevel = signal('');
  readonly questionCountOptions = [1, 5, 10, 15];
  readonly questionCount = signal<number>(5);
  readonly uploadedQuestions = signal('');
  readonly email = signal('');

  readonly currentAnswer = signal('');
  readonly isRecording = signal(false);
  readonly isStarted = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly loading = signal(false);

  constructor() {

    this.voiceState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state.transcript) {
        this.currentAnswer.set(state.transcript);
      }
      this.isRecording.set(state.listening);
    });
    effect(() => {
      if (this.session()) this.session()!.answer = this.currentAnswer();
    });
  }

  ngOnInit(): void {
    const initialQuestions = this.getInitialQuestionsFromNavigation();
    if (initialQuestions.length)
      this.startInterviewWithQuestions(initialQuestions, 'Job Description Practice');
  }

  startInterviewWithQuestions(questions: InterviewQuestion[], topic: string): void {
    if (!questions.length) {
      return;
    }
    this.topic.set(topic);
    this.isStarted.set(true);
    this.interviewService.setQuestons(questions);
  }

  generateQuestions(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const topic = this.topic().trim();

    if (!topic) {
      this.errorMessage.set('Please enter a topic before starting the mock interview.');
      return;
    }

    if (this.source() === 'upload') {
      const parsedQuestions = this.parseUploadedQuestions(this.uploadedQuestions());

      if (!parsedQuestions.length) {
        this.errorMessage.set('Please upload or paste at least one question.');
        return;
      }

      this.startInterviewWithQuestions(parsedQuestions, topic);
      this.speakQuestion(this.currentQuestion()?.question);
      return;
    }

    const role = this.userRole().trim() || 'Software Engineer';
    const experience = this.experienceLevel().trim() || 'Intermediate';
    const count = Number(this.questionCount()) || 5;

    const requiredCredits = count * AI_CREDIT_COST.QUESTION_GENERATION;
    const availableCredits = this.freeCredits() + this.paidCredits();

    if (availableCredits < requiredCredits) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Insufficient AI Credits. Generating ${count} question(s) requires ${requiredCredits} AI credit(s).`,
        life: 5000,
      });
      return;
    }

    this.loading.set(true);
    this.aiApiService
      .genrateFromTopic(topic, role, experience, count)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          const rawQuestions = Array.isArray(response)
            ? response
            : (response as any)?.questions && Array.isArray((response as any).questions)
            ? (response as any).questions
            : response && typeof response === 'object' && (response as any).question
            ? [response]
            : [];

          const generatedQuestions = rawQuestions.slice(0, count).map((question: any, index: number) => ({
            ...question,
            id: question.id ?? index + 1,
          }));

          if (!generatedQuestions.length) {
            this.errorMessage.set('No questions were generated. Please try another topic.');
            return;
          }
          const actualCost = generatedQuestions.length * AI_CREDIT_COST.QUESTION_GENERATION;
          this.startInterviewWithQuestions(generatedQuestions, topic);
          this.speakQuestion(generatedQuestions[0].question);
          this.authService.decrementAiCredits(actualCost).pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe();
        },
        error: () => {
          this.errorMessage.set('Unable to generate questions right now. Please try again.');
        },
      });
  }

  startRecording(): void {
    this.currentAnswer.set('');
    this.voiceService.startListening('en-US');
  }

  stopRecording(): void {
    this.voiceService.stopListening();
    this.isEditingAnswer.set(false); // Disable editing during evaluation
  }

  reRecord(): void {
    this.currentAnswer.set('');
    this.voiceService.startListening('en-US');
  }

  endInterview(): void {
    this.interviewService.endInterview();

    this.topic.set('');
    this.isStarted.set(false);
    this.isEditingAnswer.set(true); // Reset editing state
    this.isRecording.set(false); // Reset recording state
    this.voiceService.stopListening();
    this.currentAnswer.set('');
    this.voiceService.stopSpeaking();
  }

  nextQuestion(): void {
    this.currentAnswer.set('');
    this.isEditingAnswer.set(true); // Allow editing for the next question
    this.isRecording.set(false); // Ensure recording is off
    this.interviewService.nextQuestion();
    this.speakQuestion(this.currentQuestion()?.question);
  }

  onFileSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.uploadedQuestions.set(e.target?.result as string);
      reader.readAsText(file);
    }
  }

  private parseUploadedQuestions(text: string): InterviewQuestion[] {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((question, index) => ({
        id: index + 1,
        question,
        type: 'uploaded',
        skill: 'Uploaded question',
        level: 'any',
      }));
  }

  speakQuestion(text?: string): void {
    if (!text) {
      return;
    }

    this.voiceService.speak(text, {
      lang: 'en-US',
      rate: 0.95,
    });
  }

  finishAndEval() {
    // filter out results where answer is empty or whitespace
    const resultsWithAns = this.results().filter((result) => result.answer.trim().length > 0);
    if (resultsWithAns.length <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Results',
        detail: 'You have no results to evaluate.',
      });
      return;
    }
    const evaluationCost = resultsWithAns.length * AI_CREDIT_COST.QUESTION_EVALUATION;
    if (this.freeCredits() + this.paidCredits() < evaluationCost) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Credits',
        detail: 'You have no more AI evaluation credits for today. Please try again tomorrow.',
      });
      return;
    }
    this.loading.set(true);
    this.interviewService.sendForEvaluation(resultsWithAns).pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.authService.decrementAiCredits(evaluationCost).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe();
        this.endInterview();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send for evaluation',
          life: 5000,
        });
      },
    });
  }

  private getInitialQuestionsFromNavigation(): InterviewQuestion[] {
    const navigationState = this.router.currentNavigation()?.extras.state as
      { generatedQuestions?: InterviewQuestion[] } | undefined;

    const stateQuestions = navigationState?.generatedQuestions;

    if (Array.isArray(stateQuestions) && stateQuestions.length) {
      return stateQuestions;
    }

    const queryQuestions = this.route.snapshot.queryParamMap.get('generatedQuestions');

    if (!queryQuestions) {
      return [];
    }

    try {
      const parsedQuestions = JSON.parse(queryQuestions);
      return Array.isArray(parsedQuestions) ? parsedQuestions : [];
    } catch {
      return [];
    }
  }

  startOver() {
    this.interviewService.endInterview()
  }

  search(event: AutoCompleteCompleteEvent, list: string[], category: string) {
    const query = event.query;
    let filtered: string[] = [];

    // Filter predefined types
    if (list) {
      filtered = list.filter((type) => type.toLowerCase().includes(query.toLowerCase()));
    }

    // Add the custom query to the suggestions if it's not already there
    if (query && !filtered.some((type) => type.toLowerCase() === query.toLowerCase())) {
      filtered.unshift(query);
    }
    if (category == 'experienceLevel') this.filteredExperienceLevels = filtered;
    else if (category == 'userRole') this.filteredUserRoles = filtered;
  }
}
