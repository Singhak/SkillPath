export interface AIQuestion {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'scenario';
  skill: string;
  level: 'basic' | 'intermediate' | 'advanced';
}

export interface AIEvaluationResult {
  score: number;
  feedback: string;
  idealAnswer: string;
}

export interface AIQuestionSet {
  id: number;
  questions: AIQuestion;
}