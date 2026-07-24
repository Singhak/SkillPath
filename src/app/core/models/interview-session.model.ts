import { InterviewQuestion } from './interview-question.model';

export interface InterviewSession {
  topic: string;

  questions: InterviewQuestion[];

  currentQuestionIndex: number;

  startedAt: Date;
}
