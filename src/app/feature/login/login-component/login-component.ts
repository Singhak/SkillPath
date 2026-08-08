import { Component, inject, OnDestroy, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoginService } from '../login-service';
import { finalize } from 'rxjs';
import { LoggingService } from '../../../core/services/logging.service';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-component',
  imports: [
    ButtonModule,
    CardModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    RouterLink,
    ReactiveFormsModule,
    SelectButtonModule,
    InputOtpModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly loggingService = inject(LoggingService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly otpSent = signal(false);
  readonly resendCooldown = signal(0);
  private cooldownInterval: ReturnType<typeof setInterval> | null = null;
  form: FormGroup;

  readonly loginMethods = [
    { label: 'Password', value: 'password' },
    { label: 'OTP', value: 'otp' },
  ];
  selectedLoginMethod: 'password' | 'otp' = 'password';

  constructor() {
    this.form = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      otp: [''],
    });

    this.onLoginMethodChange();
  }

  onLoginMethodChange(): void {
    const passwordControl = this.form.get('password');
    const otpControl = this.form.get('otp');

    if (this.selectedLoginMethod === 'password') {
      passwordControl?.setValidators([Validators.required]);
      otpControl?.clearValidators();
      this.otpSent.set(false);
    } else {
      passwordControl?.clearValidators();
      otpControl?.setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]);
    }

    passwordControl?.updateValueAndValidity();
    otpControl?.updateValueAndValidity();
  }

  sendOtp(): void {
    const emailControl = this.form.get('emailId');
    if (emailControl?.invalid) {
      emailControl.markAsTouched();
      return;
    }

    if (this.resendCooldown() > 0) {
      return; // Do not send if still on cooldown
    }
    this.loading.set(true);

    this.loggingService.log('Sending OTP to:', emailControl?.value);
    this.loginService
      .sendOtp(emailControl?.value)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
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

  loginUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { emailId, password, otp } = this.form.value;

    const login$ =
      this.selectedLoginMethod === 'otp'
        ? this.loginService.loginWithOtp({ emailId, otp })
        : this.loginService.login({ emailId, password });

    login$.pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.router.navigate(['/dashboard'])
    });
  }

  get emailId(): AbstractControl | null {
    return this.form.get('emailId');
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }
}
