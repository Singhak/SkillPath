import { Injectable, signal, inject } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
      if (user.freeCredits !== undefined && user.freeCredits !== null) {
        const parsedFree = typeof user.freeCredits === 'number' ? user.freeCredits : Number.parseFloat(user.freeCredits.toString());
        if (!Number.isNaN(parsedFree)) {
          this._freeCredits.set(parsedFree);
        }
      }
      if (user.paidCredits !== undefined && user.paidCredits !== null) {
        const parsedPaid = typeof user.paidCredits === 'number' ? user.paidCredits : Number.parseFloat(user.paidCredits.toString());
        if (!Number.isNaN(parsedPaid)) {
          this._paidCredits.set(parsedPaid);
        }
      }
      this.fetchCreditsAndCoins().subscribe({ error: () => { } });
    } else {
      this.clear();
    }
  }

  /**
   * Fetch authoritative AI credits and coin balance from backend API.
   * Runs whenever credits/coins are consumed, earned, or bought.
   */
  fetchCreditsAndCoins(): Observable<{ coinsRes: { coins: number }; creditsRes: { freeCredits: string; paidCredits: string } }> {
    return forkJoin({
      coinsRes: this.userService.getCoins().pipe(
        catchError(() => of({ coins: this._userCoins() }))
      ),
      creditsRes: this.userService.getAiCredits().pipe(
        catchError(() => of({ freeCredits: this._freeCredits().toString(), paidCredits: this._paidCredits().toString() }))
      ),
    }).pipe(
      tap(({ coinsRes, creditsRes }) => {
        if (coinsRes && coinsRes.coins !== undefined) {
          this._userCoins.set(coinsRes.coins);
        }
        if (creditsRes) {
          if (creditsRes.freeCredits !== null && creditsRes.freeCredits !== undefined) {
            this._freeCredits.set(Number.parseFloat(creditsRes.freeCredits));
          }
          if (creditsRes.paidCredits !== null && creditsRes.paidCredits !== undefined) {
            this._paidCredits.set(Number.parseFloat(creditsRes.paidCredits));
          }
        }
      })
    );
  }

  updateCoins(id: number | string, newCoinTotal: number): Observable<User> {
    this._userCoins.set(newCoinTotal);
    return this.userService.updateUser(id, { coins: newCoinTotal }).pipe(
      tap(() => {
        this.fetchCreditsAndCoins().subscribe({ error: () => { } });
      })
    );
  }

  decrementAiCredits(amount: number): Observable<{ message: string, freeCredits: string, paidCredits: string }> {
    const currentFreeCredits = this._freeCredits();
    const currentPaidCredits = this._paidCredits();
    if (currentFreeCredits + currentPaidCredits < amount) {
      return throwError(() => new Error('Not enough AI credits.'));
    }

    const freeCreditsToUse = Math.min(currentFreeCredits, amount);
    const paidCreditsToUse = amount - freeCreditsToUse;

    this._freeCredits.set(currentFreeCredits - freeCreditsToUse);
    this._paidCredits.set(currentPaidCredits - paidCreditsToUse);

    // Persist deduction to DB and execute fetch query for credits & coins
    return this.userService.updateUseCredit(amount).pipe(
      tap((res) => {
        if (res) {
          this.updateUserCredits({ freeCredits: res.freeCredits, paidCredits: res.paidCredits, refetch: true });
        } else {
          this.fetchCreditsAndCoins().subscribe({ error: () => { } });
        }
      })
    );
  }

  buyAiCreditsWithCoins(amount: number): Observable<{ message: string, coins: number, freeCredits: string, paidCredits: string }> {
    return this.userService.buyAiCreditsWithCoins(amount).pipe(
      tap((res) => {
        this.updateUserCredits({
          coins: res.coins,
          freeCredits: res.freeCredits,
          paidCredits: res.paidCredits,
          refetch: true,
        });
      })
    );
  }

  updateUserCredits({
    freeCredits = null,
    paidCredits = null,
    coins = null,
    refetch = true,
  }: {
    freeCredits?: string | number | null;
    paidCredits?: string | number | null;
    coins?: number | null;
    refetch?: boolean;
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
    if (refetch) {
      this.fetchCreditsAndCoins().subscribe({ error: () => { } });
    }
  }

  addFreeCredits(freeCredits: number): Observable<User> {
    return this.userService.addFreeCredits(freeCredits).pipe(
      tap(() => {
        this.fetchCreditsAndCoins().subscribe({ error: () => { } });
      })
    );
  }

  addPaidCredits(paidCredits: number): Observable<User> {
    return this.userService.addPaidCredits(paidCredits).pipe(
      tap(() => {
        this.fetchCreditsAndCoins().subscribe({ error: () => { } });
      })
    );
  }

  clear(): void {
    this._userCoins.set(0);
    this._freeCredits.set(0);
    this._paidCredits.set(0);
  }

  startFreeTrial(): Observable<{ message?: string; plan?: 'Silver' | 'Copper' | 'Gold'; isTrialActive?: boolean; trialExpiryDate?: string; user?: User }> {
    return this.userService.startFreeTrial().pipe(
      tap(() => {
        this.fetchCreditsAndCoins().subscribe({ error: () => { } });
      })
    );
  }
}

