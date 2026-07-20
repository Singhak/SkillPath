export interface QuestionStats {
  quizId: number;
  questionId: number;
  userAnswer: string;
  score: number;
  category: string;
  skipped: boolean;
  timeTaken: number;
  hintsUsedCount: number;
  isCorrect: boolean | null;
  coinsSpent: number;
  coinsEarned: number;
}

export interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  language: string;
  hists?: string[];
  concept?: string;
  explanation?: string;
  category: string;
  subCategory: string;
  codeSnippet?: string;
}
