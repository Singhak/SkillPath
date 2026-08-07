import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { QuizStats } from '../../../feature/quiz-view/quiz.model';

@Service()
export class QuizApiService {
  private readonly apiUrl = `${environment.apiUrl}/quizzes`;
  private http = inject(HttpClient);

  updateQuizStats(quizId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/quizzes/${quizId}/complete`, {});
  }

  getQuizAttempts(limit?: number, offset?: number): Observable<QuizStats[]> {
    let params: any = {};
    if (limit !== undefined && limit !== null) {
      params.limit = limit;
    }
    if (offset !== undefined && offset !== null) {
      params.offset = offset;
    }
    return this.http.get<QuizStats[]>(`${environment.apiUrl}/quizzes`, { params });
  }
}
