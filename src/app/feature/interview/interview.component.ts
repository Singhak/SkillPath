import { Component, DestroyRef, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    ProgressSpinnerModule,
    DividerModule,
    ChipModule,
    TagModule,
    KnobModule,
  ],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
})
export class InterviewComponent {
  private readonly interviewService = inject(InterviewService);
  private readonly voiceService = inject(VoiceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly interviewTips = [
    'Explain concepts clearly',
    'Give practical examples',
    'Mention trade-offs',
    'Speak confidently',
  ];

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

  isRecordinStop = signal(false);

  constructor() {
    this.voiceState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state.transcript) {
        this.userAnswer.set(state.transcript);
      }
      if (!state.listening) {
        this.isRecordinStop.set(true);
      }
    });
  }

  // ------------------------------------------------
  // Interview
  // ------------------------------------------------

  startInterview(): void {
    const topic = this.topic().trim();

    if (!topic) {
      return;
    }

    this.interviewService
      .startInterview(topic)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  endInterview(): void {
    this.interviewService.endInterview();

    this.topic.set('');

    this.userAnswer.set('');

    this.voiceService.stopListening();

    this.voiceService.stopSpeaking();
  }

  nextQuestion(): void {
    this.userAnswer.set('');

    this.interviewService.nextQuestion();
  }

  // ------------------------------------------------
  // Voice
  // ------------------------------------------------

  startRecording(): void {
    this.userAnswer.set('');

    this.interviewService.clearCurrentResult();

    this.voiceService.startListening('en-US');
  }

  stopRecording() {
    this.voiceService.stopListening();
  }

  stopRecordingAndEvaluate(): void {
    this.voiceService.stopListening();

    const answer = this.userAnswer().trim();

    if (!answer) {
      return;
    }

    this.interviewService
      .submitAnswer(answer)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const result = this.currentResult();

        if (result) {
          this.voiceService.speak(result.feedback);
        }
      });
  }

  // ------------------------------------------------
  // Speech
  // ------------------------------------------------

  speakQuestion(text?: string): void {
    const question = text ?? this.currentQuestion()?.text;

    if (!question) {
      return;
    }

    this.voiceService.speak(question, {
      lang: 'en-US',
      rate: 0.9,
    });
  }
}
