import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private http: HttpClient;
    private readonly HEALTH_URL = `${environment.apiUrl}/health`;
    // Writable signal
    readonly status = signal<boolean>(navigator.onLine);
    private readonly destroyRef = inject(DestroyRef);

    // Computed signal
    readonly isOnline = computed(() => this.status());

    private timer?: number;

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);

        window.addEventListener('online', () => this.checkConnection());
        window.addEventListener('offline', () => this.status.set(false));

        this.startHealthCheck();
    }

    private startHealthCheck() {
        this.checkConnection();

        this.timer = window.setInterval(() => {
            this.checkConnection();
        }, 15000);
    }

    private checkConnection() {
        this.http.head(this.HEALTH_URL).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => this.status.set(true),
            error: () => this.status.set(false)
        });
    }
}