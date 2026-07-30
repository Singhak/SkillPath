import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
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
    } else {
      this._userCoins.set(0);
      this._freeCredits.set(0);
      this._paidCredits.set(0);
    }
  }

  updateCoins(id: number | string, newCoinTotal: number): Observable<User> {
    return this.userService.updateUser(id, { coins: newCoinTotal });
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

  updateFromUser(user: User): void {
    this._userCoins.set(user.coins ?? 0);
    this._freeCredits.set(Number.parseFloat(user.freeCredits ?? "0"));
    this._paidCredits.set(Number.parseFloat(user.paidCredits ?? "0"));
  }

  clear(): void {
    this._userCoins.set(0);
    this._freeCredits.set(0);
    this._paidCredits.set(0);
  }
}
