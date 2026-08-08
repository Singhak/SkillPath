import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../../core/services/gamification.service';
import { InterviewReportService } from '../../../core/services/interview-report.service';
import { Achievement } from '../../../core/models/achievement.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gamification-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gamification-panel.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class GamificationPanelComponent {
  readonly gamificationService = inject(GamificationService);
  private readonly interviewReportService = inject(InterviewReportService);
  public readonly authService = inject(AuthService); // public for template
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly messageService = inject(MessageService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  readonly isOnline = computed(() => this.gamificationService.networkService.status());
  readonly filterCategory = signal<string>('all');

  readonly showBuyCreditsModal = signal<boolean>(false);
  readonly creditsToBuy = signal<number>(1);
  readonly currentConversionRate = computed(() => {
    const plan = this.authService.currentPlan();
    if (plan === 'Gold') return 30;
    if (plan === 'Copper') return 50;
    return 100;
  });

  readonly categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'streak', label: '🔥 Streaks' },
    { id: 'quiz', label: '🎯 Quizzes' },
    { id: 'interview', label: '🤖 Interviews' },
    { id: 'skill', label: '📊 Skills' },
  ];

  filteredAchievements(): Achievement[] {
    const cat = this.filterCategory();
    const list = this.gamificationService.achievements();
    if (cat === 'all') return list;
    return list.filter((a) => a.category === cat);
  }

  generateAndDownloadReport(): void {
    if (this.authService.currentPlan() !== 'Copper') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message:
            'PDF Evaluation Reports require the Copper plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          },
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }
    const user = this.authService.currentUser();
    const reportData = this.interviewReportService.createReportData({
      userName: user?.name || 'SkillPath Learner',
      userEmail: user?.email || 'learner@skillpath.app',
      roleOrSkill: user?.targetRole || 'Full Stack Engineer',
      overallScore: 88,
    });
    this.interviewReportService.downloadPdfReport(reportData);
  }

  onCreditsChange(val: any): void {
    let parsed = Number.parseInt(val, 10);
    if (Number.isNaN(parsed) || parsed < 1) parsed = 1;
    this.creditsToBuy.set(parsed);
  }

  promptBuyAiCredits(): void {
    this.creditsToBuy.set(1);
    this.showBuyCreditsModal.set(true);
  }

  confirmBuyAiCredits(): void {
    this.executeBuyAiCredits(this.creditsToBuy(), this.currentConversionRate());
    this.showBuyCreditsModal.set(false);
  }

  private executeBuyAiCredits(credits: number, rate: number): void {
    const cost = credits * rate;
    const currentCoins = this.authService.userCoins();
    if (currentCoins < cost) {
      if (this.messageService) {
        this.messageService.add({
          severity: 'error',
          summary: 'Insufficient Coins',
          detail: `You need ${cost} coins, but only have ${currentCoins}.`,
        });
      } else {
        alert(`Insufficient Coins. You need ${cost} coins, but only have ${currentCoins}.`);
      }
      return;
    }

    this.authService
      .buyAiCreditsWithCoins(credits)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (this.messageService) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Converted ${cost} coins to ${credits} AI credits!`,
            });
          }
        },
        error: (err) => {
          if (this.messageService) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to convert coins.',
            });
          }
        },
      });
  }
}
