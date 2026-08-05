import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { globalErrorInterceptor } from './core/interceptors/global-error-interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none',
          cssLayer: {
            name: 'primeng',
            order: 'primeng tailwind',
          },
        }
      }
    }),
    provideHttpClient(
      withInterceptors([
        globalErrorInterceptor,
        authInterceptor
      ])
    ),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js')
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    MessageService
  ]
};
