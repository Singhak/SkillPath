import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginService } from '../login-service';
import { finalize } from 'rxjs';
import { LoggingService } from '../../../core/services/logging.service';
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
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private loggingService = inject(LoggingService);

  loading = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  loginUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.loginService
      .login(this.form.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(() => this.router.navigate(['/dashboard']));
  }
}
