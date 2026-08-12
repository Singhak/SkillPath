import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WalkthroughService, FeatureTour } from '../../../core/services/walkthrough.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-walkthrough-guide-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './walkthrough-guide-modal.component.html',
  styleUrl: './walkthrough-guide-modal.component.css',
})
export class WalkthroughGuideModalComponent {
  protected readonly walkthroughService = inject(WalkthroughService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isOpen = this.walkthroughService.isGuideModalOpen;
  readonly toursCatalog = this.walkthroughService.toursCatalog;

  close(): void {
    this.walkthroughService.closeGuideModal();
  }

  isCompleted(tourId: string): boolean {
    return this.walkthroughService.isTourCompleted(tourId);
  }

  isUnlocked(tour: FeatureTour): boolean {
    return this.walkthroughService.isFeatureUnlocked(tour);
  }

  startTour(tourId: string): void {
    this.close();
    setTimeout(() => {
      this.walkthroughService.startTour(tourId, true);
    }, 50);
  }

  goToUpgrade(): void {
    this.close();
    this.router.navigateByUrl('/pricing');
  }

  resetProgress(): void {
    this.walkthroughService.resetAllTours();
  }
}
