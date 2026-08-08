import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RefreshTokenResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly authTokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authTokenKey);
    }
    return null;
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => token !== null),
        take(1),
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!refreshToken) {
      this.isRefreshing = false;
      this.router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((tokens) => {
        this.isRefreshing = false;
        localStorage.setItem(this.authTokenKey, tokens.accessToken);
        this.refreshTokenSubject.next(tokens.accessToken);
      }),
      switchMap((tokens) => of(tokens.accessToken)),
      catchError((error) => {
        this.isRefreshing = false;
        this.router.navigate(['/login']); // Logout on refresh failure
        return throwError(() => error);
      }),
    );
  }
}
