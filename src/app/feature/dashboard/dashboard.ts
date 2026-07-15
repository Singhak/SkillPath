import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { QuizService } from '../service/quiz-service';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ChartModule, TableModule, DividerModule, FloatLabel, Select, FormsModule, PanelModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  readonly quizAttempts = signal<any[]>([]);
  readonly selectChartCategory = signal('angular');
  readonly categoryList = signal<string[]>([]);
  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);
  readonly lineData = signal<any>(null);
  readonly pieData = signal<any>(null);

  readonly summaryCards = computed(() => {
    const attempts = this.quizAttempts();
    const totalAttempts = attempts.length;
    const totalQuestions = attempts.reduce((sum, item: any) => sum + Number(item.question_attemped || 0), 0);
    const totalHints = attempts.reduce((sum, item: any) => sum + Number(item.hints_count || 0), 0);
    const averageScore = totalAttempts
      ? Math.round(attempts.reduce((sum, item: any) => sum + Number(item.score || 0), 0) / totalAttempts)
      : 0;
    const accuracy = totalAttempts
      ? Math.round((attempts.filter((item: any) => Number(item.score || 0) >= 70).length / totalAttempts) * 100)
      : 0;

    return [
      { label: 'Attempts', value: totalAttempts.toString(), icon: 'pi pi-chart-line', accent: 'blue' },
      { label: 'Average Score', value: `${averageScore}%`, icon: 'pi pi-star-fill', accent: 'amber' },
      { label: 'Questions', value: totalQuestions.toString(), icon: 'pi pi-book', accent: 'green' },
      { label: 'Accuracy', value: `${accuracy}%`, icon: 'pi pi-shield', accent: 'violet' },
      { label: 'Hints Used', value: totalHints.toString(), icon: 'pi pi-lightbulb', accent: 'orange' },
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
    this.quizService.getQuizAttempts().then((attempts: any[]) => {
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
      labels: localDataset.map((item: any) => new Date(item.date_attempted).toLocaleDateString()),
      datasets: [
        {
          label: 'Score',
          data: localDataset.map((item: any) => item.score),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.18)',
          tension: 0.35,
        },
        {
          label: 'Questions',
          data: localDataset.map((item: any) => item.question_attemped),
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.16)',
          tension: 0.35,
        },
        {
          label: 'Hints',
          data: localDataset.map((item: any) => item.hints_count),
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
}
