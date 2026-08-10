import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserResourceService } from './user-resource.service';
import { UserApiService } from './apis/user-api.service';
import { User, LoginResponse, RefreshTokenResponse } from '../models/user.model';

export type { User, LoginResponse, RefreshTokenResponse };


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserKey = 'currentUser';
  private readonly authTokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly userResourceService = inject(UserResourceService);
  private readonly userApiService = inject(UserApiService);

  private readonly _currentUser = signal<User | null>(null);


  readonly currentUser = this._currentUser.asReadonly();
  readonly userCoins = this.userResourceService.userCoins;
  readonly freeCredits = this.userResourceService.freeCredits;
  readonly paidCredits = this.userResourceService.paidCredits;
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly currentPlan = computed(() => this._currentUser()?.plan || 'Silver');

  private readonly planHierarchy: Record<string, number> = {
    'Silver': 1,
    'Copper': 2,
    'Gold': 3,
  };

  readonly planLevel = computed(() => {
    const plan = this.currentPlan();
    return this.planHierarchy[plan] || 1;
  });

  readonly hasCopperPlan = computed(() => this.planLevel() >= 2);
  readonly hasGoldPlan = computed(() => this.planLevel() >= 3);

  /** Checks if the user's plan is at or above the required plan tier (Silver < Copper < Gold) */
  hasMinPlan(requiredPlan: 'Silver' | 'Copper' | 'Gold'): boolean {
    const requiredLevel = this.planHierarchy[requiredPlan] || 1;
    return this.planLevel() >= requiredLevel;
  }

  readonly profileCompletion = computed(() => {
    const user = this._currentUser();
    if (!user) return 0;

    let score = 0;
    if (user.name?.trim()) score += 20;
    if ((user.emailId?.trim()) || (user.email?.trim())) score += 20;
    if (user.targetRole?.trim()) score += 15;
    if (user.bio?.trim()) score += 15;
    if (user.location?.trim()) score += 10;
    if (user.phone?.trim()) score += 10;
    if (user?.skills && user.skills.length > 0) score += 10;

    return Math.min(100, score);
  });

  readonly missingProfileFields = computed(() => {
    const user = this._currentUser();
    if (!user) return [];
    const missing: string[] = [];
    if (!user.name?.trim()) missing.push('Full Name');
    if (!user.targetRole?.trim()) missing.push('Target Role');
    if (!user.bio?.trim()) missing.push('Bio');
    if (!user.phone?.trim()) missing.push('Phone');
    if (!user.location?.trim()) missing.push('Location');
    if (!user.skills?.length) missing.push('Skills');
    return missing;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load user from localStorage on initialization
      const userJson = localStorage.getItem(this.currentUserKey);
      const user = userJson ? JSON.parse(userJson) : null;
      if (user) {
        this._currentUser.set(user);
        this.userResourceService.initialize(user);
      } else {
        localStorage.removeItem(this.currentUserKey);
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
    if (isPlatformBrowser(this.platformId)) {
      // 1. Save UI preferences to preserve across sessions (e.g. Theme settings)
      const themeMode = localStorage.getItem('app_theme_mode');
      const themeAccent = localStorage.getItem('app_theme_accent');
      const themeDensity = localStorage.getItem('app_theme_density');

      // 2. Clear all local storage & session storage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Restore preserved UI preferences
      if (themeMode) localStorage.setItem('app_theme_mode', themeMode);
      if (themeAccent) localStorage.setItem('app_theme_accent', themeAccent);
      if (themeDensity) localStorage.setItem('app_theme_density', themeDensity);
    }

    this._currentUser.set(null);
    this.userResourceService.clear();
    this.router.navigate(['/login']);
  }

  updateCoins(newCoinTotal: number): void {
    const user = this._currentUser();
    if (user?.id) {
      this.userResourceService.updateCoins(user.id, newCoinTotal).subscribe({
        error: () => {
          this.userResourceService.updateUserCredits({ coins: newCoinTotal });
        }
      });
    } else {
      this.userResourceService.updateUserCredits({ coins: newCoinTotal });
    }
  }

  refreshCreditsAndCoins(): Observable<{ coinsRes: { coins: number }; creditsRes: { freeCredits: string; paidCredits: string } }> {
    return this.userResourceService.fetchCreditsAndCoins();
  }

  decrementAiCredits(amount: number): Observable<{ message: string, freeCredits: string, paidCredits: string }> {
    return this.userResourceService.decrementAiCredits(amount).pipe(
      tap(() => {
        const user = this._currentUser();
        if (user) {
          this._currentUser.set(user);
        }
      }),
    );
  }

  buyAiCreditsWithCoins(amount: number): Observable<{ message: string, coins: number, freeCredits: string, paidCredits: string }> {
    return this.userResourceService.buyAiCreditsWithCoins(amount);
  }

  updateUserProfile(updatedData: Partial<User>, persistToBackend = true): void {
    const current = this._currentUser();
    if (current) {
      const merged = { ...current, ...updatedData };
      this._currentUser.set(merged);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(merged));
      }

      // Persist profile updates to backend DB
      if (persistToBackend && current.id) {
        this.userApiService.updateUser(current.id, updatedData).subscribe({
          next: (savedUser) => {
            if (savedUser) {
              const updatedMerged = { ...this._currentUser(), ...savedUser };
              this._currentUser.set(updatedMerged);
              if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.currentUserKey, JSON.stringify(updatedMerged));
              }
            }
          },
          error: (err) => {
            console.warn('Could not sync profile update to backend server:', err);
          },
        });
      }
    }
  }
}