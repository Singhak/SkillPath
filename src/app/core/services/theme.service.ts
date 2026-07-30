import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose';
export type UiDensity = 'comfortable' | 'compact';

export interface AccentThemeConfig {
  primary: string;
  hover: string;
  gradient: string;
  light: string;
  ring: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentThemeConfig> = {
  indigo: {
    primary: '#6366f1',
    hover: '#4f46e5',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    light: 'rgba(99, 102, 241, 0.15)',
    ring: 'rgba(99, 102, 241, 0.35)',
  },
  emerald: {
    primary: '#10b981',
    hover: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    light: 'rgba(16, 185, 129, 0.15)',
    ring: 'rgba(16, 185, 129, 0.35)',
  },
  cyan: {
    primary: '#06b6d4',
    hover: '#0284c7',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    light: 'rgba(6, 182, 212, 0.15)',
    ring: 'rgba(6, 182, 212, 0.35)',
  },
  amber: {
    primary: '#f59e0b',
    hover: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    light: 'rgba(245, 158, 11, 0.15)',
    ring: 'rgba(245, 158, 11, 0.35)',
  },
  rose: {
    primary: '#ec4899',
    hover: '#db2777',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    light: 'rgba(236, 72, 153, 0.15)',
    ring: 'rgba(236, 72, 153, 0.35)',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>('system');
  readonly accent = signal<AccentColor>('indigo');
  readonly density = signal<UiDensity>('comfortable');

  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    if (this.isBrowser) {
      const savedMode = (localStorage.getItem('app_theme_mode') as ThemeMode) || 'system';
      const savedAccent = (localStorage.getItem('app_theme_accent') as AccentColor) || 'indigo';
      const savedDensity = (localStorage.getItem('app_theme_density') as UiDensity) || 'comfortable';

      this.mode.set(savedMode);
      this.accent.set(savedAccent);
      this.density.set(savedDensity);

      // System media query listener
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryListener = () => {
        if (this.mode() === 'system') {
          this.applyTheme();
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', this.mediaQueryListener);
      }

      effect(() => {
        const m = this.mode();
        const a = this.accent();
        const d = this.density();

        localStorage.setItem('app_theme_mode', m);
        localStorage.setItem('app_theme_accent', a);
        localStorage.setItem('app_theme_density', d);

        this.applyTheme();
      });
    }
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  setAccent(accent: AccentColor): void {
    this.accent.set(accent);
  }

  setDensity(density: UiDensity): void {
    this.density.set(density);
  }

  get isEffectiveDark(): boolean {
    if (!this.isBrowser) return false;
    const m = this.mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    const isDark = this.isEffectiveDark;

    if (isDark) {
      root.classList.add('p-dark', 'dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('p-dark', 'dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }

    const accentKey = this.accent();
    const config = ACCENT_PALETTES[accentKey] || ACCENT_PALETTES.indigo;

    // Directly set CSS Custom Properties on documentElement style so all components update inline dynamically
    root.setAttribute('data-accent', accentKey);
    root.setAttribute('data-density', this.density());

    root.style.setProperty('--primary-accent', config.primary);
    root.style.setProperty('--primary-accent-hover', config.hover);
    root.style.setProperty('--primary-accent-gradient', config.gradient);
    root.style.setProperty('--primary-accent-light', config.light);
    root.style.setProperty('--primary-accent-ring', config.ring);
    root.style.setProperty('--p-primary-color', config.primary);
    root.style.setProperty('--p-primary-hover-color', config.hover);
  }
}
