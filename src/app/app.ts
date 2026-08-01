import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { HealthService } from './core/services/health.service';

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
  isWakingUp$ = this.healthService.isWakingUp$;
  isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);

  readonly mobileMenuOpen = signal(false);
  protected readonly title = signal('SkillPath');
  readonly sidebarCollapsed = signal(true);
  currentUser = this.authService.currentUser;
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
}
