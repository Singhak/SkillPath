import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';

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

import { InterviewService } from '../../../core/services/interview.service';
import { VoiceService } from '../../../shared/services/voice-service';
import { PanelModule } from 'primeng/panel';

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
    PanelModule
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
    effect(
      () => {
        if (this.evaluating()) {
          this.isEditingAnswer.set(false); // Disable editing while evaluating
        } else if (!this.isRecording()) {
          this.isEditingAnswer.set(true); // Enable editing if not evaluating and not recording
        }
        console.log('Evaluation state changed (via effect):', this.evaluating());
      },
      { allowSignalWrites: false },
    );

    effect(() => {
      console.log(this.currentQuestion())
      this.speakQuestion(this.currentQuestion()?.text)
    })
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

    this.interviewService
      .submitAnswer(answer)
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const result = this.currentResult();
        this.voiceService.setStateIdle();
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
      voiceName:'female'
    });
  }
}
