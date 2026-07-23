import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { InterviewQuestion } from '../../models/interview-question.model';
import { AIEvaluationResult } from '../ai-question';
@Service()
export class AiApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  generateEvaluation(question: string, answer: string) {
    return this.http.post<AIEvaluationResult>(`${this.apiUrl}/ai-evaluations`, {
      question,
      answer,
    });
  }

  genrateFromTopic(
    topic: string,
    userRole: string,
    experienceLevel: string,
  ): Observable<{ questions: InterviewQuestion[] }> {
    return this.http.post<{ questions: InterviewQuestion[] }>(
      `${this.apiUrl}/ai-question-sets/from-topic`,
      { topic, userRole, experienceLevel },
    );
  }

  generateFromJobDescription(
    jobDescription: string,
    userRole: string,
    experienceLevel: string,
  ): Observable<{ questions: InterviewQuestion[] }> {
    return of({
      questions: [
        {
          question:
            'How would you approach designing a scalable system landscape for currency adaptation in banknote processing machines, considering factors like security, maintainability, and performance?',
          type: 'scenario',
          skill: 'System Design',
          level: 'advanced',
        },
        {
          question:
            'Explain the concept of dependency injection in Java Spring Boot and how it enhances the maintainability of the application.',
          type: 'technical',
          skill: 'Java Spring Boot',
          level: 'intermediate',
        },
        {
          question:
            'Can you describe a situation where you had to provide technical direction to a development team? How did you ensure the team adhered to architectural guidelines and best practices?',
          type: 'behavioral',
          skill: 'Leadership',
          level: 'advanced',
        },
        {
          question:
            'How do you optimize the performance of a Docker container in a Microsoft Azure environment, and what tools or methods do you use for monitoring?',
          type: 'technical',
          skill: 'Docker and Azure',
          level: 'intermediate',
        },
        {
          question:
            'Tell me about a time when you had to troubleshoot a complex technical issue in a production environment. How did you resolve it, and what did you learn from the experience?',
          type: 'behavioral',
          skill: 'Problem Solving',
          level: 'advanced',
        },
        {
          question:
            'Explain the differences between RDBMS and NoSQL databases, and how you would decide which to use in a given scenario.',
          type: 'technical',
          skill: 'Database Systems',
          level: 'intermediate',
        },
        {
          question:
            'Describe your experience with Agile methodologies and how you contribute to Agile ceremonies. How do you ensure that technical documentation is up-to-date and relevant?',
          type: 'behavioral',
          skill: 'Agile Methodologies',
          level: 'intermediate',
        },
        {
          question:
            'How do you approach the design of a full-stack application, integrating backend, frontend, and relational database systems? What considerations do you take into account for scalability and security?',
          type: 'technical',
          skill: 'Full-stack Development',
          level: 'advanced',
        },
        {
          question:
            'Can you walk me through your process for conducting a code review, including what aspects you focus on and how you provide constructive feedback to the development team?',
          type: 'behavioral',
          skill: 'Code Review',
          level: 'intermediate',
        },
        {
          question:
            'Explain how you would guide the implementation of a new technology, such as image processing or machine learning capabilities, within an existing application platform.',
          type: 'scenario',
          skill: 'Technical Innovation',
          level: 'advanced',
        },
        {
          question:
            'Describe your experience with Angular and how you would lead the design and implementation of Angular components within a larger application framework.',
          type: 'technical',
          skill: 'Angular',
          level: 'intermediate',
        },
      ],
    });
    return this.http.post<{ questions: InterviewQuestion[] }>(
      `${this.apiUrl}/ai-question-sets/from-job-description`,
      {
        jobDescription,
        userRole,
        experienceLevel,
      },
    );
  }

  getAiGeneratedQuestion(
    type: string,
    level: string,
  ): Observable<{ questions: InterviewQuestion[] }> {
    return this.http.get<{ questions: InterviewQuestion[] }>(`${this.apiUrl}/ai-questions`, {
      params: { type, level },
    });
  }
}

// app.use("/api/ai-questions", aiQuestionRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/ai-evaluations", aiEvaluationRoutes);
// app.use("/api/ai-question-sets", aiQuestionSetRoutes);
