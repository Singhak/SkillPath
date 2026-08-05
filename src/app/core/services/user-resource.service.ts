import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserApiService } from './apis/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserResourceService {
  private readonly userService = inject(UserApiService);

  private readonly _userCoins = signal<number>(0);
  private readonly _freeCredits = signal<number>(0);
  private readonly _paidCredits = signal<number>(0);

  readonly userCoins = this._userCoins.asReadonly();
  readonly freeCredits = this._freeCredits.asReadonly();
  readonly paidCredits = this._paidCredits.asReadonly();

  initialize(user: User | null): void {
    if (user) {
      this._userCoins.set(user.coins ?? 0);
      this._paidCredits.set(Number.parseFloat(user.paidCredits ?? "0"));
      this.checkAndResetFreeCredits(user);
      this.checkUpdateCoins(user)
    } else {
      this._userCoins.set(0);
      this._freeCredits.set(0);
      this._paidCredits.set(0);
    }
  }

  updateCoins(id: number | string, newCoinTotal: number): Observable<User> {
    return this.userService.updateUser(id, { coins: newCoinTotal });
  }

  private checkUpdateCoins(user: User) {
    if (!user.id) {
      return;
    }

    this.userService.getCoins().subscribe((res) => {
      this._userCoins.set(res.coins)
    })
  }

  private checkAndResetFreeCredits(user: User): void {
    if (!user.id) {
      return;
    }
    this.userService.getAiCredits().subscribe((res) => {
      this._freeCredits.set(Number.parseFloat(res.freeCredits ?? "0"));
      this._paidCredits.set(Number.parseFloat(res.paidCredits ?? "0"));
    })
  }

  decrementAiCredits(amount: number): Observable<{ message: string, freeCredits: string, paidCredits: string }> {
    const currentFreeCredits = this._freeCredits();
    const currentPaidCredits = this._paidCredits();
    if (currentFreeCredits + currentPaidCredits < amount) {
      return throwError(() => new Error('Not enough AI credits.'));
    }

    const freeCreditsToUse = Math.min(currentFreeCredits, amount);
    const paidCreditsToUse = amount - freeCreditsToUse;

    const newFreeCredits = currentFreeCredits - freeCreditsToUse;
    const newPaidCredits = currentPaidCredits - paidCreditsToUse;

    this._freeCredits.set(newFreeCredits);
    this._paidCredits.set(newPaidCredits);

    // Persist the change to the database
    return this.userService.updateUseCredit(amount);
  }

  buyAiCreditsWithCoins(amount: number): Observable<{ message: string, coins: number, freeCredits: string, paidCredits: string }> {
    return this.userService.buyAiCreditsWithCoins(amount).pipe(
      tap((res) => {
        this.updateUserCredits({
          coins: res.coins,
          freeCredits: res.freeCredits,
          paidCredits: res.paidCredits
        });
      })
    );
  }

  updateUserCredits({
    freeCredits = null,
    paidCredits = null,
    coins = null,
  }: {
    freeCredits?: string | number | null;
    paidCredits?: string | number | null;
    coins?: number | null;
  }): void {
    if (coins != null && !Number.isNaN(coins)) {
      this._userCoins.set(coins);
    }
    if (freeCredits != null) {
      const parsed = typeof freeCredits === 'number' ? freeCredits : Number.parseFloat(freeCredits);
      if (!Number.isNaN(parsed)) this._freeCredits.set(parsed);
    }
    if (paidCredits != null) {
      const parsed = typeof paidCredits === 'number' ? paidCredits : Number.parseFloat(paidCredits);
      if (!Number.isNaN(parsed)) this._paidCredits.set(parsed);
    }
  }

  clear(): void {
    this._userCoins.set(0);
    this._freeCredits.set(0);
    this._paidCredits.set(0);
  }

  startFreeTrial(): Observable<any> {
    return this.userService.startFreeTrial();
  }
}
