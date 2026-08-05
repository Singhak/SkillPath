import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from './logging.service';

/**
 * Global Angular ErrorHandler implementation to catch unhandled runtime
 * exceptions in component execution, templates, and async callbacks.
 */
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const loggingService = this.injector.get(LoggingService);

    const message = error?.message ? error.message : error?.toString() || 'Unknown Client Exception';
    const stack = error?.stack || new Error().stack;

    // Log the caught unhandled runtime exception to LoggingService
    loggingService.error('GlobalErrorHandler', message, {
      stack,
      rawError: error,
    });

    // Also output to console for browser standard developer tools debugging
    console.error('[GlobalErrorHandler] Uncaught client runtime error:', error);
  }
}
