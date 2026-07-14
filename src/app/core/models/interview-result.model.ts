import { InterviewQuestion } from './interview-question.model';

export interface InterviewResult {
  question: InterviewQuestion;

  answer: string;

  score: number;

  feedback: string;

  idealAnswer: string;

  evaluatedAt: Date;
}
