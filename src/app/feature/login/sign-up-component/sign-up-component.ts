import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginService } from '../login-service';
import { finalize } from 'rxjs';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-sign-up-component',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    PasswordModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up-component.html',
  styleUrl: './sign-up-component.css',
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private loggingService = inject(LoggingService);

  loading = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registerUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.loginService
      .register(this.form.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration successful! Please log in.',
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading.set(false);
          this.loggingService.error('Registration Error:', error);
        },
      });
  }
}
