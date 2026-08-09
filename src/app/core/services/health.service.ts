import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  public readonly isWakingUp$ = new BehaviorSubject<boolean>(false);
  private readonly healthUrl = `${environment.apiUrl}/health`;

  constructor(private readonly http: HttpClient) { }

  async pingBackend(): Promise<void> {
    // Show "waking up" banner if server takes longer than 2 seconds to answer
    const warningTimer = setTimeout(() => {
      this.isWakingUp$.next(true);
    }, 2000);

    try {
      // Ping health endpoint with a timeout
      await firstValueFrom(
        this.http.get(this.healthUrl).pipe(
          timeout(40000), // Allow up to 40s for Render cold boot
        ),
      );
    } catch (error) {
      console.warn('Backend ping failed or timed out:', error);
    } finally {
      clearTimeout(warningTimer);
      this.isWakingUp$.next(false); // Hide message once awake
    }
  }
}
