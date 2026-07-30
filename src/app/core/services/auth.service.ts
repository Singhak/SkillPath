import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserResourceService } from './user-resource.service';
import { User, LoginResponse, RefreshTokenResponse } from '../models/user.model';

export type { User, LoginResponse, RefreshTokenResponse };


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserKey = 'currentUser';
  private readonly authTokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private userResourceService = inject(UserResourceService);

  private _currentUser = signal<User | null>(null);


  readonly currentUser = this._currentUser.asReadonly();
  readonly userCoins = this.userResourceService.userCoins;
  readonly freeCredits = this.userResourceService.freeCredits;
  readonly paidCredits = this.userResourceService.paidCredits;
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load user from localStorage on initialization
      const userJson = localStorage.getItem(this.currentUserKey);
      const user = userJson ? JSON.parse(userJson) : null;
      if (user) {
        this._currentUser.set(user);
        this.userResourceService.initialize(user);
      } else {
        // Ensure resources are cleared if no user
        this.userResourceService.initialize(null);
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

  login(response: LoginResponse): void {
    localStorage.setItem(this.authTokenKey, response.token);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    this._currentUser.set(response.user);
    this.userResourceService.initialize(response.user);
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.userResourceService.clear();
    this.router.navigate(['/login']);
  }

  updateCoins(newCoinTotal: number): Observable<User | null> {
    return this.userResourceService.updateCoins(this.currentUser().id, newCoinTotal).pipe(
      tap((updatedUser) => {
        const user = updatedUser as User;
        this._currentUser.set(user);
        if (user) {
          this.userResourceService.updateFromUser(user);
        }
      }),
    );
  }

  decrementAiCredits(amount: number): Observable<{ message: string, freeCredits: string, paidCredits: string }> {
    return this.userResourceService.decrementAiCredits(amount).pipe(
      tap((updatedUser) => {
        const user = this._currentUser();
        if (user) {
          user.freeCredits = updatedUser.freeCredits;
          user.paidCredits = updatedUser.paidCredits;
          this._currentUser.set(user);
          this.userResourceService.updateFromUser(user);
        }
      }),
    );
  }
}