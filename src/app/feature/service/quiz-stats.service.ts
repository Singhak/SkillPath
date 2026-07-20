import { computed, Injectable, signal } from '@angular/core';
import { Question, QuestionStats } from '../../shared/components/question/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuizStatsService {
  private readonly questionsStats = signal<QuestionStats[]>([]);

  // Public signals for components to consume
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
      userAnswer: '',
      score: 0,
      category: question.category,
      questionId: question.id,
      quizId: -1,
      timeTaken: -1,
      skipped: false,
      isCorrect: false,
      hintsUsedCount: 0,
      coinsSpent: 0,
      coinsEarned: 0,
    };
    this.questionsStats.update((questionsStats) => [...questionsStats, newAttempt]);
  }

  endAttempt(
    question: Question,
    timeTaken: number,
    selectedAnswer: string,
    isCorrect: boolean,
  ): void {
    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id
          ? { ...attempt, timeTaken, selectedAnswer, isCorrect, skipped: false }
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

  recordHintUsage(question: Question): void {
    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id ? { ...attempt, hintUsed: true } : attempt,
      ),
    );
  }

  reset(): void {
    this.questionsStats.set([]);
  }
}
