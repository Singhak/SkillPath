import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  updateUser(arg1: string | Partial<User>, arg2?: Partial<User>): Observable<User> {
    if (typeof arg1 === 'string') {
      return this.http.put<User>(`${this.apiUrl}/${arg1}`, arg2!);
    } else {
      const userId = arg1.id;
      const url = userId ? `${this.apiUrl}/${userId}` : this.apiUrl;
      return this.http.put<User>(url, arg1);
    }
  }

  getCoins(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/coins`);
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
}
