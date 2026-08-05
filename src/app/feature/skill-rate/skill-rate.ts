import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';
import { Rating, RatingApiService } from '../../core/services/apis/rating-api.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { QuizStats } from '../quiz-view/quiz.model';
import { GamificationService } from '../../core/services/gamification.service';

export interface SkillPerformanceRow {
  skill: string;
  selfRating: number;
  quizScore: number;
  quizRating: number;
  attempts: number;
  alignment: 'High Match' | 'Underestimating' | 'Overestimating' | 'Needs Quiz';
}

@Component({
  selector: 'app-skill-rate',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    FloatLabelModule,
    FieldsetModule,
    ChartModule,
    TableModule,
    KnobModule,
  ],
  templateUrl: './skill-rate.html',
  styleUrl: './skill-rate.css',
})
export class SkillRate implements OnInit {
  private readonly quizApiService = inject(QuizApiService);
  private readonly ratingApiService = inject(RatingApiService);
  private readonly messageService = inject(MessageService);
  private readonly gamificationService = inject(GamificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedSkill = signal('');
  readonly selectedRating = signal<number | null>(null);
  readonly ratingOptions = [1, 2, 3, 4, 5];
  readonly availableSkills = signal<string[]>([
    'Angular',
    'TypeScript',
    'HTML/CSS',
    'React',
    'Node.js',
    'RxJS',
    'Git',
  ]);
  readonly quickSkillChips = ['Angular', 'TypeScript', 'HTML/CSS', 'React', 'Node.js', 'RxJS'];
  readonly skillRatings = signal<Rating[]>([]);
  readonly quizAttempts = signal<QuizStats[]>([]);
  readonly searchQuery = signal<string>('');

  readonly quizBasedRatings = computed(() => {
    const attemptsByCategory = new Map<string, QuizStats[]>();

    this.quizAttempts().forEach((attempt) => {
      const categoryKey = this.normalizeKey(attempt.category);
      if (!attemptsByCategory.has(categoryKey)) {
        attemptsByCategory.set(categoryKey, []);
      }
      attemptsByCategory.get(categoryKey)!.push(attempt);
    });

    const ratings: Rating[] = [];
    attemptsByCategory.forEach((attempts, key) => {
      const recentAttempts = attempts
        .sort((a, b) => new Date(a.attempedDate).getTime() - new Date(b.attempedDate).getTime())
        .slice(-1);

      ratings.push({
        category: this.titleCase(key),
        rating: recentAttempts[0].rating,
        type: 'OTHER',
      });
    });
    return ratings;
  });

  readonly averageSelfRating = computed(() => {
    const ratings = this.skillRatings().filter((entry) => entry.type?.toLowerCase() === 'self');
    if (!ratings.length) {
      return 0;
    }
    const avg = ratings.reduce((sum, entry) => sum + entry.rating, 0) / ratings.length;
    return Math.round(avg * 10) / 10;
  });

  readonly averageQuizRating = computed(() => {
    const quizRatings = this.quizBasedRatings();
    if (!quizRatings.length) {
      return 0;
    }
    const avg = quizRatings.reduce((sum, entry) => sum + entry.rating, 0) / quizRatings.length;
    return Math.round(avg * 10) / 10;
  });

  readonly totalAssessedSkills = computed(() => this.skillPerformanceRows().length);

  readonly alignmentScore = computed(() => {
    const rows = this.skillPerformanceRows().filter((r) => r.selfRating > 0 && r.quizRating > 0);
    if (!rows.length) return 0;
    const matched = rows.filter((r) => r.alignment === 'High Match').length;
    return Math.round((matched / rows.length) * 100);
  });

  readonly skillPerformanceRows = computed<SkillPerformanceRow[]>(() => {
    const ratingMap = new Map<string, number>();
    this.skillRatings().forEach((entry) => {
      ratingMap.set(this.normalizeKey(entry.category), entry.rating);
    });

    const quizRatingMap = new Map<string, number>();
    this.quizBasedRatings().forEach((entry) => {
      quizRatingMap.set(this.normalizeKey(entry.category), entry.rating);
    });

    const performanceMap = new Map<string, { attempts: number; score: number }>();
    this.quizAttempts().forEach((attempt) => {
      const key = this.normalizeKey(attempt.category);
      const current = performanceMap.get(key) || { attempts: 0, score: 0 };
      current.attempts += 1;
      current.score += Number(attempt.totalScore || 0);
      performanceMap.set(key, current);
    });

    const keys = new Set<string>([...ratingMap.keys(), ...performanceMap.keys()]);

    return Array.from(keys).map((key) => {
      const skillName =
        this.skillRatings().find((entry) => this.normalizeKey(entry.category) === key)?.category ||
        this.titleCase(key);
      const quizMetrics = performanceMap.get(key);

      const selfRating = ratingMap.get(key) || 0;
      const quizRating = quizRatingMap.get(key) || 0;
      const quizScore = quizMetrics ? Math.round(quizMetrics.score / quizMetrics.attempts) : 0;
      const attempts = quizMetrics?.attempts || 0;

      let alignment: 'High Match' | 'Underestimating' | 'Overestimating' | 'Needs Quiz' = 'Needs Quiz';
      if (quizRating > 0 && selfRating > 0) {
        const diff = selfRating - quizRating;
        if (Math.abs(diff) <= 0.5) {
          alignment = 'High Match';
        } else if (diff < -0.5) {
          alignment = 'Underestimating';
        } else {
          alignment = 'Overestimating';
        }
      }

      return {
        skill: skillName,
        selfRating,
        quizScore,
        quizRating,
        attempts,
        alignment,
      };
    });
  });

  readonly filteredSkillPerformanceRows = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const rows = this.skillPerformanceRows();
    if (!query) return rows;
    return rows.filter((row) => row.skill.toLowerCase().includes(query));
  });

  readonly barChartData = computed(() => ({
    labels: this.skillPerformanceRows().map((row) => row.skill),
    datasets: [
      {
        label: 'Self Rating (out of 5)',
        data: this.skillPerformanceRows().map((row) => row.selfRating),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
      {
        label: 'Quiz Rating (out of 5)',
        data: this.skillPerformanceRows().map((row) => row.quizRating),
        backgroundColor: '#0ea5e9',
        borderRadius: 6,
      },
    ],
  }));

  readonly doughnutChartData = computed(() => {
    const rows = this.skillPerformanceRows();
    const expert = rows.filter((r) => r.selfRating >= 4).length;
    const proficient = rows.filter((r) => r.selfRating === 3).length;
    const developing = rows.filter((r) => r.selfRating <= 2 && r.selfRating > 0).length;
    const unrated = rows.filter((r) => r.selfRating === 0).length;

    return {
      labels: ['Expert (4-5★)', 'Proficient (3★)', 'Developing (1-2★)', 'Quiz-Only'],
      datasets: [
        {
          data: [expert, proficient, developing, unrated],
          backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#94a3b8'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  });

  readonly barChartOptions = {
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
        max: 5,
        min: 0,
      },
    },
  };

  readonly doughnutChartOptions = {
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

  ngOnInit(): void {
    void this.loadData();
  }

  selectQuickSkill(skill: string): void {
    this.selectedSkill.set(skill);
  }

  onClickAdd(): void {
    const skill = this.selectedSkill().trim();
    const rating = this.selectedRating();

    if (!skill || rating == null) {
      return;
    }

    const nextEntry: Rating = {
      category: skill,
      rating,
      type: 'SELF',
    };

    this.ratingApiService.createorUpdateSelfRating(nextEntry).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.gamificationService.recordActivity('skill');
        this.messageService.add({
          severity: 'success',
          summary: 'Rating Saved',
          detail: `Rating for ${skill} updated to ${rating}/5`,
        });
        this.skillRatings.update((entries) => {
          const updatedEntries = entries.filter(
            (entry) => entry.category !== skill || entry.type?.toLowerCase() !== 'self',
          );
          return [...updatedEntries, nextEntry];
        });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    });

    this.availableSkills.update((skills) => (skills.includes(skill) ? skills : [...skills, skill]));
    this.selectedSkill.set('');
    this.selectedRating.set(null);
  }

  getAlignmentBadgeClass(alignment: string): string {
    switch (alignment) {
      case 'High Match':
        return 'badge-match';
      case 'Underestimating':
        return 'badge-under';
      case 'Overestimating':
        return 'badge-over';
      default:
        return 'badge-neutral';
    }
  }

  getStarArray(rating: number): number[] {
    const stars: number[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(1); // full star
      } else if (rating >= i - 0.5) {
        stars.push(0.5); // half star
      } else {
        stars.push(0); // empty star
      }
    }
    return stars;
  }

  private async loadData(): Promise<void> {
    try {
      const [ratings, attempts] = await Promise.all([
        lastValueFrom(this.ratingApiService.getSelfRating()),
        lastValueFrom(this.quizApiService.getQuizAttempts()),
      ]);

      const selfRatings = ratings.filter((entry: Rating) => entry.type?.toLowerCase() === 'self');
      const skillNames = Array.from(
        new Set([...selfRatings.map((entry: Rating) => entry.category), ...this.availableSkills()]),
      ).filter(Boolean);

      this.skillRatings.set(selfRatings);
      this.quizAttempts.set(attempts || []);
      this.availableSkills.set(skillNames);
    } catch (error) {
      console.error('Unable to load rating data', error);
    }
  }

  private normalizeKey(value: string): string {
    return (value || '').toLowerCase().trim();
  }

  private titleCase(value: string): string {
    return value
      .split(/[-/\s]+/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
