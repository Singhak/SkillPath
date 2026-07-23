import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ai-interview-layout',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  template: `
    <div class="p-4">
      @if (showBackButton) {
        <p-button
          label="Back"
          icon="pi pi-arrow-left"
          styleClass="p-button-text mb-4"
          (click)="goBack()"
        ></p-button>
      }
      <router-outlet />
    </div>
  `,
})
export class AiInterviewLayoutComponent {
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    this.location.back();
  }

  get showBackButton(): boolean {
    return this.router.url !== '/aiinterview';
  }
}
