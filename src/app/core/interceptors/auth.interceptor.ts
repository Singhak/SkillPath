import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

function addAuthHeader(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Intercepts outgoing HTTP requests and adds the Authorization header if a token is available.
 * It also handles 401 errors by attempting to refresh the token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const injector = inject(Injector);
  const authToken = tokenService.getAuthToken();

  if (authToken) {
    let authReq = addAuthHeader(req, authToken);

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401 && !req.url.includes('/auth/refresh')) {
          return handle401Error(req, next, tokenService, injector);
        }
        // For other errors, just re-throw
        return throwError(() => error);
      })
    );
  }
  return next(req);
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: TokenService, injector: Injector) {
  const authService = injector.get(AuthService);
  return tokenService.refreshToken().pipe(
    switchMap((newAuthToken) => {
      // After refresh, retry the original request with the new token.
      // const newAuthToken = tokenService.getAuthToken();
      if (newAuthToken) {
        return next(addAuthHeader(req, newAuthToken));
      }
      // If for some reason the new token is not available, logout.
      authService.logout();
      return throwError(() => new Error('New auth token not found after refresh'));
    }),
    catchError((refreshError) => {
      // If refresh token fails, logout and propagate the error
      authService.logout();
      return throwError(() => refreshError);
    })
  );
}