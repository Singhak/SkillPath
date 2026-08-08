import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { QuizStats } from '../../../feature/quiz-view/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizApiService {
  private readonly apiUrl = `${environment.apiUrl}/quizzes`;
  private readonly http = inject(HttpClient);

  updateQuizStats(quizId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${quizId}/complete`, {});
  }

  getQuizAttempts(limit?: number, offset?: number): Observable<QuizStats[]> {
    let params = new HttpParams();
    if (limit !== undefined && limit !== null) {
      params = params.set('limit', limit);
    }
    if (offset !== undefined && offset !== null) {
      params = params.set('offset', offset);
    }
    return this.http.get<QuizStats[]>(this.apiUrl, { params });
  }
}
