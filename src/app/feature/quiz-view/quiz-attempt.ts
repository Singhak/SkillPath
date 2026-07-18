export interface QuizAttempt {
  question: string;
  timeTaken: number;
  skipped: boolean;
  isCorrect: boolean | null;
  hintUsed: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  timestamp: Date;
}