import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, LoginResponse } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
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

  register(userInfo: Record<string, unknown>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userInfo);
  }

  verifyRegistrationOtp(data: { emailId: string; otp: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/verify-registration`, data).pipe(
      tap((response: LoginResponse) => {
        // On successful verification, log the user in
        this.authService.login(response);
      }),
    );
  }

  logout(): void {
    // This could also be an API call to invalidate the token on the server
    this.authService.logout();
  }

  sendOtp(emailId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/otp-login`, { emailId });
  }

  loginWithOtp(data: { emailId: string; otp: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/otp-verify`, data).pipe(
      tap((response: LoginResponse) => {
        // On successful verification, log the user in
        this.authService.login(response);
      }),
    );
  }

  requestForgotPassword(emailId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { emailId });
  }

  resetPassword(payload: {
    emailId: string;
    token: string;
    newPassword: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, payload);
  }
}
