import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Timer {

  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly seconds = signal(0);

  readonly time = computed(() => {
    const total = this.seconds();

    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  });

  start(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.seconds.update(v => v + 1);
    }, 1000);
  }

  stop(): void {
    if (!this.intervalId) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.stop();
    this.seconds.set(0);
  }

  restart() {
    this.reset();
    this.start();
  }

  get elapsedSeconds() {
    return this.seconds();
  }

  destroy() {
    this.stop();
  }
}