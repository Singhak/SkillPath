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
import { InterviewResult } from '../../../core/models/interview-result.model';
import { AiApiService } from '../../../core/services/apis/ai-api.service';
import { VoiceService } from '../../../shared/services/voice-service';
import { MockInterviewService } from '../../../core/services/mock-interview.service';

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

  readonly voiceState$ = this.voiceService.state$;

  // ------------------------------------------------
  // Interview Store
  // ------------------------------------------------

  readonly session = this.interviewService.currentSession;
  readonly currentQuestion = this.interviewService.currentQuestion;
  readonly results = this.interviewService.allQuesAns;
  readonly currentIndex = this.interviewService.currentQuestionIndex;
  readonly totalQuestions = this.interviewService.totalQuestions;
  readonly progressPercent = this.interviewService.progress;
  readonly isFinished = this.interviewService.isFinished;

  isEditingAnswer = signal(true);

  readonly source = signal<'ai' | 'upload'>('ai');
  readonly topic = signal('');
  readonly userRole = signal('');
  readonly experienceLevel = signal('');
  readonly uploadedQuestions = signal('');
  readonly email = signal('');

  readonly currentAnswer = signal('');
  readonly isRecording = signal(false);
  readonly isStarted = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor() {
    this.voiceState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
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

    this.aiApiService
      .genrateFromTopic(topic, role, experience)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const generatedQuestions = (response || []).map((question, index) => ({
            ...question,
            id: question.id ?? index + 1,
          }));

          if (!generatedQuestions.length) {
            this.errorMessage.set('No questions were generated. Please try another topic.');
            return;
          }
          this.startInterviewWithQuestions(generatedQuestions, topic);
          this.speakQuestion(generatedQuestions[0].question);
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

  onAnswerInput(value: string): void {
    this.currentAnswer.set(value);
  }

  endInterview(): void {
    this.interviewService.endInterview();

    this.topic.set('');

    this.isEditingAnswer.set(true); // Reset editing state
    this.isRecording.set(false); // Reset recording state
    this.voiceService.stopListening();

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
    this.interviewService.sendForEvaluation();
    // this.sendSummaryByEmail(this.results());
  }

  private sendSummaryByEmail(results: InterviewResult[]): void {
    const summary = results
      .map((result, index) => {
        return `Q${index + 1}: ${result.question}\nAnswer: ${result.answer}\nScore: ${result.score}/10\nFeedback: ${result.feedback}`;
      })
      .join('\n\n');

    const subject = encodeURIComponent(`Mock interview summary for ${this.topic()}`);
    const body = encodeURIComponent(
      `Hi,\n\nHere is your mock interview evaluation summary.\n\n${summary}\n\nBest regards,\nMock Interview App`,
    );

    window.location.href = `mailto:${this.email()}?subject=${subject}&body=${body}`;
  }

  private getInitialQuestionsFromNavigation(): InterviewQuestion[] {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as
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
}
