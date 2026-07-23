import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { QuizStats } from '../../../feature/quiz-view/quiz.model';

@Service()
export class QuizApiService {
  private readonly apiUrl = `${environment.apiUrl}/quizzes`;
  private http = inject(HttpClient);

  updateQuizStats(quizId: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/quizzes/${quizId}/complete`, {});
  }

  getQuizAttempts(): Observable<QuizStats[]> {
    return this.http.get<QuizStats[]>(`${environment.apiUrl}/quizzes`);
  }
}
