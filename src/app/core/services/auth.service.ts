import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  coins?: number;
  totalQuizAttempted?:number
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  // refreshToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserKey = 'currentUser';
  private readonly authTokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';

  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  private _userCoins = signal<number>(0);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load user from localStorage on initialization
      const userJson = localStorage.getItem(this.currentUserKey);
      if (userJson) {
        this._currentUser.set(JSON.parse(userJson));
        this._userCoins.set(Number(this._currentUser()?.coins) || 0);
      }

      effect(() => {
        const user = this._currentUser();
        if (user) {
          localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.currentUserKey);
        }
      });
    }
  }

  readonly currentUser = this._currentUser.asReadonly();
  readonly userCoins = this._userCoins.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  login(response: LoginResponse): void {
    localStorage.setItem(this.authTokenKey, response.token);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    this._currentUser.set(response.user);
    this._userCoins.set(Number(response.user.coins) || 0);
  }

  logout(): void {
    this._currentUser.set(null);
    this._userCoins.set(0);
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

  updateCoins(newCoinTotal: number): void {
    this._userCoins.set(newCoinTotal);
    const currentUser = this._currentUser();
    if (currentUser) {
      this._currentUser.set({
        ...currentUser,
        coins: newCoinTotal,
      });
    }
  }

  public refreshToken(): Observable<any> {
    if (this.isRefreshing) {
      // If a refresh is already in progress, wait for it to complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap(() => {
          // The interceptor will retry the original request with the new token.
          // We just need to provide an observable that completes.
          return new Observable((subscriber) =>
            subscriber.next(localStorage.getItem(this.authTokenKey)),
          );
        }),
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem(this.refreshTokenKey);

      if (!refreshToken) {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => new Error('No refresh token available'));
      }

      return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
        tap((tokens) => {
          this.isRefreshing = false;
          localStorage.setItem(this.authTokenKey, tokens.accessToken);

          // The server might return a new refresh token
          // if (tokens.refreshToken) {
          //   localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
          // }

          this.refreshTokenSubject.next(tokens.accessToken);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // If refresh fails, logout the user
          this.logout();
          return throwError(() => error);
        }),
      );
    }
  }
}
