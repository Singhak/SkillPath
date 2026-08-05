import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './core/services/auth.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree); // Mock UrlTree

    authServiceStub = {
      isAuthenticated: signal(false)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceStub }
      ]
    });
  });

  it('should redirect to login if user is not authenticated', () => {
    // Setup environment to provide the guard's injection context
    TestBed.runInInjectionContext(() => {
      (authServiceStub.isAuthenticated as any).set(false);
      
      const result = authGuard({} as any, {} as any);
      
      expect(result).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    });
  });

  it('should allow navigation if user is authenticated', () => {
    TestBed.runInInjectionContext(() => {
      (authServiceStub.isAuthenticated as any).set(true);
      
      const result = authGuard({} as any, {} as any);
      
      expect(result).toBeTrue();
      expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
    });
  });
});
