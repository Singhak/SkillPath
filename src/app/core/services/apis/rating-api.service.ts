import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Service()
export class RatingApiService {
  private readonly apiUrl = `${environment.apiUrl}/ratings`;
  private http = inject(HttpClient);

  getSelfRating() {
    return this.http.get<Rating[]>(`${this.apiUrl}/self`);
  }

  createorUpdateSelfRating(rating: Rating) {
    return this.http.post(`${this.apiUrl}/self`, rating);
  }
}

export interface Rating {
  category: string;
  rating: number;
  type: 'SELF' | 'OTHER';
  userId?: string;
}
