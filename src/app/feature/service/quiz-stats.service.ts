import { computed, inject, Injectable, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Question, QuestionStats } from '../../shared/components/question/question.model';
import { QuizStats } from '../quiz-view/quiz.model';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';
import { QuestionApiService } from '../../core/services/apis/question-api.service';

import { ReviewDeckService } from '../../core/services/review-deck.service';

@Injectable({
  providedIn: 'root',
})
export class QuizStatsService {
  private readonly quizApiService = inject(QuizApiService);
  private readonly questionApiService = inject(QuestionApiService);
  private readonly reviewDeckService = inject(ReviewDeckService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly questionsStats = signal<QuestionStats[]>([]);
  private quizStats = signal<QuizStats | {}>({});

  // Public signals for components to consume

  public quizId = signal<number>(0);

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
      quizId: this.quizId(),
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

    if (!isCorrect) {
      this.reviewDeckService.addFlashcard({
        question: question.question,
        category: question.category || 'Quiz Missed',
        correctAnswer: question.answer,
        explanation: question.explanation || `Correct answer: ${question.answer}`,
        codeSnippet: question.codeSnippet,
        difficulty: 'medium',
      });
    }

    this.questionsStats.update((questionsStats) =>
      questionsStats.map((attempt) =>
        attempt.questionId === question.id
          ? {
              ...attempt,
              timeTaken,
              userAnswer: selectedAnswer,
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
      questionsStats.map((attempt) => {
        if (attempt.questionId === question.id) {
          attempt.hintsUsedCount++;
          attempt.coinsSpent += coinsSpent;
          return attempt;
        } else {
          return attempt;
        }
      }),
    );
  }

  reset(): void {
    this.questionsStats.set([]);
  }

  updateQuizStats(): void {
    this.quizApiService.updateQuizStats(this.quizId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  createQuestionStats(): void {
    this.questionApiService.createQuestionStats(this.questionsStats()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
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
