import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingApiService {
  private readonly apiUrl = `${environment.apiUrl}/ratings`;
  private readonly http = inject(HttpClient);

  getSelfRating(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/self`);
  }

  createorUpdateSelfRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/self`, rating);
  }

  deleteSelfRating(category: string): Observable<{ message: string; category: string }> {
    return this.http.delete<{ message: string; category: string }>(
      `${this.apiUrl}/self/${encodeURIComponent(category)}`
    );
  }
}

export interface Rating {
  category: string;
  rating: number;
  type: 'SELF' | 'OTHER';
  userId?: string;
}
