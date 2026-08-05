import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HealthService } from './core/services/health.service';

import { NativeAppService } from './core/services/native-app.service';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);
  private healthService = inject(HealthService);
  private nativeAppService = inject(NativeAppService);
  isWakingUp$ = this.healthService.isWakingUp$;
  isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);

  readonly mobileMenuOpen = signal(false);
  protected readonly title = signal('SkillPath');
  readonly sidebarCollapsed = signal(true);
  currentUser = this.authService.currentUser;
  currentPlan = this.authService.currentPlan;
  isAuthenticated = this.authService.isAuthenticated;
  userInitials = computed(() => {
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
  
  remainingTrialDays = computed(() => {
    const user = this.currentUser();
    if (!user?.isTrialActive || !user?.trialExpiryDate) {
      return null;
    }
    const expiryDate = new Date(user.trialExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
      this.mobileMenuOpen.set(!this.mobileMenuOpen());
      return;
    }

    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  closeSidebar(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  getPlanColorClass(): string {
    const plan = this.currentPlan();
    if (plan === 'Gold') return 'plan-gold';
    if (plan === 'Copper') return 'plan-copper';
    return 'plan-silver';
  }
}
