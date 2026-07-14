import { InterviewResult } from './interview-result.model';
import { InterviewSession } from './interview-session.model';

export interface InterviewStore {

  session: InterviewSession | null;

  results: InterviewResult[];

  currentResult: InterviewResult | null;

  evaluating: boolean;

}