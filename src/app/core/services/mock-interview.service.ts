import { computed, inject, Injectable, signal } from '@angular/core';
import { InterviewResult } from '../models/interview-result.model';
import { single } from 'rxjs';
import { InterviewQuestion } from '../models/interview-question.model';
import { levelToWeight } from '../../shared/constants';
import { AiApiService } from './apis/ai-api.service';

Injectable();
export class MockInterviewService {
  aiApiService = inject(AiApiService);
  private item = signal<InterviewResult>({
    question: null,
    answer: '',
    score: 0,
    feedback: '',
    idealAnswer: '',
    evaluatedAt: new Date(),
  });

  private index = signal(0);
  readonly totalQuestions = computed(() => this.questions().length);
  private questions = signal<InterviewQuestion[]>([]);
  readonly currentQuestionIndex = computed(() => this.index());
  readonly currentQuestion = computed(() => this.questions().at(this.index()));

  private store = signal<InterviewResult[]>([{ ...this.item() }]);
  readonly allQuesAns = computed(() => this.store());
  readonly currentSession = computed(() => this.store().at(-1));

  setQuestons(questions: InterviewQuestion[]) {
    this.questions.set(questions);
    this.currentSession()!.question = this.questions()[this.index()];
  }

  nextQuestion() {
    if (this.index() < this.questions().length - 1) {
      this.index.set(this.index() + 1);
      const session = this.item();
      session.question = this.questions()[this.index()];
      this.patch({ ...session });
    }
  }

  endInterview() {
    this.resetStore();
  }

  private patch(value: InterviewResult) {
    this.store.update((state) => [...state, value]);
  }

  private resetStore() {
    this.store.set([]);
    this.questions.set([]);
    this.index.set(0);
    this.item.set({
      question: null,
      answer: '',
      score: 0,
      feedback: '',
      idealAnswer: '',
      evaluatedAt: new Date(),
    });
  }

  readonly progress = computed(() => {
    return (((this.currentQuestionIndex() + 1) / this.questions().length) * 100).toFixed(0);
  });

  readonly isFinished = computed(() => {
    return this.currentQuestionIndex() + 1 >= this.questions().length;
  });

  sendForEvaluation(results: InterviewResult[]) {
    const dataToSend = results.map((item) => {
      return {
        question: item.question?.question || '',
        weight: levelToWeight(item.question?.level || ''),
        answer: item.answer,
      };
    });
    return this.aiApiService.generateMockEvaluation(dataToSend)
  }
}
