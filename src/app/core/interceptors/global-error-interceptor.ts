import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(MessageService);
  const loggingService = inject(LoggingService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            if (error.headers.get('x-otp-required')) {
              errorMessage = 'OTP required for authentication.';
              break;
            }
            errorMessage = 'Unauthorized! Please log in again.';
            break;
          case 403:
            errorMessage = 'Forbidden! You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal Server Error. Please try again later.';
            break;
          default:
            errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }

      // Log the error globally to the console or an external tracking service
      loggingService.error('Global Error Handler:', errorMessage);
      // errorMessage = error.error?.message || errorMessage;
      toastr.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });

      // Pass the error along to the component if it still needs to handle it locally
      return throwError(() => new Error(errorMessage));
    }),
  );
};
