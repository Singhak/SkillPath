import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCompetencyService } from '../../../core/services/job-competency.service';
import { ReviewDeckService } from '../../../core/services/review-deck.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-skill-gap-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'skill-gap-panel.component.html',
})
export class SkillGapPanelComponent {
  readonly competencyService = inject(JobCompetencyService);
  readonly reviewDeckService = inject(ReviewDeckService);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });

  readonly showFlashcardsModal = signal<boolean>(false);

  onRoleChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.competencyService.setSelectedRole(val);
  }

  navigateToSkillsOrQuiz(skillName: string): void {
    this.router.navigate(['/quiz'], { queryParams: { category: skillName } });
  }

  openFlashcards(): void {
    if (this.authService.currentPlan() !== 'Gold') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: 'Spaced Repetition Review Deck requires the Gold plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          }
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }
    this.showFlashcardsModal.set(true);
  }
}
