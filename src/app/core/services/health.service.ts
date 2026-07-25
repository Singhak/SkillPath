import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, timer } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  public isWakingUp$ = new BehaviorSubject<boolean>(false);
  private backendUrl = 'https://skillpathbackend.onrender.com/api/health';

  constructor(private http: HttpClient) {}

  async pingBackend(): Promise<void> {
    // Show "waking up" banner if server takes longer than 1.5 seconds to answer
    const warningTimer = setTimeout(() => {
      this.isWakingUp$.next(true);
    }, 1500);

    try {
      // Ping health endpoint with a timeout
      await firstValueFrom(
        this.http.get(this.backendUrl).pipe(
          timeout(45000), // Allow up to 45s for Render cold boot
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
