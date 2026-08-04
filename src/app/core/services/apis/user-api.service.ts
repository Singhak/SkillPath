import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  updateUser(userId: number | string, user: Partial<User>) {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<User>(url, user);
  }

  getCoins(): Observable<{ coins: number }> {
    return this.http.get<{ coins: number }>(`${this.apiUrl}/coins`);
  }

  getTotalAttempts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalattemps`);
  }

  getAiCredits(): Observable<{ freeCredits: string; paidCredits: string }> {
    return this.http.get<{ freeCredits: string; paidCredits: string }>(`${this.apiUrl}/credits`);
  }

  addFreeCredits(freeCredits: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/credits/free`, { freeCredits });
  }

  addPaidCredits(paidCredits: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/credits/paid`, { paidCredits });
  }

  updateUseCredit(amount: number): Observable<{ message: string, freeCredits: string, paidCredits: string }> {
    return this.http.post<{ message: string, freeCredits: string, paidCredits: string }>(`${this.apiUrl}/credits/use`, { amount });
  }

  buyAiCreditsWithCoins(credits: number): Observable<{ message: string, coins: number, freeCredits: string, paidCredits: string }> {
    return this.http.post<{ message: string, coins: number, freeCredits: string, paidCredits: string }>(`${this.apiUrl}/credits/buy-with-coins`, { credits });
  }
}
