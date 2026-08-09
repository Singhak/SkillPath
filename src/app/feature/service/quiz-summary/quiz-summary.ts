import { Component, computed, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { QuizStatsService } from '../quiz-stats.service';

@Component({
  selector: 'app-quiz-summary',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: "./quiz-summary.html",
  styleUrl: "./quiz-summary.css",
})
export class QuizSummaryComponent {
  visible = input.required<boolean>();
  totalQuestions = input.required<number>();
  readonly statsService = inject(QuizStatsService);
  close = output<void>();
  restart = output<void>();

  scorePercent = computed(() => {
    const total = this.totalQuestions();
    if (!total) {
      return 0;
    }
    return Math.round((this.statsService.correctAnswerCount() / total) * 100);
  });

  perfLabel = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90) {
      return 'Excellent!';
    }
    if (pct >= 70) {
      return 'Great Job!';
    }
    if (pct >= 50) {
      return 'Keep Going!';
    }
    return 'Needs Work';
  });

  perfBadgeClass = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90) {
      return 'perf-badge perf-badge--excellent';
    }
    if (pct >= 70) {
      return 'perf-badge perf-badge--great';
    }
    if (pct >= 50) {
      return 'perf-badge perf-badge--average';
    }
    return 'perf-badge perf-badge--poor';
  });

  perfBadgeIcon = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90) {
      return 'pi pi-star-fill';
    }
    if (pct >= 70) {
      return 'pi pi-thumbs-up';
    }
    if (pct >= 50) {
      return 'pi pi-bolt';
    }
    return 'pi pi-exclamation-triangle';
  });

  summaryStats = computed(() => [
    {
      label: 'Total Qs',
      value: this.totalQuestions(),
      icon: 'pi pi-question-circle',
      iconClass: 'stat-icon--blue',
      cardClass: '',
    },
    {
      label: 'Correct',
      value: this.statsService.correctAnswerCount(),
      icon: 'pi pi-check-circle',
      iconClass: 'stat-icon--green',
      cardClass: '',
    },
    {
      label: 'Incorrect',
      value: this.statsService.totalIncorrect(),
      icon: 'pi pi-times-circle',
      iconClass: 'stat-icon--red',
      cardClass: '',
    },
    {
      label: 'Skipped',
      value: this.statsService.skippedCount(),
      icon: 'pi pi-forward',
      iconClass: 'stat-icon--orange',
      cardClass: '',
    },
    {
      label: 'Hints Used',
      value: this.statsService.hintsUsedCount(),
      icon: 'pi pi-lightbulb',
      iconClass: 'stat-icon--yellow',
      cardClass: '',
    },
    {
      label: 'Coins Earned',
      value: this.statsService.totalCoinsEarned(),
      icon: 'pi pi-bitcoin',
      iconClass: 'stat-icon--purple',
      cardClass: '',
    },
    {
      label: 'Coins Spent',
      value: this.statsService.totalCoinsSpent(),
      icon: 'pi pi-bitcoin',
      iconClass: 'stat-icon--pink',
      cardClass: '',
    },
  ]);

  formattedTime = computed(() => {
    const totalSeconds = this.statsService.totalTimeTakenInSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  });
}