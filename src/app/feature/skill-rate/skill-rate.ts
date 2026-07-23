import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { Fieldset } from 'primeng/fieldset';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';
import { Rating, RatingApiService } from '../../core/services/apis/rating-api.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { QuizStats } from '../quiz-view/quiz.model';

interface SkillPerformanceRow {
  skill: string;
  selfRating: number;
  quizScore: number;
  quizRating: number;
  attempts: number;
}

@Component({
  selector: 'app-skill-rate',
  standalone: true,
  imports: [
    ButtonModule,
    SelectModule,
    FormsModule,
    FloatLabel,
    Fieldset,
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

  readonly selectedSkill = signal('');
  readonly selectedRating = signal<number | null>(null);
  readonly ratingOptions = [1, 2, 3, 4, 5];
  readonly availableSkills = signal<string[]>(['Angular', 'TypeScript', 'HTML/CSS', 'React']);
  readonly skillRatings = signal<Rating[]>([]);
  readonly quizAttempts = signal<QuizStats[]>([]);

  readonly quizBasedRatings = computed(() => {
    const attemptsByCategory = new Map<string, QuizStats[]>();

    // Group attempts by category
    this.quizAttempts().forEach((attempt) => {
      const categoryKey = this.normalizeKey(attempt.category);
      if (!attemptsByCategory.has(categoryKey)) {
        attemptsByCategory.set(categoryKey, []);
      }
      attemptsByCategory.get(categoryKey)!.push(attempt);
    });

    const ratings: Rating[] = [];
    attemptsByCategory.forEach((attempts, key) => {
      // // Sort attempts by date to get the most recent ones, and take the last 5
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

  readonly meterValues = computed(() => {
    const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899'];

    return this.quizBasedRatings().map((entry, index) => ({
      label: entry.category,
      value: entry.rating * 20, // Convert 1-5 scale to 0-100 for meter
      color: colors[index % colors.length],
    }));
  });

  readonly averageSelfRating = computed(() => {
    const ratings = this.skillRatings().filter((entry) => entry.type?.toLowerCase() === 'self');
    if (!ratings.length) {
      return 0;
    }

    return Math.round(ratings.reduce((sum, entry) => sum + entry.rating, 0) / ratings.length);
  });

  readonly averageQuizScore = computed(() => {
    const rows = this.skillPerformanceRows();
    if (!rows.length) {
      return 0;
    }

    return Math.round(rows.reduce((sum, row) => sum + row.quizScore, 0) / rows.length);
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

      return {
        skill: skillName,
        selfRating: ratingMap.get(key) || 0,
        quizScore: quizMetrics ? Math.round(quizMetrics.score / quizMetrics.attempts) : 0,
        quizRating: quizRatingMap.get(key) || 0,
        attempts: quizMetrics?.attempts || 0,
      };
    });
  });

  readonly barChartData = computed(() => ({
    labels: this.skillPerformanceRows().map((row) => row.skill),
    datasets: [
      {
        label: 'Self Rating',
        data: this.skillPerformanceRows().map((row) => row.selfRating),
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Quiz Rating',
        data: this.skillPerformanceRows().map((row) => row.quizScore),
        backgroundColor: '#0EA5E9',
      },
    ],
  }));

  readonly chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  readonly horizontalChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: { y: { ticks: { autoSkip: false } } },
  };

  ngOnInit(): void {
    void this.loadData();
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

    this.ratingApiService.createorUpdateSelfRating(nextEntry).subscribe({
      next: () => {
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
