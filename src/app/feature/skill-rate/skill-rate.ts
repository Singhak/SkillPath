import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { Fieldset } from 'primeng/fieldset';
import { FloatLabel } from 'primeng/floatlabel';
import { MeterGroup } from 'primeng/metergroup';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { QuizService } from '../service/quiz-service';

interface SkillRatingEntry {
  skill: string;
  rating: number;
  type: 'self' | 'other';
  userId: string;
}

interface SkillPerformanceRow {
  skill: string;
  selfRating: number;
  quizScore: number;
  attempts: number;
}

@Component({
  selector: 'app-skill-rate',
  standalone: true,
  imports: [ButtonModule, SelectModule, FormsModule, FloatLabel, PanelModule, MeterGroup, Fieldset, ChartModule],
  templateUrl: './skill-rate.html',
  styleUrl: './skill-rate.css',
})
export class SkillRate implements OnInit {
  private readonly quizService = inject(QuizService);

  readonly selectedSkill = signal('');
  readonly selectedRating = signal<number | null>(null);
  readonly ratingOptions = [1, 2, 3, 4, 5];
  readonly availableSkills = signal<string[]>(['Angular', 'TypeScript', 'HTML/CSS', 'React']);
  readonly skillRatings = signal<SkillRatingEntry[]>([]);
  readonly quizAttempts = signal<any[]>([]);

  readonly meterValues = computed(() => {
    const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899'];

    return this.skillRatings()
      .filter((entry) => entry.type === 'self')
      .map((entry, index) => ({
        label: entry.skill,
        value: entry.rating * 20,
        color: colors[index % colors.length],
      }));
  });

  readonly averageSelfRating = computed(() => {
    const ratings = this.skillRatings().filter((entry) => entry.type === 'self');
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
      ratingMap.set(this.normalizeKey(entry.skill), entry.rating);
    });

    const performanceMap = new Map<string, { attempts: number; score: number }>();
    this.quizAttempts().forEach((attempt) => {
      const key = this.normalizeKey(attempt.category || 'General');
      const current = performanceMap.get(key) || { attempts: 0, score: 0 };
      current.attempts += 1;
      current.score += Number(attempt.score || 0);
      performanceMap.set(key, current);
    });

    const keys = new Set<string>([...ratingMap.keys(), ...performanceMap.keys()]);

    return Array.from(keys).map((key) => {
      const skillName = this.skillRatings().find((entry) => this.normalizeKey(entry.skill) === key)?.skill || this.titleCase(key);
      const quizMetrics = performanceMap.get(key);

      return {
        skill: skillName,
        selfRating: ratingMap.get(key) || 0,
        quizScore: quizMetrics ? Math.round(quizMetrics.score / quizMetrics.attempts) : 0,
        attempts: quizMetrics?.attempts || 0,
      };
    });
  });

  readonly barChartData = computed(() => ({
    labels: this.skillPerformanceRows().map((row) => row.skill),
    datasets: [
      {
        label: 'Self rating',
        data: this.skillPerformanceRows().map((row) => row.selfRating),
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Quiz points',
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

  ngOnInit(): void {
    void this.loadData();
  }

  onClickAdd(): void {
    const skill = this.selectedSkill().trim();
    const rating = this.selectedRating();

    if (!skill || rating == null) {
      return;
    }

    const nextEntry: SkillRatingEntry = {
      skill,
      rating,
      type: 'self',
      userId: 'current-user',
    };

    this.skillRatings.update((entries) => {
      const updatedEntries = entries.filter((entry) => entry.skill !== skill || entry.type !== 'self');
      return [...updatedEntries, nextEntry];
    });

    this.availableSkills.update((skills) => (skills.includes(skill) ? skills : [...skills, skill]));
    this.selectedSkill.set('');
    this.selectedRating.set(null);
  }

  private async loadData(): Promise<void> {
    try {
      const [ratings, attempts] = await Promise.all([this.quizService.getRating(), this.quizService.getQuizAttempts()]);
      const normalizedRatings = (ratings || []).map((entry: any) => ({
        skill: entry.catogery || entry.category || 'General',
        rating: Number(entry.rating || 0),
        type: entry.type === 'other' ? 'other' : 'self',
        userId: entry.user_id || 'current-user',
      }));

      const selfRatings = normalizedRatings.filter((entry: SkillRatingEntry) => entry.type === 'self');
      const skillNames = Array.from(new Set([...selfRatings.map((entry: SkillRatingEntry) => entry.skill), ...this.availableSkills()]))
        .filter(Boolean);

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
