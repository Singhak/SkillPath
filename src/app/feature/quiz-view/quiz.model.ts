import { Question } from '../../shared/components/question/question.model';

export interface QuizStats {
  category: string;
  totalQuestions: number;
  wrongAnswerCount: number;
  correctAnswerCount: number;
  attemptedQuestionCount: number;
  totalScore: number;
  hintsUsedCount: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  skippedCount: number;
  totalTimeTakenInSeconds: number; // in seconds
  attempedDate:Date,
  rating:number,
}

export interface Quiz {
  questions: Question[];
  quizId: number;
}
