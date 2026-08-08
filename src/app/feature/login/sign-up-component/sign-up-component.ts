import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { finalize } from 'rxjs';
import { LoginService } from '../login-service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-component',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
    InputOtpModule,
  ],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css',
})
export class SignUpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  form: FormGroup;
  readonly loading = signal(false);
  readonly isRegistered = signal(false);
  readonly otpSent = signal(false);
  readonly resendCooldown = signal(0);
  private cooldownInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: [''], // OTP field is initially empty
    });
  }

  registerUser(): void {
    if (
      this.form.get('name')?.invalid ||
      this.form.get('emailId')?.invalid ||
      this.form.get('password')?.invalid
    ) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { name, emailId, password } = this.form.value;

    this.loginService
      .register({ name, emailId, password })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isRegistered.set(true);
        // Now that we're on the OTP screen, only the OTP field is required for the next step.
        this.form.get('otp')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('otp')?.updateValueAndValidity();
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'An OTP has been sent to your email.',
        });
        // Clear validators from registration fields as they are no longer visible
        this.startResendCooldown();
        this.form.get('name')?.clearValidators();
        this.form.get('password')?.clearValidators();
      });
  }

  verifyOtp(): void {
    if (this.form.get('otp')?.invalid) {
      return;
    }

    this.loading.set(true);
    const { emailId, otp } = this.form.value;

    this.loginService
      .loginWithOtp({ emailId, otp })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  sendOtp(): void {
    if (this.resendCooldown() > 0) {
      return;
    }
    this.loginService.sendOtp(this.form.get('emailId')?.value).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.otpSent.set(true);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'OTP sent successfully',
      });
      this.startResendCooldown();
    });
  }

  private startResendCooldown(): void {
    this.otpSent.set(true);
    // Start cooldown timer
    this.resendCooldown.set(60);
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown.update((value) => value - 1);
      if (this.resendCooldown() <= 0 && this.cooldownInterval) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }
}
