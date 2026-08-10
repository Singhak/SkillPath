import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { QuizApiService } from '../../core/services/apis/quiz-api.service';
import { Rating, RatingApiService } from '../../core/services/apis/rating-api.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { QuizStats } from '../quiz-view/quiz.model';
import { GamificationService } from '../../core/services/gamification.service';
import { ResumeParserService } from '../../core/services/resume-parser.service';

export interface SkillPerformanceRow {
  skill: string;
  selfRating: number;
  quizScore: number;
  quizRating: number;
  attempts: number;
  alignment: 'High Match' | 'Underestimating' | 'Overestimating' | 'Needs Quiz';
  isFromResume?: boolean;
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
    DialogModule,
    TooltipModule,
  ],
  templateUrl: './skill-rate.html',
  styleUrl: './skill-rate.css',
})
export class SkillRate implements OnInit {
  private readonly quizApiService = inject(QuizApiService);
  private readonly ratingApiService = inject(RatingApiService);
  private readonly resumeParserService = inject(ResumeParserService);
  private readonly messageService = inject(MessageService);
  private readonly gamificationService = inject(GamificationService);
  private readonly router = inject(Router);
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
  readonly selectedFilter = signal<'all' | 'resume' | 'match' | 'needs-quiz'>('all');

  // Tracking deleted skills locally so user-deleted skills (including from resume) remain deleted
  readonly deletedSkillNames = signal<Set<string>>(this.loadDeletedSkillsFromStorage());

  // Resume skill integration
  readonly parsedResume = this.resumeParserService.parsedResume;
  readonly resumeSkills = computed(() => this.parsedResume()?.extractedSkills || []);

  // Delete modal state
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly skillToDelete = signal<string | null>(null);
  readonly isDeleting = signal<boolean>(false);

  // Guide card state
  readonly showGuide = signal<boolean>(false);

  toggleGuide(): void {
    this.showGuide.update((val) => !val);
  }

  // Edit modal state
  readonly showEditModal = signal<boolean>(false);
  readonly editingSkillOldName = signal<string>('');
  readonly editingSkillNewName = signal<string>('');
  readonly editingSkillRating = signal<number>(3);
  readonly isSavingEdit = signal<boolean>(false);

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

    const resumeSkillKeys = new Set(this.resumeSkills().map((s) => this.normalizeKey(s)));
    const deletedSet = this.deletedSkillNames();
    const keys = new Set<string>([...ratingMap.keys(), ...performanceMap.keys(), ...resumeSkillKeys]);

    return Array.from(keys)
      .filter((key) => !deletedSet.has(key))
      .map((key) => {
        const skillName =
          this.skillRatings().find((entry) => this.normalizeKey(entry.category) === key)?.category ||
          this.resumeSkills().find((s) => this.normalizeKey(s) === key) ||
          this.titleCase(key);
        const quizMetrics = performanceMap.get(key);

        const selfRating = ratingMap.get(key) || 0;
        const quizRating = quizRatingMap.get(key) || 0;
        const quizScore = quizMetrics ? Math.round(quizMetrics.score / quizMetrics.attempts) : 0;
        const attempts = quizMetrics?.attempts || 0;
        const isFromResume = resumeSkillKeys.has(key);

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
          isFromResume,
        };
      });
  });

  readonly filteredSkillPerformanceRows = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();
    let rows = this.skillPerformanceRows();

    if (filter === 'resume') {
      rows = rows.filter((r) => r.isFromResume);
    } else if (filter === 'match') {
      rows = rows.filter((r) => r.alignment === 'High Match');
    } else if (filter === 'needs-quiz') {
      rows = rows.filter((r) => r.alignment === 'Needs Quiz');
    }

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
      labels: ['Expert (4-5★)', 'Proficient (3★)', 'Developing (1-2★)', 'Unrated'],
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
    this.resumeParserService.loadSavedResume();
    void this.loadData();
  }

  selectQuickSkill(skill: string): void {
    this.selectedSkill.set(skill);
  }

  setFilter(filter: 'all' | 'resume' | 'match' | 'needs-quiz'): void {
    this.selectedFilter.set(filter);
  }

  onClickAdd(): void {
    const skill = this.selectedSkill().trim();
    const rating = this.selectedRating();

    if (!skill || rating === null || rating === undefined) {
      return;
    }

    this.updateRatingDirectly(skill, rating);

    this.availableSkills.update((skills) => (skills.includes(skill) ? skills : [...skills, skill]));
    this.selectedSkill.set('');
    this.selectedRating.set(null);
  }

  updateRatingDirectly(skillName: string, newRating: number): void {
    const key = this.normalizeKey(skillName);
    
    // Clear from deleted skills set if re-adding/updating
    if (this.deletedSkillNames().has(key)) {
      const updatedSet = new Set(this.deletedSkillNames());
      updatedSet.delete(key);
      this.deletedSkillNames.set(updatedSet);
      this.saveDeletedSkillsToStorage(updatedSet);
    }

    const nextEntry: Rating = {
      category: skillName,
      rating: newRating,
      type: 'SELF',
    };

    this.ratingApiService.createorUpdateSelfRating(nextEntry).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.gamificationService.recordActivity('skill');
        this.messageService.add({
          severity: 'success',
          summary: 'Rating Updated',
          detail: `Rating for ${skillName} updated to ${newRating}/5 ⭐`,
        });
        this.skillRatings.update((entries) => {
          const updatedEntries = entries.filter(
            (entry) => this.normalizeKey(entry.category) !== key || entry.type?.toLowerCase() !== 'self',
          );
          return [...updatedEntries, nextEntry];
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: error?.error?.message || error.message || 'Could not update rating.',
        });
      },
    });
  }

  openEditModal(row: SkillPerformanceRow): void {
    this.editingSkillOldName.set(row.skill);
    this.editingSkillNewName.set(row.skill);
    this.editingSkillRating.set(row.selfRating || 3);
    this.showEditModal.set(true);
  }

  saveEdit(): void {
    const oldName = this.editingSkillOldName().trim();
    const newName = this.editingSkillNewName().trim();
    const rating = this.editingSkillRating();

    if (!newName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Skill name cannot be empty.',
      });
      return;
    }

    this.isSavingEdit.set(true);
    const oldKey = this.normalizeKey(oldName);
    const newKey = this.normalizeKey(newName);

    const nextEntry: Rating = {
      category: newName,
      rating,
      type: 'SELF',
    };

    const deletePromise = (oldKey !== newKey && oldName)
      ? lastValueFrom(this.ratingApiService.deleteSelfRating(oldName)).catch(() => {})
      : Promise.resolve();

    deletePromise.then(() => {
      this.ratingApiService.createorUpdateSelfRating(nextEntry).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.gamificationService.recordActivity('skill');
          this.messageService.add({
            severity: 'success',
            summary: 'Skill Updated',
            detail: `Updated "${newName}" to ${rating}/5 ⭐`,
          });

          // Un-delete if new key was previously deleted
          if (this.deletedSkillNames().has(newKey)) {
            const updatedSet = new Set(this.deletedSkillNames());
            updatedSet.delete(newKey);
            this.deletedSkillNames.set(updatedSet);
            this.saveDeletedSkillsToStorage(updatedSet);
          }

          this.skillRatings.update((entries) => {
            const filtered = entries.filter(
              (e) => this.normalizeKey(e.category) !== oldKey && this.normalizeKey(e.category) !== newKey
            );
            return [...filtered, nextEntry];
          });

          this.availableSkills.update((skills) => {
            const filtered = skills.filter((s) => this.normalizeKey(s) !== oldKey);
            return filtered.includes(newName) ? filtered : [...filtered, newName];
          });

          this.showEditModal.set(false);
          this.isSavingEdit.set(false);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err?.error?.message || err.message || 'Could not update skill.',
          });
          this.isSavingEdit.set(false);
        },
      });
    });
  }

  confirmDelete(skillName: string): void {
    this.skillToDelete.set(skillName);
    this.showDeleteConfirm.set(true);
  }

  executeDelete(): void {
    const skill = this.skillToDelete();
    if (!skill) return;

    this.isDeleting.set(true);
    const key = this.normalizeKey(skill);

    this.ratingApiService.deleteSelfRating(skill).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.finishDeleteSkill(skill, key);
      },
      error: () => {
        // Remove locally even if backend rating wasn't saved yet
        this.finishDeleteSkill(skill, key);
      },
    });
  }

  private finishDeleteSkill(skill: string, key: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Skill Removed',
      detail: `Skill "${skill}" removed from your matrix.`,
    });

    this.skillRatings.update((entries) =>
      entries.filter((entry) => this.normalizeKey(entry.category) !== key)
    );

    const updatedSet = new Set(this.deletedSkillNames());
    updatedSet.add(key);
    this.deletedSkillNames.set(updatedSet);
    this.saveDeletedSkillsToStorage(updatedSet);

    this.availableSkills.update((skills) =>
      skills.filter((s) => this.normalizeKey(s) !== key)
    );

    this.showDeleteConfirm.set(false);
    this.skillToDelete.set(null);
    this.isDeleting.set(false);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.skillToDelete.set(null);
  }

  syncResumeSkills(): void {
    const extracted = this.resumeSkills();
    if (!extracted.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Resume Data',
        detail: 'Upload a resume first to extract skills.',
      });
      return;
    }

    let addedCount = 0;
    const existingKeys = new Set(this.skillRatings().map((r) => this.normalizeKey(r.category)));
    const deletedSet = new Set(this.deletedSkillNames());

    for (const skill of extracted) {
      const key = this.normalizeKey(skill);
      // Remove from deleted set so user can sync them back
      if (deletedSet.has(key)) {
        deletedSet.delete(key);
      }

      if (!existingKeys.has(key)) {
        addedCount++;
        const nextEntry: Rating = { category: skill, rating: 4, type: 'SELF' };
        this.ratingApiService.createorUpdateSelfRating(nextEntry).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            this.skillRatings.update((prev) => [...prev, nextEntry]);
          },
        });
      }
    }

    this.deletedSkillNames.set(deletedSet);
    this.saveDeletedSkillsToStorage(deletedSet);

    if (addedCount > 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Resume Skills Synced',
        detail: `Added ${addedCount} skill(s) extracted from your resume.`,
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Already Synced',
        detail: 'All extracted resume skills are present in your ratings matrix.',
      });
    }
  }

  takeQuiz(skillName: string): void {
    this.router.navigate(['/quiz'], { queryParams: { category: skillName } });
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
        new Set([
          ...selfRatings.map((entry: Rating) => entry.category),
          ...this.resumeSkills(),
          ...this.availableSkills(),
        ]),
      ).filter(Boolean);

      this.skillRatings.set(selfRatings);
      this.quizAttempts.set(attempts || []);
      this.availableSkills.set(skillNames);
    } catch (error) {
      console.error('Unable to load rating data', error);
    }
  }

  private loadDeletedSkillsFromStorage(): Set<string> {
    try {
      const raw = localStorage.getItem('mordenec_deleted_skills');
      if (raw) {
        const arr = JSON.parse(raw);
        return new Set(arr.map((s: string) => this.normalizeKey(s)));
      }
    } catch {}
    return new Set();
  }

  private saveDeletedSkillsToStorage(set: Set<string>): void {
    try {
      localStorage.setItem('mordenec_deleted_skills', JSON.stringify(Array.from(set)));
    } catch {}
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
