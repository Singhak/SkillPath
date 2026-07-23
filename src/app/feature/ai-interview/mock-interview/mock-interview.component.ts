import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
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
import { concatMap, from, map, of, toArray } from 'rxjs';
import { InterviewQuestion } from '../../../core/models/interview-question.model';
import { InterviewResult } from '../../../core/models/interview-result.model';
import { AiApiService } from '../../../core/services/apis/ai-api.service';
import { VoiceService } from '../../../shared/services/voice-service';

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
  ],
  templateUrl: './mock-interview.component.html',
  styleUrls: ['./mock-interview.component.css'],
})
export class MockInterviewComponent {
  private readonly aiApiService = inject(AiApiService);
  private readonly voiceService = inject(VoiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly voiceState$ = this.voiceService.state$;

  readonly source = signal<'ai' | 'upload'>('ai');
  readonly topic = signal('');
  readonly userRole = signal('');
  readonly experienceLevel = signal('');
  readonly uploadedQuestions = signal('');
  readonly email = signal('');

  readonly questions = signal<InterviewQuestion[]>([]);
  readonly currentQuestionIndex = signal(0);
  readonly answers = signal<Record<string, string>>({});
  readonly currentAnswer = signal('');
  readonly isRecording = signal(false);
  readonly isSubmitting = signal(false);
  readonly isStarted = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly results = signal<InterviewResult[]>([]);

  readonly currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()] ?? null);
  readonly currentQuestionNumber = computed(() => this.currentQuestionIndex() + 1);
  readonly progressPercent = computed(() => {
    if (!this.questions().length) {
      return 0;
    }

    return Math.round(((this.currentQuestionIndex() + 1) / this.questions().length) * 100);
  });

  constructor() {
    this.voiceState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state.transcript) {
        this.currentAnswer.set(state.transcript);
        this.saveAnswer(this.currentAnswer());
      }

      this.isRecording.set(state.listening);
    });
  }

  ngOnInit(): void {
    const initialQuestions = this.getInitialQuestionsFromNavigation();

    if (initialQuestions.length) {
      this.questions.set(initialQuestions);
      this.currentQuestionIndex.set(0);
      this.answers.set({});
      this.currentAnswer.set('');
      this.results.set([]);
      this.isStarted.set(true);
      this.speakQuestion(initialQuestions[0].question);
    }
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

      this.questions.set(parsedQuestions);
      this.currentQuestionIndex.set(0);
      this.answers.set({});
      this.currentAnswer.set('');
      this.results.set([]);
      this.isStarted.set(true);
      this.speakQuestion(parsedQuestions[0].question);
      return;
    }

    const role = this.userRole().trim() || 'Software Engineer';
    const experience = this.experienceLevel().trim() || 'Intermediate';

    this.aiApiService
      .genrateFromTopic(topic, role, experience)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const generatedQuestions = (response.questions || []).map((question, index) => ({
            ...question,
            id: question.id ?? index + 1,
          }));

          if (!generatedQuestions.length) {
            this.errorMessage.set('No questions were generated. Please try another topic.');
            return;
          }

          this.questions.set(generatedQuestions);
          this.currentQuestionIndex.set(0);
          this.answers.set({});
          this.currentAnswer.set('');
          this.results.set([]);
          this.isStarted.set(true);
          this.speakQuestion(generatedQuestions[0].question);
        },
        error: () => {
          this.errorMessage.set('Unable to generate questions right now. Please try again.');
        },
      });
  }

  goToNextQuestion(): void {
    if (!this.currentQuestion()) {
      return;
    }

    this.saveAnswer(this.currentAnswer());

    const nextIndex = this.currentQuestionIndex() + 1;

    if (nextIndex >= this.questions().length) {
      this.finishInterview();
      return;
    }

    this.currentQuestionIndex.set(nextIndex);
    this.currentAnswer.set(this.getCurrentAnswer());
    this.speakQuestion(this.currentQuestion()?.question);
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndex() === 0) {
      return;
    }

    this.saveAnswer(this.currentAnswer());
    this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    this.currentAnswer.set(this.getCurrentAnswer());
    this.speakQuestion(this.currentQuestion()?.question);
  }

  startRecording(): void {
    this.currentAnswer.set('');
    this.voiceService.startListening('en-US');
  }

  stopRecording(): void {
    this.voiceService.stopListening();
  }

  reRecord(): void {
    this.currentAnswer.set('');
    this.saveAnswer('');
    this.voiceService.startListening('en-US');
  }

  onAnswerInput(value: string): void {
    this.currentAnswer.set(value);
    this.saveAnswer(value);
  }

  finishInterview(): void {
    this.saveAnswer(this.currentAnswer());

    const emailValue = this.email().trim();

    if (!emailValue) {
      this.errorMessage.set('Please add an email address to receive your evaluation summary.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    from(this.questions())
      .pipe(
        concatMap((question) => {
          const answer = this.getAnswerForQuestion(question);

          if (!answer.trim()) {
            return of({
              question,
              answer,
              score: 0,
              feedback: 'No answer was recorded for this question.',
              idealAnswer: 'Please record an answer and try again.',
              evaluatedAt: new Date(),
            } as InterviewResult);
          }

          return this.aiApiService.generateEvaluation(question.question, answer).pipe(
            map((response) => ({
              question,
              answer,
              score: response.score,
              feedback: response.feedback,
              idealAnswer: response.idealAnswer,
              evaluatedAt: new Date(),
            }) as InterviewResult),
          );
        }),
        toArray(),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (evaluations) => {
          this.results.set(evaluations);
          this.isSubmitting.set(false);
          this.successMessage.set('Your evaluation summary is ready. We are opening your mail client.');
          this.sendSummaryByEmail(evaluations);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set('The evaluation could not be completed. Please try again.');
        },
      });
  }

  startOver(): void {
    this.isStarted.set(false);
    this.questions.set([]);
    this.currentQuestionIndex.set(0);
    this.answers.set({});
    this.currentAnswer.set('');
    this.results.set([]);
    this.isRecording.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.voiceService.stopSpeaking();
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

  private saveAnswer(answer: string): void {
    const question = this.currentQuestion();

    if (!question) {
      return;
    }

    const key = this.getQuestionKey(question);

    this.answers.update((current) => ({
      ...current,
      [key]: answer,
    }));
  }

  private getCurrentAnswer(): string {
    const question = this.currentQuestion();

    if (!question) {
      return '';
    }

    return this.getAnswerForQuestion(question);
  }

  private getAnswerForQuestion(question: InterviewQuestion): string {
    const key = this.getQuestionKey(question);
    return this.answers()[key] ?? '';
  }

  private getQuestionKey(question: InterviewQuestion): string {
    return `q-${question.id ?? this.currentQuestionIndex() + 1}`;
  }

  speakQuestion(text?: string): void {
    if (!text) {
      return;
    }

    this.voiceService.speak(text, {
      lang: 'en-US',
      rate: 0.95,
      voiceName: 'female',
    });
  }

  private sendSummaryByEmail(results: InterviewResult[]): void {
    const summary = results
      .map((result, index) => {
        return `Q${index + 1}: ${result.question.question}\nAnswer: ${result.answer}\nScore: ${result.score}/10\nFeedback: ${result.feedback}`;
      })
      .join('\n\n');

    const subject = encodeURIComponent(`Mock interview summary for ${this.topic()}`);
    const body = encodeURIComponent(`Hi,\n\nHere is your mock interview evaluation summary.\n\n${summary}\n\nBest regards,\nMock Interview App`);

    window.location.href = `mailto:${this.email()}?subject=${subject}&body=${body}`;
  }

  private getInitialQuestionsFromNavigation(): InterviewQuestion[] {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as
      | { generatedQuestions?: InterviewQuestion[] }
      | undefined;

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