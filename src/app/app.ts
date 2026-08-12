import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { PaymentService } from './core/services/payment.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HealthService } from './core/services/health.service';
import { WalkthroughService } from './core/services/walkthrough.service';
import { WalkthroughOverlayComponent } from './shared/components/walkthrough/walkthrough-overlay.component';
import { WalkthroughGuideModalComponent } from './shared/components/walkthrough/walkthrough-guide-modal.component';
import { WalkthroughUnlockModalComponent } from './shared/components/walkthrough/walkthrough-unlock-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    ButtonModule,
    RippleModule,
    WalkthroughOverlayComponent,
    WalkthroughGuideModalComponent,
    WalkthroughUnlockModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly healthService = inject(HealthService);
  private readonly router = inject(Router);
  protected readonly paymentService = inject(PaymentService);
  protected readonly walkthroughService = inject(WalkthroughService);
  readonly isWakingUp$ = this.healthService.isWakingUp$;
  readonly isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);

  readonly mobileMenuOpen = signal(false);
  protected readonly title = signal('ImOnBench');
  readonly sidebarCollapsed = signal(true);
  readonly systemGroupExpanded = signal<boolean>(false);

  readonly isSystemRouteActive = computed<boolean>(() => {
    const url = this.router.url;
    return url.startsWith('/settings') || url.startsWith('/help') || url.startsWith('/about');
  });
  readonly currentUser = this.authService.currentUser;
  readonly currentPlan = this.authService.currentPlan;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.name) {
      return '';
    }
    const names = user.name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });
  
  readonly remainingTrialDays = computed(() => {
    const user = this.currentUser();
    if (!user?.isTrialActive || !user?.trialExpiryDate) {
      return null;
    }
    const expiryDate = new Date(user.trialExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  });
  constructor() {
    this.healthService.pingBackend();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));
    }
  }
  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (!this.mobileMenuOpen()) {
        this.mobileMenuOpen.set(true);
        this.sidebarCollapsed.set(false);
        return;
      }
    }

    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  toggleMobileMenu(): void {
    const isOpening = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(isOpening);
    if (isOpening) {
      this.sidebarCollapsed.set(false);
    }
  }

  closeSidebar(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleSystemGroup(): void {
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
      this.systemGroupExpanded.set(true);
      return;
    }
    this.systemGroupExpanded.set(!this.systemGroupExpanded());
  }

  logout(): void {
    this.authService.logout();
  }

  getPlanColorClass(): string {
    const plan = this.currentPlan();
    if (plan === 'Gold') {
      return 'plan-gold';
    }
    if (plan === 'Copper') {
      return 'plan-copper';
    }
    return 'plan-silver';
  }
}
