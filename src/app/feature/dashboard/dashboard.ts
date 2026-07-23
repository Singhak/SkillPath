import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { QuizStats } from '../quiz-view/quiz.model';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    TableModule,
    DividerModule,
    FloatLabel,
    Select,
    FormsModule,
    PanelModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly quizApiService = inject(QuizApiService);
  private readonly router = inject(Router);

  readonly quizAttempts = signal<QuizStats[]>([]);
  readonly selectChartCategory = signal('angular');
  readonly categoryList = signal<string[]>([]);
  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly lineData = signal<any>(null);
  readonly pieData = signal<any>(null);

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

    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
    const coinsEarned = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.totalCoinsEarned || 0),
      0,
    );

    const coinsSpent = attempts.reduce(
      (sum, item: QuizStats) => sum + Number(item.totalCoinsSpent || 0),
      0,
    );

    return [
      {
        label: 'Attempts',
        value: totalAttempts.toString(),
        icon: 'pi pi-chart-line',
        accent: 'blue',
      },
      {
        label: 'Total Score',
        value: `${totalScore}`,
        icon: 'pi pi-star-fill',
        accent: 'amber',
      },
      { label: 'Questions', value: totalQuestions.toString(), icon: 'pi pi-book', accent: 'green' },
      { label: 'Accuracy', value: `${accuracy}%`, icon: 'pi pi-shield', accent: 'violet' },
      {
        label: 'Hints Used',
        value: totalHints.toString(),
        icon: 'pi pi-lightbulb',
        accent: 'orange',
      },
      {
        label: 'Coins Spent',
        value: coinsSpent.toString(),
        icon: 'pi pi-bitcoin',
        accent: 'blue',
      },
      {
        label: 'Coins Earned',
        value: coinsEarned.toString(),
        icon: 'pi pi-bitcoin',
        accent: 'green',
      },
    ];
  });

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  constructor() {
    effect(() => {
      this.categoryLineChart(this.selectChartCategory());
    });
  }

  ngOnInit(): void {
    this.quizApiService.getQuizAttempts().subscribe((attempts: QuizStats[]) => {
      this.quizAttempts.set(attempts);
      const categories = [...new Set(attempts.map((item: any) => item.category))] as string[];
      this.categoryList.set(categories);
      if (categories.length) {
        this.selectChartCategory.set(categories[0]);
      }
      this.buildPieData();
    });
  }

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.mobileMenuOpen.set(!this.mobileMenuOpen());
      return;
    }

    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  closeSidebar(): void {
    this.mobileMenuOpen.set(false);
  }

  private categoryLineChart(category: string): void {
    const localDataset = this.quizAttempts().filter((item: any) => item.category === category);

    this.lineData.set({
      labels: localDataset.map((item: any) => new Date(item.attempted_date).toLocaleDateString()),
      datasets: [
        {
          label: 'Score',
          data: localDataset.map((item: QuizStats) => item.totalScore),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          tension: 0.35,
        },
        {
          label: 'Questions',
          data: localDataset.map((item: QuizStats) => item.totalQuestions),
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.16)',
          tension: 0.35,
        },
        {
          label: 'Hints',
          data: localDataset.map((item: QuizStats) => item.hintsUsedCount),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.16)',
          tension: 0.35,
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
          backgroundColor: ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
        },
      ],
    });
  }

  onNewQuiz() {
    this.router.navigate(['/quiz']);
  }

  formattedTime(timeInSec: number) {
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}m ${seconds}s`;
  }
}
