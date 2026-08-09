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
import { KnobModule } from 'primeng/knob';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

import { InterviewService } from '../../../core/services/interview.service';
import { VoiceService } from '../../../shared/services/voice-service';
import { InterviewQuestion } from '../../../core/models/interview-question.model';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { finalize } from 'rxjs';
import { AI_CREDIT_COST, EXPERIENCE_LEVELS, INTERVIEW_TIPS, USER_ROLES } from '../../../shared/constants';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from "primeng/table";
import { SelectModule } from "primeng/select";
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    DividerModule,
    ChipModule,
    TagModule,
    KnobModule,
    PanelModule,
    AutoCompleteModule,
    TableModule,
    SelectModule,
    BadgeModule
  ],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  providers: [InterviewService],
})
export class InterviewComponent {
  private readonly interviewService = inject(InterviewService);
  private readonly voiceService = inject(VoiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  // ------------------------------------------------
  // Constants
  // ------------------------------------------------

  readonly interviewTips = INTERVIEW_TIPS;
  readonly userRoles = USER_ROLES;
  readonly experienceLevels = EXPERIENCE_LEVELS;
  readonly freeCredits = this.authService.freeCredits;
  readonly paidCredits = this.authService.paidCredits;
  // Properties to hold filtered suggestions
  filteredExperienceLevels: string[] = [];
  filteredUserRoles: string[] = [];

  readonly questionCount = signal<number>(5);
  questionCountOptions = [1, 5, 10, 15];

  jobDescription = signal('');
  userRole = signal('');
  experienceLevel = signal('');

  readonly loading = signal(false);

  // ------------------------------------------------
  // UI State
  // ------------------------------------------------

  topic = signal('');

  userAnswer = signal('');

  // ------------------------------------------------
  // Voice
  // ------------------------------------------------

  readonly voiceState$ = this.voiceService.state$;

  // ------------------------------------------------
  // Interview Store
  // ------------------------------------------------

  readonly session = this.interviewService.session;

  readonly currentQuestion = this.interviewService.currentQuestion;

  readonly currentResult = this.interviewService.currentResult;

  readonly results = this.interviewService.results;

  readonly evaluating = this.interviewService.evaluating;

  readonly progress = this.interviewService.progress;

  readonly finalScore = this.interviewService.finalScore;

  readonly isFinished = this.interviewService.isInterviewFinished;

  isRecording = signal(false);
  isEditingAnswer = signal(true); // User can edit answer by default (before recording)

  constructor() {
    this.voiceState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state.transcript) {
        this.userAnswer.set(state.transcript);
      }
      this.isRecording.set(state.listening);
      if (!state.listening && !this.evaluating()) {
        this.isEditingAnswer.set(true);
      }
    });

    // Watch for evaluation state changes to control editing
    effect(() => {
      // The answer is editable if we are NOT recording AND NOT evaluating.
      const editable = !this.isRecording() && !this.evaluating();
      this.isEditingAnswer.set(editable);
    });
  }

  ngOnInit(): void {
    const initialQuestions = this.getInitialQuestionsFromNavigation();

    if (initialQuestions.length) {
      this.topic.set('Job Description Practice');
      this.startInterviewWithQuestions(initialQuestions, 'Job Description Practice');
    }
  }

  // ------------------------------------------------
  // Interview
  // ------------------------------------------------

  startInterview(): void {
    const topic = this.topic().trim();

    if (!topic) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Topic Required',
        detail: 'Please enter an interview topic before starting.',
      });
      return;
    }

    const count = Number(this.questionCount()) || 5;
    const requiredCredits = count * AI_CREDIT_COST.QUESTION_GENERATION;
    const availableCredits = this.freeCredits() + this.paidCredits();

    if (availableCredits < requiredCredits) {
      this.messageService.add({
        severity: 'error',
        summary: 'Insufficient Credits',
        detail: `Generating ${count} question(s) requires ${requiredCredits} AI credit(s). You have ${availableCredits} credit(s).`,
        life: 5000,
      });
      return;
    }

    this.loading.set(true);
    this.interviewService
      .startInterview(topic, this.userRole(), this.experienceLevel(), count)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
          this.speakQuestion();
        }),
      )
      .subscribe({
        next: () => {
          this.authService.refreshCreditsAndCoins().subscribe();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'Failed to generate interview questions. Please try again.',
          });
        }
      });
  }

  startInterviewWithQuestions(questions: InterviewQuestion[], topic: string): void {
    if (!questions.length) {
      return;
    }

    this.interviewService
      .startInterviewWithQuestions(questions, topic)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.speakQuestion()),
      )
      .subscribe();
  }

  endInterview(): void {
    this.interviewService.endInterview();

    this.topic.set('');

    this.userAnswer.set('');

    this.isEditingAnswer.set(true); // Reset editing state
    this.isRecording.set(false); // Reset recording state
    this.voiceService.stopListening();

    this.voiceService.stopSpeaking();
  }

  nextQuestion(): void {
    this.userAnswer.set('');
    this.isEditingAnswer.set(true); // Allow editing for the next question
    this.isRecording.set(false); // Ensure recording is off

    this.interviewService.nextQuestion();
    this.speakQuestion();
  }

  onUserAnswerInput(value: string): void {
    this.userAnswer.set(value);
  }

  // ------------------------------------------------
  // Voice
  // ------------------------------------------------

  startRecording(): void {
    this.userAnswer.set('');

    this.interviewService.clearCurrentResult();

    this.isEditingAnswer.set(false); // Disable editing while recording
    this.voiceService.startListening('en-US');
  }

  stopRecording() {
    this.voiceService.stopListening();
    // The voiceState$ subscription will handle setting isRecording to false and isEditingAnswer to true
  }

  stopRecordingAndEvaluate(): void {
    this.voiceService.stopListening();
    this.isEditingAnswer.set(false); // Disable editing during evaluation

    const answer = this.userAnswer().trim();

    if (!answer) {
      return;
    }

    const aiCreditCost = AI_CREDIT_COST.QUESTION_EVALUATION;
    if (this.freeCredits() + this.paidCredits() < aiCreditCost) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Credits',
        detail: 'Insufficient credits to evaluate your answer.',
      });
      return;
    }

    this.interviewService
      .submitAnswer(answer)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const result = this.currentResult();
        this.voiceService.setStateIdle();
        if (result && Object.keys(result).length > 0) {
          this.voiceService.speak(result.feedback);
          this.authService.refreshCreditsAndCoins().subscribe();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Somthing went wrong',
          });
        }
      });
  }

  // ------------------------------------------------
  // Speech
  // ------------------------------------------------

  speakQuestion(text?: string): void {
    const question = text ?? this.currentQuestion()?.question; // Standardize to 'question' property

    if (!question) {
      return;
    }

    this.voiceService.speak(question, {
      lang: 'en-US',
      rate: 0.9,
      voiceName: 'female',
    });
  }
  ///

  /**
   * Filters experience levels or user rolesbased on the user's query.
   * It also includes the query itself as a suggestion to allow custom values.
   * @param event The autocomplete complete event.
   * @param list the list on which filter apply
   * @param category type of filer on experience level or userRole
   */

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
}
