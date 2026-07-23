import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Service()
export class AiApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  generateEvaluation() {
    this.http.post(`${this.apiUrl}/ai-evaluations`, {});
  }

  genrateFromTopic(topic: string, userRole: string) {
    this.http.post(`${this.apiUrl}/ai-questions-sets/from-topic`, { topic, userRole });
  }

  generateFromJobDescription(jobDescription: string, userRole: string, experienceLevel: string) {
    this.http.post(`${this.apiUrl}/ai-question-sets/from-job-description`, {
      jobDescription,
      userRole,
      experienceLevel,
    });
  }

  getAiGeneratedQuestion(type: string, level: string) {
    this.http.get(`${this.apiUrl}/ai-questions`, { params: { type, level } });
  }
}

// app.use("/api/ai-questions", aiQuestionRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/ai-evaluations", aiEvaluationRoutes);
// app.use("/api/ai-question-sets", aiQuestionSetRoutes);
