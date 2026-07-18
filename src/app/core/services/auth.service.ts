import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserKey = 'currentUser';
  private readonly authTokenKey = 'authToken';

  private platformId = inject(PLATFORM_ID);
  private _currentUser = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.currentUserKey);
      if (userJson) {
        this._currentUser.set(JSON.parse(userJson));
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
  readonly isAuthenticated = computed(() => !!this._currentUser());

  login(response: LoginResponse): void {
    localStorage.setItem(this.authTokenKey, response.token);
    this._currentUser.set(response.user);
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.authTokenKey);
  }
}