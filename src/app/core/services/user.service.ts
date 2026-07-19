import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  updateUser(user: Partial<User>): Observable<User> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      throw new Error('User not logged in');
    }
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }

  getCoins(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/coins`);
  }
}
