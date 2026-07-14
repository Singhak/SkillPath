import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { GroqService } from './groq.service';

import { InterviewResult } from '../models/interview-result.model';
import { InterviewStore } from '../models/interview-store.model';
import { InterviewSession } from '../models/interview-session.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private groqService = inject(GroqService);

  //--------------------------------------------------
  // Store
  //--------------------------------------------------

  private store = signal<InterviewStore>({
    session: null,
    results: [],
    currentResult: null,
    evaluating: false,
  });

  readonly state = this.store.asReadonly();

  //--------------------------------------------------
  // Computed
  //--------------------------------------------------

  readonly session = computed(() => this.store().session);

  readonly results = computed(() => this.store().results);

  readonly currentResult = computed(() => this.store().currentResult);

  readonly evaluating = computed(() => this.store().evaluating);

  readonly currentQuestion = computed(() => {
    const session = this.session();

    if (!session) {
      return null;
    }

    return session.questions[session.currentQuestionIndex];
  });

  readonly isInterviewFinished = computed(() => {
    const session = this.session();

    if (!session) {
      return false;
    }

    return session.currentQuestionIndex >= session.questions.length;
  });

  readonly progress = computed(() => {
    const session = this.session();

    if (!session) {
      return 0;
    }

    return ((session.currentQuestionIndex + 1) / session.questions.length) * 100;
  });

  readonly finalScore = computed(() => {
    const results = this.results();

    if (!results.length) {
      return null;
    }

    const total = results.reduce((sum, item) => sum + item.score, 0);

    return Math.round(total / results.length);
  });

  //--------------------------------------------------
  // Start Interview
  //--------------------------------------------------

  startInterview(topic: string) {
    this.resetStore();

    return this.groqService.getInterviewQuestions(topic).pipe(
      tap((questions) => {
        const session: InterviewSession = {
          topic,
          questions,
          currentQuestionIndex: 0,
          startedAt: new Date(),
        };

        this.patch({
          session,
        });
      }),
    );
  }

  //--------------------------------------------------
  // Submit Answer
  //--------------------------------------------------

  submitAnswer(answer: string) {
    const question = this.currentQuestion();

    if (!question) {
      return;
    }

    this.patch({
      evaluating: true,
    });

    return this.groqService.evaluateAnswer(question.text, answer).pipe(
      tap((response:any) => {
        const result: InterviewResult = {
          question,

          answer,

          score: response.score,

          feedback: response.feedback,

          idealAnswer: response.idealAnswer,

          evaluatedAt: new Date(),
        };

        this.patch({
          currentResult: result,

          results: [...this.results(), result],

          evaluating: false,
        });
      }),
    );
  }

  //--------------------------------------------------
  // Navigation
  //--------------------------------------------------

  nextQuestion() {
    const session = this.session();

    if (!session) {
      return;
    }

    this.patch({
      session: {
        ...session,

        currentQuestionIndex: session.currentQuestionIndex + 1,
      },

      currentResult: null,
    });
  }

  //--------------------------------------------------
  // Reset
  //--------------------------------------------------

  clearCurrentResult() {
    this.patch({
      currentResult: null,
    });
  }

  endInterview() {
    this.resetStore();
  }

  //--------------------------------------------------
  // Helpers
  //--------------------------------------------------

  private patch(value: Partial<InterviewStore>) {
    this.store.update((state) => ({
      ...state,
      ...value,
    }));
  }

  private resetStore() {
    this.store.set({
      session: null,

      results: [],

      currentResult: null,

      evaluating: false,
    });
  }
}
