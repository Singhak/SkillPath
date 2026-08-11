import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { GamificationService } from '../../../core/services/gamification.service';
import { InterviewReportService } from '../../../core/services/interview-report.service';
import { Achievement, LearnerProgressReportData } from '../../../core/models/achievement.model';
import { AuthService } from '../../../core/services/auth.service';
import { RatingApiService } from '../../../core/services/apis/rating-api.service';
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
  private readonly ratingApiService = inject(RatingApiService);
  public readonly authService = inject(AuthService); // public for template
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly messageService = inject(MessageService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  readonly isOnline = computed(() => this.gamificationService.networkService.status());
  readonly filterCategory = signal<string>('all');

  readonly showBuyCreditsModal = signal<boolean>(false);
  readonly sendingEmailDigest = signal<boolean>(false);
  readonly generatingReport = signal<boolean>(false);
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
    if (!this.authService.hasMinPlan('Copper')) {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message:
            'Weekly Performance PDF Reports require the Copper plan. Would you like to upgrade your plan?',
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
    const unlockedBadgesCount = this.gamificationService
      .achievements()
      .filter((a) => a.isUnlocked).length;

    this.generatingReport.set(true);

    // Fetch user's real saved interview history and skill ratings
    forkJoin({
      savedReports: this.interviewReportService.getUserReports().pipe(catchError(() => of([]))),
      selfRatings: this.ratingApiService.getSelfRating().pipe(catchError(() => of([]))),
    })
      .pipe(
        finalize(() => this.generatingReport.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ savedReports, selfRatings }) => {
      // Map user's actual self ratings to topicScores
      const topicScores = (selfRatings || []).map((r) => {
        const scorePercent = Math.min(100, Math.round((r.rating / 5) * 100));
        const status =
          scorePercent >= 85
            ? 'Excellent'
            : scorePercent >= 70
            ? 'Proficient'
            : scorePercent >= 50
            ? 'Good'
            : 'Developing';
        return {
          topic: r.category,
          score: scorePercent,
          status,
        };
      });

      // Map user's actual interview history (filter out legacy mock sample reports)
      const recentInterviews = (savedReports || [])
        .filter(
          (r) =>
            r &&
            r.summaryFeedback &&
            !r.summaryFeedback.includes('demonstrated strong foundational knowledge') &&
            !r.summaryFeedback.includes('Candidate User')
        )
        .map((r) => ({
          date: r.date || new Date().toLocaleDateString(),
          role: r.roleOrSkill || 'Technical Practice',
          score: r.overallScore || 0,
          category: r.category || 'mock',
          feedback: r.summaryFeedback || 'Completed evaluation session.',
        }));

      // Calculate real strengths
      const strengths: string[] = [];
      const highRated = (selfRatings || []).filter((r) => r.rating >= 4);
      if (highRated.length > 0) {
        strengths.push(
          `High skill proficiency in: ${highRated.map((r) => r.category).join(', ')}`
        );
      }
      if (this.gamificationService.currentStreak() > 0) {
        strengths.push(
          `Active practice consistency with a ${this.gamificationService.currentStreak()}-day streak`
        );
      }
      if (this.gamificationService.quizCompletedCount() > 0) {
        strengths.push(
          `Completed ${this.gamificationService.quizCompletedCount()} technical practice sessions/quizzes`
        );
      }

      // Calculate real recommended focus topics based on lower rated skills
      const lowRated = (selfRatings || []).filter((r) => r.rating <= 3);
      const recommendedFocusTopics: string[] = lowRated.map((r) => r.category);

      const progressData: LearnerProgressReportData = {
        userName: user?.name || 'IMONBENCH Learner',
        userEmail: user?.email || 'learner@imonbench.app',
        targetRole: user?.targetRole || 'Full Stack Engineer',
        userPlan: this.authService.currentPlan(),
        level: this.gamificationService.level(),
        levelTitle: this.gamificationService.levelTitle(),
        totalXp: this.gamificationService.xpPoints(),
        currentStreak: this.gamificationService.currentStreak(),
        quizCompletedCount: this.gamificationService.quizCompletedCount(),
        interviewCompletedCount: this.gamificationService.interviewCompletedCount(),
        skillsRatedCount: this.gamificationService.skillsRatedCount(),
        unlockedBadgesCount,
        topicScores,
        recentInterviews,
        strengths,
        recommendedFocusTopics,
      };

      this.interviewReportService.downloadLearnerProgressReport(progressData);
    });
  }

  sendWeeklyEmailDigest(): void {
    if (!this.authService.hasMinPlan('Copper')) {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: 'Weekly Email Digests require the Copper plan. Would you like to upgrade?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => this.router.navigate(['/pricing']),
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }

    this.sendingEmailDigest.set(true);
    this.interviewReportService
      .sendWeeklyDigestEmail()
      .pipe(
        finalize(() => this.sendingEmailDigest.set(false)),
        catchError((err) => {
          if (this.messageService) {
            this.messageService.add({
              severity: 'error',
              summary: 'Email Failed',
              detail: 'Unable to send weekly digest email right now. Please try again.',
            });
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res && this.messageService) {
          this.messageService.add({
            severity: 'success',
            summary: 'Email Sent',
            detail: 'Weekly performance digest delivered to your email inbox.',
            life: 5000,
          });
        }
      });
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
