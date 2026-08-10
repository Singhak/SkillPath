import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly messageService = inject(MessageService);

  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  form: FormGroup = this.fb.group({
    emailId: ['', [Validators.required, Validators.email]],
  });

  get emailId() {
    return this.form.get('emailId');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const email = this.emailId?.value;

    this.loginService
      .requestForgotPassword(email)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.submitted.set(true);
          const msg = res.message || 'If an account with that email exists, reset instructions have been sent.';
          this.successMessage.set(msg);
          this.messageService.add({
            severity: 'info',
            summary: 'Check Your Inbox',
            detail: msg,
          });
        },
        error: (err) => {
          const msg = err.error?.error || err.error?.message || 'Something went wrong. Please try again.';
          this.errorMessage.set(msg);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msg,
          });
        },
      });
  }
}
