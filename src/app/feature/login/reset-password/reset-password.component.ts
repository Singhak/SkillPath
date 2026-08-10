import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly messageService = inject(MessageService);

  readonly loading = signal(false);
  readonly invalidLink = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  token: string | null = null;
  email: string | null = null;

  form: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    // Subscribe to queryParamMap to ensure parameters are captured even on fresh page loads / deep links
    this.route.queryParamMap.subscribe((params) => {
      let token = params.get('token');
      let email = params.get('email');

      // Fallback: Parse window.location if router params are empty due to hash/redirects
      if ((!token || !email) && typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        token = token || searchParams.get('token');
        email = email || searchParams.get('email');

        if (!token || !email) {
          const href = window.location.href;
          const queryIndex = href.indexOf('?');
          if (queryIndex !== -1) {
            const hashSearchParams = new URLSearchParams(href.substring(queryIndex));
            token = token || hashSearchParams.get('token');
            email = email || hashSearchParams.get('email');
          }
        }
      }

      this.token = token;
      this.email = email;

      if (!this.token || !this.email) {
        this.invalidLink.set(true);
        this.errorMessage.set('The password reset link is invalid or missing parameters.');
      } else {
        this.invalidLink.set(false);
        this.errorMessage.set('');
      }
    });
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token || !this.email) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      emailId: this.email,
      token: this.token,
      newPassword: this.newPassword?.value,
    };

    this.loginService
      .resetPassword(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const msg = res.message || 'Password reset successfully! Redirecting to login...';
          this.successMessage.set(msg);
          this.messageService.add({
            severity: 'success',
            summary: 'Password Updated',
            detail: msg,
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },
        error: (err) => {
          const msg = err.error?.error || err.error?.message || 'Failed to reset password. Link may be expired.';
          this.errorMessage.set(msg);
          this.messageService.add({
            severity: 'error',
            summary: 'Reset Failed',
            detail: msg,
          });
        },
      });
  }
}
