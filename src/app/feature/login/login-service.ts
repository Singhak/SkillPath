import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService, LoginResponse } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  // Use the base URL from the environment file
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: { emailId: string; password: string }): Observable<LoginResponse> {
    const { emailId, password } = credentials;
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { emailId, password }).pipe(
      tap((response: LoginResponse) => {
        this.authService.login(response);
      }),
    );
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userInfo);
  }

  logout(): void {
    // This could also be an API call to invalidate the token on the server
    this.authService.logout();
  }
}
