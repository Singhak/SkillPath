import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ai-interview-layout',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  template: `
    <div class="ai-layout-host">
      @if (showBackButton) {
        <div class="ai-layout-back">
          <p-button
            label="Back to Interview Hub"
            icon="pi pi-arrow-left"
            severity="secondary"
            text
            (click)="goBack()"
          ></p-button>
        </div>
      }
      <router-outlet />
    </div>
  `,
  styles: [`
    .ai-layout-host {
      min-height: 100%;
    }
    .ai-layout-back {
      padding: 1rem 1.5rem 0;
    }
  `],
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
