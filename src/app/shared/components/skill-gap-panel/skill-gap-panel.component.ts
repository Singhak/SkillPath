import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobCompetencyService } from '../../../core/services/job-competency.service';
import { ReviewDeckService } from '../../../core/services/review-deck.service';
import { VoiceService } from '../../services/voice-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-skill-gap-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'skill-gap-panel.component.html',
})
export class SkillGapPanelComponent {
  readonly competencyService = inject(JobCompetencyService);
  readonly reviewDeckService = inject(ReviewDeckService);
  readonly voiceService = inject(VoiceService);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });

  readonly showFlashcardsModal = signal<boolean>(false);
  readonly showAddCardModal = signal<boolean>(false);

  readonly voiceState$ = this.voiceService.state$;

  // Cloze interactive input state
  readonly clozeInput = signal<string>('');

  // New Custom Flashcard form signals
  readonly newCardQuestion = signal<string>('');
  readonly newCardCategory = signal<string>('General');
  readonly newCardAnswer = signal<string>('');
  readonly newCardExplanation = signal<string>('');
  readonly newCardCode = signal<string>('');
  readonly newCardType = signal<'standard' | 'cloze'>('standard');
  readonly newCardClozePrompt = signal<string>('');
  readonly newCardClozeAnswer = signal<string>('');

  onRoleChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.competencyService.setSelectedRole(val);
  }

  navigateToSkillsOrQuiz(skillName: string): void {
    this.router.navigate(['/quiz'], { queryParams: { category: skillName } });
  }

  navigateToMockInterview(): void {
    this.showFlashcardsModal.set(false);
    this.router.navigate(['/aiinterview/mock']);
  }

  navigateToQuiz(): void {
    this.showFlashcardsModal.set(false);
    this.router.navigate(['/quiz']);
  }

  openFlashcards(): void {
    if (!this.authService.hasMinPlan('Gold')) {
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

  handleClozeOption(optionToken: string): void {
    this.clozeInput.set(optionToken);
    this.reviewDeckService.checkClozeAnswer(optionToken);
  }

  handleClozeInputSubmit(): void {
    const val = this.clozeInput().trim();
    if (val) {
      this.reviewDeckService.checkClozeAnswer(val);
    }
  }

  submitNewCard(): void {
    const question = this.newCardQuestion().trim();
    const answer = this.newCardAnswer().trim();
    if (!question || !answer) return;

    this.reviewDeckService.addFlashcard({
      question,
      category: this.newCardCategory().trim() || 'General',
      correctAnswer: answer,
      explanation: this.newCardExplanation().trim(),
      codeSnippet: this.newCardCode().trim(),
      difficulty: 'medium',
      cardType: this.newCardType(),
      clozePrompt: this.newCardClozePrompt().trim(),
      clozeAnswer: this.newCardClozeAnswer().trim() || answer,
      clozeOptions: this.newCardClozeAnswer() ? [this.newCardClozeAnswer().trim(), 'computed', 'observable', 'interface'] : [],
      easeFactor: 2.5,
      masteryLevel: 0,
    });

    // Reset form
    this.newCardQuestion.set('');
    this.newCardAnswer.set('');
    this.newCardExplanation.set('');
    this.newCardCode.set('');
    this.newCardClozePrompt.set('');
    this.newCardClozeAnswer.set('');
    this.showAddCardModal.set(false);
  }
}
