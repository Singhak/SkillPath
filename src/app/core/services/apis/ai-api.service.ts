import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { InterviewQuestion } from '../../models/interview-question.model';
import { AIEvaluationResult } from '../ai-question';
@Service()
export class AiApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  generateEvaluation(dataToSend: ApiEvalBody) {
    return this.http.post<AIEvaluationResult>(`${this.apiUrl}/ai-evaluations`, dataToSend);
  }

  generateMockEvaluation(dataToSend: ApiEvalBody[]) {
    return this.http.post<AIEvaluationResult | AIEvaluationResult[]>(
      `${this.apiUrl}/ai-evaluations/mock-evaluation`,
      dataToSend,
    );
  }

  genrateFromTopic(
    topic: string,
    userRole: string,
    experienceLevel: string,
    questionCount?: number,
  ): Observable<InterviewQuestion[]> {
    return this.http.post<InterviewQuestion[]>(`${this.apiUrl}/ai-question-sets/from-topic`, {
      topic,
      userRole,
      experienceLevel,
      questionCount,
    });
  }

  generateFromJobDescription(
    jobDescription: string,
    userRole: string,
    experienceLevel: string,
    questionCount: number
  ): Observable<InterviewQuestion[]> {
    return this.http.post<InterviewQuestion[]>(
      `${this.apiUrl}/ai-question-sets/from-job-description`,
      {
        jobDescription,
        userRole,
        experienceLevel,
        questionCount
      },
    );
  }

  getAiGeneratedQuestion(type: string, level: string): Observable<InterviewQuestion[]> {
    return this.http.get<InterviewQuestion[]>(`${this.apiUrl}/ai-questions`, {
      params: { type, level },
    });
  }
}

interface ApiEvalBody {
  question: string;
  answer: string;
  weight?: number | string;
}
