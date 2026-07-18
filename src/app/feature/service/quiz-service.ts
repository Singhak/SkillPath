import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from '../../shared/components/quiz/quiz';
import { environment } from '../../environments/environment.development';
// import jsonData from './quizs.json' with { type: 'json' };

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly apiUrl = `${environment.apiUrl}/questions`;
  private http = inject(HttpClient);

  getQuizes(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/`);
  }

  getQuestions(filters: { category?: string; subCategory?: string }): Observable<Question[]> {
    let params = new HttpParams();
    if (filters.category) {
      params = params.append('category', filters.category);
    }
    if (filters.subCategory) {
      params = params.append('subCategory', filters.subCategory);
    }

    return this.http.get<Question[]>(`${this.apiUrl}`, { params });
  }

  private getDummyData(): Observable<any[]> {
    return this.http.get<any[]>('/assets/dumy_Data.json');
  }

  getQuizAttempts(): Observable<any> {
    return this.getDummyData().pipe(
      map((data) => data.find((item: any) => item.table === 'quiz_attempts')?.records),
    );
  }
  getRating(): Observable<any> {
    return this.getDummyData().pipe(
      map((data) => data.find((item: any) => item.table === 'rating')?.records),
    );
  }
  getQuizStats(): Observable<any> {
    return this.getDummyData().pipe(
      map((data) => data.find((item: any) => item.table === 'quiz_stats')?.records),
    );
  }
  getUserTable(): Observable<any> {
    return this.getDummyData().pipe(
      map((data) => data.find((item: any) => item.table === 'user_table')?.records),
    );
  }
}
