import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quiz } from '../../../feature/quiz-view/quiz.model';
import { Question, QuestionStats } from '../../../shared/components/question/question.model';

@Service()
export class QuestionApiService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);

  getQuestions(filters: { category?: string; subCategory: string[] | null }): Observable<Quiz> {
    let params = new HttpParams();
    if (filters.category) {
      params = params.append('category', filters.category);
    }
    if (filters.subCategory) {
      if (Array.isArray(filters.subCategory)) {
        filters.subCategory.forEach((sc) => {
          params = params.append('subCategory', sc);
        });
      } else {
        params = params.append('subCategory', filters.subCategory);
      }
    }

    return this.http.get<Quiz>(`${this.apiUrl}/questions`, { params });
  }

  createQuestionStats(questionStats: QuestionStats[] | QuestionStats) {
    return this.http.post(`${this.apiUrl}/question-stats`, questionStats);
  }
}
