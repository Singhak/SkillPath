import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { KnobModule } from 'primeng/knob';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InterviewService } from '../../core/services/interview.service';
import { VoiceService } from '../../shared/services/voice-service';

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
    KnobModule,
    TagModule,
    ChipModule,
    ProgressSpinnerModule,
    DividerModule,
  ],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
})
export class InterviewComponent {
  private interviewService = inject(InterviewService);
  private voiceService = inject(VoiceService);
  private destroyRef = inject(DestroyRef);

  // --------------------
  // Interview State
  // --------------------

  topic = signal('');

  interviewState = computed(() => this.interviewService.session());

  currentQuestion = computed(() => this.interviewService.currentQuestion());

  isFinished = computed(() => this.interviewService.isInterviewFinished());

  // --------------------
  // Voice
  // --------------------

  voiceState$ = this.voiceService.state$;

  userAnswer = signal('');

  // --------------------
  // AI Evaluation
  // --------------------

  evaluating = signal(false);

  feedback = signal('');

  score = signal<number | null>(null);

  idealAnswer = signal<string | null>(null);

  // --------------------
  // Final Result
  // --------------------

  finalScore = signal<number | null>(null);

  constructor() {
    this.voiceService.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state.transcript) {
        this.userAnswer.set(state.transcript);
      }
    });
  }

  // --------------------
  // Start Interview
  // --------------------

  startInterview() {
    const value = this.topic().trim();

    if (!value) {
      return;
    }

    this.interviewService.startInterview(value).subscribe();
  }

  // --------------------
  // Read Question
  // --------------------

  speakQuestion(text?: string) {
    const question = text ?? this.currentQuestion()?.text;

    if (!question) {
      return;
    }

    this.voiceService.speak(question, {
      lang: 'en-US',
      rate: 0.9,
    });
  }

  // --------------------
  // Voice Answer
  // --------------------

  startRecording() {
    this.userAnswer.set('');

    this.feedback.set('');

    this.score.set(null);

    this.idealAnswer.set(null);

    this.voiceService.startListening('en-US');
  }

  stopRecordingAndEvaluate() {
    this.voiceService.stopListening();

    const answer = this.userAnswer().trim();

    if (!answer) {
      return;
    }

    this.evaluateAnswer(answer);
  }

  private evaluateAnswer(answer: string) {
    this.evaluating.set(true);

    this.interviewService
      .submitAnswer(answer)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          /*
             Expected API response:

             {
                score:8,
                feedback:"Good answer",
                idealAnswer:"Signals are..."
             }

          */

          this.score.set(response.score);

          this.feedback.set(response.feedback);

          this.idealAnswer.set(response.idealAnswer);

          this.evaluating.set(false);

          // AI speaks feedback

          this.voiceService.speak(response.feedback);
        },

        error: () => {
          this.evaluating.set(false);

          this.feedback.set('Unable to evaluate answer. Please try again.');
        },
      });
  }

  // --------------------
  // Next Question
  // --------------------

  nextQuestion() {
    this.userAnswer.set('');

    this.feedback.set('');

    this.score.set(null);

    this.idealAnswer.set(null);

    this.interviewService.nextQuestion();
  }

  // --------------------
  // Finish
  // --------------------

  endInterview() {
    this.interviewService.endInterview();

    this.topic.set('');

    this.userAnswer.set('');

    this.feedback.set('');

    this.score.set(null);

    this.idealAnswer.set(null);

    this.finalScore.set(null);
  }
}
