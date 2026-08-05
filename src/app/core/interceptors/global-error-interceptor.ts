import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';
import { NetworkService } from '../../shared/services/network.service';

const errorCache = new Map<string, number>();
const THROTTLE_TIME_MS = 3000;

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(MessageService);
  const loggingService = inject(LoggingService);
  const networkService = inject(NetworkService);

  if (!networkService.status()) {
    const errorMessage = 'No internet connection. Please check your network and try again.';
    const now = Date.now();
    const lastSeen = errorCache.get(errorMessage) || 0;
    if (now - lastSeen > THROTTLE_TIME_MS) {
      errorCache.set(errorMessage, now);
      toastr.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    }
    return throwError(() => new Error(errorMessage));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      const requestId = error.headers?.get('x-request-id') || error.error?.requestId || 'N/A';

      if (!networkService.status()) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            if (error.headers?.get('x-otp-required')) {
              errorMessage = 'OTP required for authentication.';
              break;
            }
            errorMessage = 'Unauthorized! Please log in again.';
            break;
          case 403:
            errorMessage = error.error?.message || error.error?.error || 'Forbidden! You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal Server Error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.error || error.error?.message || `Server Error Code: ${error.status}`;
        }
      }

      // Log detailed error metrics to LoggingService with correlation request ID
      loggingService.error('HttpInterceptor', `${req.method} ${req.url} failed (${error.status})`, {
        url: req.url,
        method: req.method,
        status: error.status,
        statusText: error.statusText,
        requestId,
        errorPayload: error.error,
      });

      const now = Date.now();
      const lastSeen = errorCache.get(errorMessage) || 0;

      if (now - lastSeen > THROTTLE_TIME_MS) {
        errorCache.set(errorMessage, now);
        toastr.add({
          severity: 'error',
          summary: 'Error',
          detail: requestId !== 'N/A' ? `${errorMessage} (Req ID: ${requestId})` : errorMessage,
          life: 4000,
        });
      }

      return throwError(() => new Error(errorMessage));
    }),
  );
};
