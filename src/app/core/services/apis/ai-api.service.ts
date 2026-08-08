import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { InterviewQuestion } from '../../models/interview-question.model';
import { AIEvaluationResult } from '../ai-question';

@Injectable({ providedIn: 'root' })
export class AiApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  generateEvaluation(dataToSend: ApiEvalBody): Observable<AIEvaluationResult> {
    return this.http.post<AIEvaluationResult>(`${this.apiUrl}/ai-evaluations`, dataToSend);
  }

  generateMockEvaluation(dataToSend: ApiEvalBody[]): Observable<AIEvaluationResult | AIEvaluationResult[]> {
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
