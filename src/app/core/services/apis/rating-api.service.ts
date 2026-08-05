import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Service()
export class RatingApiService {
  private readonly apiUrl = `${environment.apiUrl}/ratings`;
  private http = inject(HttpClient);

  getSelfRating(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/self`);
  }

  createorUpdateSelfRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/self`, rating);
  }
}

export interface Rating {
  category: string;
  rating: number;
  type: 'SELF' | 'OTHER';
  userId?: string;
}
