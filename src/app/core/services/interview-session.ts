import { AIQuestion } from './question';

export interface InterviewRecord {
  question: AIQuestion;
  answer?: string;
  feedback?: string;
}

export interface InterviewSession {
  topic: string;
  questions: AIQuestion[];
  history: InterviewRecord[];
  currentQuestionIndex: number;
}