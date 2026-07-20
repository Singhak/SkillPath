import { computed, inject, Injectable, signal } from '@angular/core';
import { Question, QuestionStats } from '../../shared/components/question/question.model';
import { QuizStats } from '../quiz-view/quiz.model';
import { QuizService } from './quiz-service';

@Injectable({
  providedIn: 'root',
})
export class QuizStatsService {
  private quizService = inject(QuizService);
  private readonly questionsStats = signal<QuestionStats[]>([]);
  private quizStats = signal<QuizStats | {}>({});

  // Public signals for components to consume

  public quizId = signal<number>(0)

  public readonly allquestionsStats = this.questionsStats.asReadonly();
  public readonly correctAnswerCount = computed(
    () => this.questionsStats().filter((a) => a.isCorrect).length,
  );
  public readonly wrongAnswerCount = computed(
    () => this.questionsStats().filter((a) => a.isCorrect === false).length,
  );
  public readonly skippedCount = computed(
    () => this.questionsStats().filter((a) => a.skipped).length,
  );
  public readonly hintsUsedCount = computed(() =>
    this.questionsStats().reduce((acc, attempt) => acc + attempt.hintsUsedCount, 0),
  );
  public readonly totalTimeTakenInSeconds = computed(() =>
    this.questionsStats().reduce((acc, attempt) => acc + attempt.timeTaken, 0),
  );
  public readonly totalScore = computed(() =>
    this.questionsStats().reduce((acc, attempt) => acc + attempt.score, 0),
  );

  public readonly totalCoinsEarned = computed(() =>
    this.questionsStats().reduce((acc, attempt) => acc + attempt.coinsEarned, 0),
  );
  public readonly totalCoinsSpent = computed(() =>
    this.questionsStats().reduce((acc, attempt) => acc + attempt.coinsSpent, 0),
  );

  public readonly attemptedQuestionCount = computed(
    () => this.correctAnswerCount() + this.wrongAnswerCount() + this.skippedCount(),
  );
  public readonly totalIncorrect = computed(() => this.wrongAnswerCount());

  startAttempt(question: Question): void {
    if (this.questionsStats().find((a) => a.questionId === question.id)) {
      return; // Attempt already started
    }

    const newAttempt: QuestionStats = {
      quizId:this.quizId(),
      userAnswer: '',
      score: 0,
      category: question.category,
      questionId: question.id,
      timeTaken: 0,
      skipped: false,
      isCorrect: false,
      hintsUsedCount: 0,
      coinsSpent: 0,
      coinsEarned: 0,
    };
    this.questionsStats.update((questionsStats) => [...questionsStats, newAttempt]);
  }

  endAttempt(options: EndAttemptOptions): void {
    const { question, timeTaken, selectedAnswer, isCorrect, score, coinsEarned } = options;
    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id
          ? {
              ...attempt,
              timeTaken,
              selectedAnswer,
              isCorrect,
              skipped: false,
              score: score ?? 0,
              coinsEarned: coinsEarned ?? 0,
            }
          : attempt,
      ),
    );
  }

  skipAttempt(question: Question, timeTaken: number): void {
    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id
          ? { ...attempt, timeTaken, skipped: true, isCorrect: null }
          : attempt,
      ),
    );
  }

  recordHintUsage(question: Question, coinsSpent: number): void {
    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id ? { ...attempt, hintUsed: true, coinsSpent } : attempt,
      ),
    );
  }

  reset(): void {
    this.questionsStats.set([]);
  }

  updateQuizStats(): void {
    this.quizStats.set({
      category: this.questionsStats()[0].category,
      totalQuestions: this.questionsStats().length,
      wrongAnswerCount: this.wrongAnswerCount(),
      correctAnswerCount: this.correctAnswerCount(),
      attemptedQuestionCount: this.attemptedQuestionCount(),
      totalScore: this.totalScore(),
      hintsUsedCount: this.hintsUsedCount(),
      totalCoinsEarned: this.totalCoinsEarned(),
      totalCoinsSpent: this.totalCoinsSpent(),
      skippedCount: this.skippedCount(),
      totalTimeTakenInSeconds: this.totalTimeTakenInSeconds(),
    });

    this.quizService.updateQuizStats(this.quizId()).subscribe()
  }

  createQuestionStats(): void {
    this.quizService.createQuestionStats(this.questionsStats()).subscribe();
  }

}

export interface EndAttemptOptions {
  question: Question;
  timeTaken: number;
  selectedAnswer: string;
  isCorrect: boolean;
  score?: number;
  coinsSpent?: number;
  coinsEarned?: number;
}
