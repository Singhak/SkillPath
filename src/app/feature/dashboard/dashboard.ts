import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { QuizStats } from '../quiz-view/quiz.model';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';
import { AuthService } from '../../core/services/auth.service';

import { GamificationPanelComponent } from '../../shared/components/gamification-panel/gamification-panel.component';
import { SkillGapPanelComponent } from '../../shared/components/skill-gap-panel/skill-gap-panel.component';
import { AiToolsWidgetComponent } from '../../shared/components/ai-tools-widget/ai-tools-widget.component';
import { JobCompetencyService } from '../../core/services/job-competency.service';
import { BillingHistoryModalComponent } from '../../shared/components/billing-history-modal/billing-history-modal.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    DividerModule,
    FloatLabelModule,
    SelectModule,
    FormsModule,
    PanelModule,
    GamificationPanelComponent,
    SkillGapPanelComponent,
    AiToolsWidgetComponent,
    ConfirmDialogModule,
    BillingHistoryModalComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild(GamificationPanelComponent) gamificationPanel?: GamificationPanelComponent;

  private readonly quizApiService = inject(QuizApiService);
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService); // changed to public for html access
  private readonly jobCompetencyService = inject(JobCompetencyService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly quizAttempts = signal<QuizStats[]>([]);
  readonly selectChartCategory = signal('angular');
  readonly categoryList = signal<string[]>([]);
  readonly lineData = signal<any>(null);
  readonly pieData = signal<any>(null);
  readonly tableSearchQuery = signal<string>('');
  readonly isBillingModalOpen = signal<boolean>(false);

  readonly userName = computed(() => this.authService.currentUser()?.name || 'Learner');

  readonly totalAiCredits = computed(
    () => (this.authService.freeCredits() ?? 0) + (this.authService.paidCredits() ?? 0),
  );

  readonly totalCoins = computed(() => {
    return this.authService.userCoins()
    // const attempts = this.quizAttempts();
    // const coinsEarned = attempts.reduce(
    //   (sum, item: QuizStats) => sum + Number(item.totalCoinsEarned || 0),
    //   0,
    // );
    // const coinsSpent = attempts.reduce(
    //   (sum, item: QuizStats) => sum + Number(item.totalCoinsSpent || 0),
    //   0,
    // );
    // return coinsEarned - coinsSpent;
  });

  readonly filteredQuizAttempts = computed(() => {
    const query = this.tableSearchQuery().toLowerCase().trim();
    const attempts = this.quizAttempts();
    if (!query) return attempts;
    return attempts.filter(
      (item) =>
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.attempedDate && new Date(item.attempedDate).toLocaleDateString().includes(query)),
    );
  });

  readonly skillBreakdown = computed(() => {
    const attempts = this.quizAttempts();
    const map = new Map<string, { totalQuestions: number; correctAnswers: number; count: number }>();

    for (const attempt of attempts) {
      const cat = attempt.category || 'General';
      const current = map.get(cat) || { totalQuestions: 0, correctAnswers: 0, count: 0 };
      current.totalQuestions += Number(attempt.totalQuestions || 0);
      current.correctAnswers += Number(attempt.correctAnswerCount || 0);
      current.count += 1;
      map.set(cat, current);
    }

    const result: { category: string; accuracy: number; count: number; totalQuestions: number }[] = [];
    map.forEach((value, category) => {
      const accuracy =
        value.totalQuestions > 0
          ? Math.round((value.correctAnswers / value.totalQuestions) * 100)
          : 0;
      result.push({
        category,
        accuracy,
        count: value.count,
        totalQuestions: value.totalQuestions,
      });
    });

    return result.sort((a, b) => b.accuracy - a.accuracy);
  });

  readonly summaryCards = computed(() => {
    const attempts = this.quizAttempts();
    const totalAttempts = attempts.length;
    const totalQuestions = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.totalQuestions || 0),
      0,
    );
    const totalHints = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.hintsUsedCount || 0),
      0,
    );
    const totalCorrectAnswers = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.correctAnswerCount || 0),
      0,
    );
    const accuracy =
      totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
    const totalScore = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.totalScore || 0),
      0,
    );

    const totalTimeSec = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.totalTimeTakenInSeconds || 0),
      0,
    );
    const avgTimeSec = totalAttempts > 0 ? Math.round(totalTimeSec / totalAttempts) : 0;

    return [
      {
        label: 'Attempts',
        value: totalAttempts.toString(),
        subtitle: 'Quiz sessions',
        icon: 'pi pi-chart-line',
        accent: 'indigo',
      },
      {
        label: 'Accuracy Rate',
        value: `${accuracy}%`,
        subtitle: `${totalCorrectAnswers}/${totalQuestions} correct`,
        icon: 'pi pi-bullseye',
        accent: 'emerald',
      },
      {
        label: 'Total Score',
        value: `${totalScore}`,
        subtitle: 'Earned XP',
        icon: 'pi pi-star-fill',
        accent: 'amber',
      },
      {
        label: 'Questions',
        value: totalQuestions.toString(),
        subtitle: 'Completed items',
        icon: 'pi pi-book',
        accent: 'sky',
      },
      {
        label: 'Hints Used',
        value: totalHints.toString(),
        subtitle: 'Clues revealed',
        icon: 'pi pi-lightbulb',
        accent: 'orange',
      },
      {
        label: 'Avg Duration',
        value: this.formattedTime(avgTimeSec),
        subtitle: 'Time per quiz',
        icon: 'pi pi-clock',
        accent: 'violet',
      },
    ];
  });

  readonly lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#64748b' },
      },
      y: {
        border: { dash: [4, 4] },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#64748b' },
      },
    },
  };

  readonly pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
      },
    },
  };

  constructor() {
    effect(() => {
      this.categoryLineChart(this.selectChartCategory());
    });
  }

  ngOnInit(): void {
    this.jobCompetencyService.refreshUserRatings();
    this.quizApiService.getQuizAttempts().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((attempts: QuizStats[]) => {
      this.quizAttempts.set(attempts);
      const categories = [...new Set(attempts.map((item: any) => item.category))] as string[];
      this.categoryList.set(categories);
      if (categories.length) {
        this.selectChartCategory.set(categories[0]);
      }
      this.buildPieData();
    });
  }

  private categoryLineChart(category: string): void {
    const localDataset = this.quizAttempts().filter((item: any) => item.category === category);

    this.lineData.set({
      labels: localDataset.map((item: any) => {
        const dateVal = item.attempedDate || item.attempted_date;
        return dateVal ? new Date(dateVal).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Attempt';
      }),
      datasets: [
        {
          label: 'Score',
          data: localDataset.map((item: QuizStats) => item.totalScore),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Questions',
          data: localDataset.map((item: QuizStats) => item.totalQuestions),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Hints Used',
          data: localDataset.map((item: QuizStats) => item.hintsUsedCount),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  }

  private buildPieData(): void {
    const categoryCount = this.quizAttempts().reduce((acc: Record<string, number>, item: any) => {
      const name = item.category || 'General';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(categoryCount);
    this.pieData.set({
      labels,
      datasets: [
        {
          data: labels.map((label) => categoryCount[label]),
          backgroundColor: [
            '#6366F1',
            '#0EA5E9',
            '#10B981',
            '#F59E0B',
            '#EC4899',
            '#8B5CF6',
            '#14B8A6',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    });
  }

  onBuyCredits(): void {
    this.router.navigate(['/pricing']);
  }

  onViewBillingHistory(): void {
    this.isBillingModalOpen.set(true);
  }

  onConvertCoins(): void {
    if (this.gamificationPanel) {
      this.gamificationPanel.promptBuyAiCredits();
    }
  }

  onNewQuiz() {
    this.router.navigate(['/quiz']);
  }

  onStartAiInterview() {
    if (this.authService.currentPlan() !== 'Gold') {
      this.confirmationService.confirm({
        message: 'This feature requires the Gold plan. Would you like to upgrade your plan?',
        header: 'Upgrade Required',
        icon: 'pi pi-lock',
        acceptLabel: 'View Plans',
        rejectLabel: 'Cancel',
        accept: () => {
          this.router.navigate(['/pricing']);
        }
      });
      return;
    }
    this.router.navigate(['/aiinterview']);
  }

  formattedTime(timeInSec: number) {
    if (!timeInSec || isNaN(timeInSec)) return '0m 0s';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}m ${seconds}s`;
  }

  getAccuracyBadgeClass(accuracy: number): string {
    if (accuracy >= 80) return 'badge-high';
    if (accuracy >= 50) return 'badge-mid';
    return 'badge-low';
  }
}
