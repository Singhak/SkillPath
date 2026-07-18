import { Injectable } from '@angular/core';

/**
 * A centralized logging service that can be enabled or disabled.
 * This allows for conditional logging throughout the application.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private isEnabled = true; // Logging is enabled by default

  log(message: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.log(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.error(message, ...optionalParams);
    }
  }

  /** Enables logging throughout the application. */
  enable() {
    this.isEnabled = true;
  }

  /** Disables all logging handled by this service. */
  disable() {
    this.isEnabled = false;
  }
}