import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../../shared/components/quiz/quiz';
import { QuizAttempt } from '../quiz-view/quiz-attempt';

@Injectable({
  providedIn: 'root',
})
export class QuizStatsService {
  private readonly attempts = signal<QuizAttempt[]>([]);

  // Public signals for components to consume
  public readonly allAttempts = this.attempts.asReadonly();
  public readonly totalCorrect = computed(() => this.attempts().filter((a) => a.isCorrect).length);
  public readonly totalIncorrect = computed(() => this.attempts().filter((a) => a.isCorrect === false).length);
  public readonly totalSkipped = computed(() => this.attempts().filter((a) => a.skipped).length);
  public readonly totalHintsUsed = computed(() => this.attempts().filter((a) => a.hintUsed).length);
  public readonly totalTimeTaken = computed(() => this.attempts().reduce((acc, attempt) => acc + attempt.timeTaken, 0));

  startAttempt(question: Question): void {
    if (this.attempts().find((a) => a.question === question.question)) {
      return; // Attempt already started
    }

    const newAttempt: QuizAttempt = {
      question: question.question,
      correctAnswer: question[question.answer as keyof Question] as string,
      timeTaken: 0,
      skipped: false,
      isCorrect: null,
      hintUsed: false,
      selectedAnswer: null,
      timestamp: new Date(),
    };
    this.attempts.update((attempts) => [...attempts, newAttempt]);
  }

  endAttempt(question: Question, timeTaken: number, selectedAnswer: string, isCorrect: boolean): void {
    this.attempts.update((attempts) =>
      attempts.map((attempt) =>
        attempt.question === question.question
          ? { ...attempt, timeTaken, selectedAnswer, isCorrect, skipped: false }
          : attempt,
      ),
    );
  }

  skipAttempt(question: Question, timeTaken: number): void {
    this.attempts.update((attempts) =>
      attempts.map((attempt) =>
        attempt.question === question.question ? { ...attempt, timeTaken, skipped: true, isCorrect: null } : attempt,
      ),
    );
  }

  recordHintUsage(question: Question): void {
    this.attempts.update((attempts) =>
      attempts.map((attempt) =>
        attempt.question === question.question ? { ...attempt, hintUsed: true } : attempt,
      ),
    );
  }

  reset(): void {
    this.attempts.set([]);
  }
}