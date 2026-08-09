import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './core/services/auth.service';
import { HealthService } from './core/services/health.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('App Component (Shell)', () => {
  let authServiceStub: Partial<AuthService>;
  let healthServiceStub: Partial<HealthService>;

  beforeEach(async () => {
    authServiceStub = {
      currentUser: signal(null),
      currentPlan: signal('Silver'),
      isAuthenticated: signal(false),
      logout: jasmine.createSpy('logout')
    };

    healthServiceStub = {
      pingBackend: jasmine.createSpy('pingBackend'),
      isWakingUp$: of(false)
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: HealthService, useValue: healthServiceStub }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should toggle sidebar correctly', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    // Default desktop state
    expect(app.sidebarCollapsed()).toBeTrue();
    
    // Toggle sidebar
    app.toggleSidebar();
    expect(app.sidebarCollapsed()).toBeFalse();
    
    app.toggleSidebar();
    expect(app.sidebarCollapsed()).toBeTrue();
  });

  it('should render the layout shell (sidebar)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-shell')).toBeTruthy();
    expect(compiled.querySelector('aside.sidebar')).toBeTruthy();
  });

  it('should format user initials properly', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    (authServiceStub.currentUser as any).set({ name: 'John Doe' });
    fixture.detectChanges();
    
    expect(app.userInitials()).toBe('JD');

    (authServiceStub.currentUser as any).set({ name: 'Jane' });
    fixture.detectChanges();
    
    expect(app.userInitials()).toBe('JA');
  });

  it('should call logout on AuthService when logout is clicked', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.logout();
    expect(authServiceStub.logout).toHaveBeenCalled();
  });
});
