import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap, throwError } from 'rxjs';

import { GroqService } from './groq.service';

import { InterviewResult } from '../models/interview-result.model';
import { InterviewStore } from '../models/interview-store.model';
import { InterviewSession } from '../models/interview-session.model';
import { AiApiService } from './apis/ai-api.service';
import { InterviewQuestion } from '../models/interview-question.model';
import { levelToWeight } from '../../shared/constants';

@Injectable()
export class InterviewService {
  private aiAPiService = inject(AiApiService);

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

  startInterview(topic: string, userRole: string, experienceLevel: string, count: number) {
    this.resetStore();

    return this.aiAPiService.genrateFromTopic(topic, userRole, experienceLevel, count).pipe(
      tap((response) => {
        const session: InterviewSession = {
          topic,
          questions: response,
          currentQuestionIndex: 0,
          startedAt: new Date(),
        };

        this.patch({
          session,
        });
      }),
    );
  }

  startInterviewWithQuestions(questions: InterviewQuestion[], topic: string) {
    this.resetStore();

    const session: InterviewSession = {
      topic,
      questions,
      currentQuestionIndex: 0,
      startedAt: new Date(),
    };

    this.patch({
      session,
    });

    return of(session);
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

    const dataToSend = {
      question: question.question,
      weight: levelToWeight(question.level),
      answer,
    };

    return this.aiAPiService.generateEvaluation(dataToSend).pipe(
      finalize(() => {
        this.patch({
          evaluating: false,
        });
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
      tap((response) => {
        const processResponse = (res: any) => ({
          question,
          answer,
          score: res.score,
          feedback: res.feedback,
          idealAnswer: res.idealAnswer,
          evaluatedAt: new Date(),
        });

        const results: InterviewResult[] = Array.isArray(response)
          ? response.map(processResponse)
          : [processResponse(response)];

        this.patch({
          currentResult: results[0], // Show the first result as current
          results: [...this.results(), ...results],
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
