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

export interface RoleBenchmark {
  roleName: string;
  icon: string;
  description: string;
  targets: Record<string, number>;
}

export const TARGET_ROLE_BENCHMARKS: RoleBenchmark[] = [
  {
    roleName: 'Fullstack Architect',
    icon: 'pi pi-server',
    description: 'Senior fullstack engineer leading Angular & Node.js architecture',
    targets: {
      angular: 5,
      typescript: 5,
      'html/css': 4,
      react: 3,
      'node.js': 5,
      rxjs: 4,
      git: 5,
    },
  },
  {
    roleName: 'Frontend Lead',
    icon: 'pi pi-desktop',
    description: 'Frontend expert specialized in Angular, Modern Web & UI performance',
    targets: {
      angular: 5,
      typescript: 5,
      'html/css': 5,
      react: 4,
      'node.js': 3,
      rxjs: 5,
      git: 4,
    },
  },
  {
    roleName: 'Backend Specialist',
    icon: 'pi pi-database',
    description: 'Backend engineer focused on Node.js services & architecture',
    targets: {
      angular: 2,
      typescript: 4,
      'html/css': 2,
      react: 2,
      'node.js': 5,
      rxjs: 3,
      git: 5,
    },
  },
];

export interface SkillPerformanceRow {
  skill: string;
  selfRating: number;
  quizScore: number;
  quizRating: number;
  attempts: number;
  alignment: 'High Match' | 'Underestimating' | 'Overestimating' | 'Needs Quiz';
  isFromResume?: boolean;
  ratingSource: 'SELF' | 'SYSTEM' | 'UNRATED';
  masteryTier: 'Legend' | 'Master' | 'Practitioner' | 'Novice' | 'Unrated';
  achievementBadges: string[];
  targetRating: number;
  gapScore: number;
  gapStatus: 'Goal Met' | 'Minor Gap' | 'Critical Gap';
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
  readonly selectedFilter = signal<'all' | 'resume' | 'match' | 'needs-quiz' | 'legend' | 'master' | 'practitioner' | 'novice'>('all');

  // Target Role Benchmarks
  readonly targetRoles = TARGET_ROLE_BENCHMARKS;
  readonly selectedTargetRole = signal<string>('Frontend Lead');

  // Custom Target Goals per skill
  readonly customTargetGoals = signal<Map<string, number>>(this.loadTargetGoalsFromStorage());

  // Compare Skills Modal State
  readonly showCompareModal = signal<boolean>(false);
  readonly compareSkillNames = signal<Set<string>>(new Set<string>());

  // Chart visual perspective tab
  readonly activeChartTab = signal<'bar' | 'radar' | 'doughnut'>('bar');

  // Attempt History Modal state
  readonly showAttemptsModal = signal<boolean>(false);
  readonly selectedSkillForAttempts = signal<string | null>(null);

  // Tracking deleted skills locally so user-deleted skills (including from resume) remain deleted
  readonly deletedSkillNames = signal<Set<string>>(this.loadDeletedSkillsFromStorage());

  // Resume skill integration
  readonly parsedResume = this.resumeParserService.parsedResume;
  readonly rawResumeSkills = computed(() => this.parsedResume()?.extractedSkills || []);
  readonly resumeSkills = computed(() => {
    const deletedSet = this.deletedSkillNames();
    return this.rawResumeSkills().filter((s) => !deletedSet.has(this.normalizeKey(s)));
  });

  // Delete modal state
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly skillToDelete = signal<string | null>(null);
  readonly isDeleting = signal<boolean>(false);

  // Guide card state
  readonly showGuide = signal<boolean>(false);

  toggleGuide(): void {
    this.showGuide.update((val) => !val);
  }

  setChartTab(tab: 'bar' | 'radar' | 'doughnut'): void {
    this.activeChartTab.set(tab);
  }

  setTargetRole(roleName: string): void {
    this.selectedTargetRole.set(roleName);
  }

  toggleSkillForCompare(skillName: string): void {
    const current = new Set(this.compareSkillNames());
    if (current.has(skillName)) {
      current.delete(skillName);
    } else {
      if (current.size >= 4) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Comparison Limit',
          detail: 'You can compare up to 4 skills at a time.',
        });
        return;
      }
      current.add(skillName);
    }
    this.compareSkillNames.set(current);
  }

  isSkillSelectedForCompare(skillName: string): boolean {
    return this.compareSkillNames().has(skillName);
  }

  openCompareModal(): void {
    if (this.compareSkillNames().size < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Select Skills to Compare',
        detail: 'Please select at least 2 skills to compare side-by-side.',
      });
      return;
    }
    this.showCompareModal.set(true);
  }

  closeCompareModal(): void {
    this.showCompareModal.set(false);
  }

  clearCompareSelection(): void {
    this.compareSkillNames.set(new Set<string>());
  }

  openAttemptsModal(skillName: string): void {
    this.selectedSkillForAttempts.set(skillName);
    this.showAttemptsModal.set(true);
  }

  closeAttemptsModal(): void {
    this.showAttemptsModal.set(false);
    this.selectedSkillForAttempts.set(null);
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
    const rows = this.skillPerformanceRows().filter((r) => r.selfRating > 0);
    if (!rows.length) {
      return 0;
    }
    const avg = rows.reduce((sum, r) => sum + r.selfRating, 0) / rows.length;
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

  readonly skillGapIndex = computed(() => {
    const rows = this.skillPerformanceRows();
    if (!rows.length) return 100;
    const metCount = rows.filter((r) => r.gapStatus === 'Goal Met').length;
    return Math.round((metCount / rows.length) * 100);
  });

  readonly overallMasteryRank = computed(() => {
    const avgSelf = this.averageSelfRating();
    const avgQuiz = this.averageQuizRating();
    const overallAvg = (avgSelf + avgQuiz) / 2;

    if (overallAvg >= 4.2) {
      return { title: 'Senior Architect', icon: 'pi pi-crown', tier: 'Legend' };
    } else if (overallAvg >= 3.5) {
      return { title: 'Lead Specialist', icon: 'pi pi-trophy', tier: 'Master' };
    } else if (overallAvg >= 2.5) {
      return { title: 'Fullstack Engineer', icon: 'pi pi-bolt', tier: 'Practitioner' };
    } else {
      return { title: 'Junior Developer', icon: 'pi pi-shield', tier: 'Novice' };
    }
  });

  readonly totalAssessedSkills = computed(() => this.skillPerformanceRows().length);

  readonly alignmentScore = computed(() => {
    const rows = this.skillPerformanceRows().filter((r) => r.selfRating > 0 && r.quizRating > 0);
    if (!rows.length) return 0;
    const matched = rows.filter((r) => r.alignment === 'High Match').length;
    return Math.round((matched / rows.length) * 100);
  });

  readonly skillPerformanceRows = computed<SkillPerformanceRow[]>(() => {
    const ratingEntryMap = new Map<string, Rating>();
    this.skillRatings().forEach((entry) => {
      const typeUpper = (entry.type || '').toUpperCase();
      if (typeUpper === 'TARGET') return; // Skip TARGET entries

      const key = this.normalizeKey(entry.category);
      if (!key) return;
      const existing = ratingEntryMap.get(key);

      // A SELF rating takes precedence over non-SELF, and newer entries overwrite older entries
      if (!existing || typeUpper === 'SELF' || (existing.type || '').toUpperCase() !== 'SELF') {
        ratingEntryMap.set(key, entry);
      }
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
    const keys = new Set<string>([...ratingEntryMap.keys(), ...performanceMap.keys(), ...resumeSkillKeys]);

    const selectedRoleObj = this.targetRoles.find((r) => r.roleName === this.selectedTargetRole());

    return Array.from(keys)
      .filter((key) => !deletedSet.has(key))
      .map((key) => {
        const existingRatingEntry = ratingEntryMap.get(key);
        const skillName =
          existingRatingEntry?.category ||
          this.resumeSkills().find((s) => this.normalizeKey(s) === key) ||
          this.titleCase(key);
        const quizMetrics = performanceMap.get(key);

        const selfRating = existingRatingEntry ? existingRatingEntry.rating : 0;
        const quizRating = quizRatingMap.get(key) || 0;
        const quizScore = quizMetrics ? Math.round(quizMetrics.score / quizMetrics.attempts) : 0;
        const attempts = quizMetrics?.attempts || 0;
        const isFromResume = resumeSkillKeys.has(key);

        // Target Rating Calculation (Role Benchmark vs Custom Goal)
        const roleTarget = selectedRoleObj?.targets[key] || 4;
        const customTarget = this.customTargetGoals().get(key);
        const targetRating = customTarget !== undefined ? customTarget : roleTarget;

        const effectiveRating = Math.max(selfRating, quizRating);
        const gapScore = targetRating - effectiveRating;

        let gapStatus: 'Goal Met' | 'Minor Gap' | 'Critical Gap' = 'Goal Met';
        if (gapScore <= 0) {
          gapStatus = 'Goal Met';
        } else if (gapScore === 1) {
          gapStatus = 'Minor Gap';
        } else {
          gapStatus = 'Critical Gap';
        }

        // Determine rating source: SYSTEM vs SELF vs UNRATED
        let ratingSource: 'SELF' | 'SYSTEM' | 'UNRATED' = 'UNRATED';
        if (existingRatingEntry) {
          const typeUpper = (existingRatingEntry.type || '').toUpperCase();
          if (typeUpper === 'SYSTEM' || typeUpper === 'RESUME') {
            ratingSource = 'SYSTEM';
          } else if (typeUpper === 'SELF') {
            ratingSource = 'SELF';
          } else {
            ratingSource = 'SELF';
          }
        } else if (isFromResume) {
          ratingSource = 'SYSTEM';
        }

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

        let masteryTier: 'Legend' | 'Master' | 'Practitioner' | 'Novice' | 'Unrated' = 'Unrated';
        if (selfRating >= 4 && quizRating >= 4) {
          masteryTier = 'Legend';
        } else if (selfRating >= 4 || quizRating >= 4) {
          masteryTier = 'Master';
        } else if (selfRating === 3 || quizRating === 3) {
          masteryTier = 'Practitioner';
        } else if (selfRating > 0 || quizRating > 0) {
          masteryTier = 'Novice';
        }

        const achievementBadges: string[] = [];
        if (attempts >= 3) {
          achievementBadges.push('Quiz Veteran');
        }
        if (quizScore >= 90) {
          achievementBadges.push('Perfect Score');
        }
        if (isFromResume) {
          achievementBadges.push('AI Resume');
        }
        if (ratingSource === 'SELF') {
          achievementBadges.push('Self Rated');
        }

        return {
          skill: skillName,
          selfRating,
          quizScore,
          quizRating,
          attempts,
          alignment,
          isFromResume,
          ratingSource,
          masteryTier,
          achievementBadges,
          targetRating,
          gapScore,
          gapStatus,
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
    } else if (filter === 'legend') {
      rows = rows.filter((r) => r.masteryTier === 'Legend');
    } else if (filter === 'master') {
      rows = rows.filter((r) => r.masteryTier === 'Master');
    } else if (filter === 'practitioner') {
      rows = rows.filter((r) => r.masteryTier === 'Practitioner');
    } else if (filter === 'novice') {
      rows = rows.filter((r) => r.masteryTier === 'Novice');
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

  readonly radarChartData = computed(() => {
    const rows = this.skillPerformanceRows();
    const topRows = rows.length > 8 ? rows.slice(0, 8) : rows;

    return {
      labels: topRows.map((r) => r.skill),
      datasets: [
        {
          label: 'Self Rating',
          data: topRows.map((r) => r.selfRating),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1',
        },
        {
          label: 'Quiz Rating',
          data: topRows.map((r) => r.quizRating),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.25)',
          pointBackgroundColor: '#0ea5e9',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#0ea5e9',
        },
        {
          label: `${this.selectedTargetRole()} Target`,
          data: topRows.map((r) => r.targetRating),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderDash: [5, 5],
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f59e0b',
        },
      ],
    };
  });

  readonly compareRows = computed(() => {
    const names = this.compareSkillNames();
    return this.skillPerformanceRows().filter((r) => names.has(r.skill));
  });

  readonly compareRadarChartData = computed(() => {
    const rows = this.compareRows();
    return {
      labels: rows.map((r) => r.skill),
      datasets: [
        {
          label: 'Self Rating',
          data: rows.map((r) => r.selfRating),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          pointBackgroundColor: '#6366f1',
        },
        {
          label: 'Quiz Rating',
          data: rows.map((r) => r.quizRating),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.25)',
          pointBackgroundColor: '#0ea5e9',
        },
        {
          label: 'Target Goal',
          data: rows.map((r) => r.targetRating),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          pointBackgroundColor: '#f59e0b',
        },
      ],
    };
  });

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

  readonly radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.6)' },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        pointLabels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          color: '#475569',
        },
        ticks: {
          stepSize: 1,
          display: true,
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        min: 0,
        max: 5,
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

  readonly attemptsForSelectedSkill = computed<QuizStats[]>(() => {
    const skill = this.selectedSkillForAttempts();
    if (!skill) return [];
    const targetKey = this.normalizeKey(skill);

    return this.quizAttempts()
      .filter((attempt) => this.normalizeKey(attempt.category) === targetKey)
      .sort((a, b) => new Date(b.attempedDate).getTime() - new Date(a.attempedDate).getTime());
  });

  readonly attemptsSummary = computed(() => {
    const attempts = this.attemptsForSelectedSkill();
    if (!attempts.length) {
      return {
        total: 0,
        bestScore: 0,
        avgScore: 0,
        avgTimeSec: 0,
        totalCoins: 0,
        totalHints: 0,
        accuracy: 0,
      };
    }

    const total = attempts.length;
    const scores = attempts.map((a) => {
      if (a.totalQuestions > 0) {
        return Math.round((a.correctAnswerCount / a.totalQuestions) * 100);
      }
      return Number(a.totalScore || 0);
    });

    const bestScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / total);
    const avgTimeSec = Math.round(
      attempts.reduce((sum, a) => sum + Number(a.totalTimeTakenInSeconds || 0), 0) / total
    );
    const totalCoins = attempts.reduce((sum, a) => sum + Number(a.totalCoinsEarned || 0), 0);
    const totalHints = attempts.reduce((sum, a) => sum + Number(a.hintsUsedCount || 0), 0);
    
    const totalQuestions = attempts.reduce((sum, a) => sum + Number(a.totalQuestions || 0), 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + Number(a.correctAnswerCount || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      total,
      bestScore,
      avgScore,
      avgTimeSec,
      totalCoins,
      totalHints,
      accuracy,
    };
  });

  readonly attemptTrendChartData = computed(() => {
    const attempts = [...this.attemptsForSelectedSkill()].reverse(); // Chronological order
    if (!attempts.length) {
      return { labels: [], datasets: [] };
    }

    const labels = attempts.map((a, i) => {
      const dateStr = new Date(a.attempedDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return `#${i + 1} (${dateStr})`;
    });

    const scores = attempts.map((a) => {
      if (a.totalQuestions > 0) {
        return Math.round((a.correctAnswerCount / a.totalQuestions) * 100);
      }
      return Number(a.totalScore || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Score Accuracy %',
          data: scores,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#10b981',
        },
      ],
    };
  });

  readonly attemptTrendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#64748b' },
      },
      y: {
        min: 0,
        max: 100,
        border: { dash: [4, 4] },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          callback: (value: any) => `${value}%`,
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: '#64748b',
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

  setFilter(filter: 'all' | 'resume' | 'match' | 'needs-quiz' | 'legend' | 'master' | 'practitioner' | 'novice'): void {
    this.selectedFilter.set(filter);
  }

  onClickAdd(): void {
    const skill = this.selectedSkill().trim();
    const rating = this.selectedRating();

    if (!skill || rating === null || rating === undefined) {
      return;
    }

    const canonicalSkill =
      this.availableSkills().find((s) => this.normalizeKey(s) === this.normalizeKey(skill)) || skill;

    this.updateRatingDirectly(canonicalSkill, rating);

    this.availableSkills.update((skills) =>
      skills.some((s) => this.normalizeKey(s) === this.normalizeKey(canonicalSkill))
        ? skills
        : [...skills, canonicalSkill]
    );
    this.selectedSkill.set('');
    this.selectedRating.set(null);
  }

  updateRatingDirectly(skillName: string, newRating: number): void {
    const key = this.normalizeKey(skillName);

    // Get current rating for this skill from computed rows
    const currentRow = this.skillPerformanceRows().find((r) => this.normalizeKey(r.skill) === key);
    const currentSelfRating = currentRow ? currentRow.selfRating : 0;

    // Toggle rating: if clicking the active rating star, reset to 0 (Unrated)
    let finalRating = newRating;
    if (currentSelfRating === newRating) {
      finalRating = 0;
    }

    // Clear from deleted skills set if re-adding/updating
    if (this.deletedSkillNames().has(key)) {
      const updatedSet = new Set(this.deletedSkillNames());
      updatedSet.delete(key);
      this.deletedSkillNames.set(updatedSet);
      this.saveDeletedSkillsToStorage(updatedSet);
    }

    const previousEntries = this.skillRatings();

    if (finalRating === 0) {
      // Optimistic update: remove self rating from state
      this.skillRatings.update((entries) =>
        entries.filter(
          (entry) => this.normalizeKey(entry.category) !== key || (entry.type || '').toUpperCase() === 'TARGET'
        )
      );

      this.ratingApiService
        .deleteSelfRating(skillName)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Rating Reset',
              detail: `Rating for ${skillName} reset to Unrated.`,
            });
          },
          error: (error) => {
            // Roll back state if API call fails
            this.skillRatings.set(previousEntries);
            this.messageService.add({
              severity: 'error',
              summary: 'Reset Failed',
              detail: error?.error?.message || error.message || 'Could not reset rating.',
            });
          },
        });
    } else {
      const nextEntry: Rating = {
        category: skillName,
        rating: finalRating,
        type: 'SELF',
      };

      // OPTIMISTIC UPDATE: Update signal state IMMEDIATELY so stars reflect instantly!
      this.skillRatings.update((entries) => {
        const updatedEntries = entries.filter(
          (entry) => this.normalizeKey(entry.category) !== key || (entry.type || '').toUpperCase() === 'TARGET'
        );
        return [...updatedEntries, nextEntry];
      });

      this.ratingApiService
        .createorUpdateSelfRating(nextEntry)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (savedRating) => {
            this.gamificationService.recordActivity('skill');

            // Sync with backend response payload if provided
            if (savedRating && savedRating.category) {
              this.skillRatings.update((entries) => {
                const filtered = entries.filter(
                  (entry) => this.normalizeKey(entry.category) !== key || (entry.type || '').toUpperCase() === 'TARGET'
                );
                return [...filtered, savedRating];
              });
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Rating Updated',
              detail: `Rating for ${skillName} updated to ${finalRating}/5 ⭐ (Self-Assessed)`,
            });
          },
          error: (error) => {
            // Roll back state if API call fails
            this.skillRatings.set(previousEntries);
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: error?.error?.message || error.message || 'Could not update rating.',
            });
          },
        });
    }
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
            detail: `Updated "${newName}" to ${rating}/5 ⭐ (Self-Assessed)`,
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
    const extracted = this.rawResumeSkills();
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
        const nextEntry: Rating = { category: skill, rating: 4, type: 'SYSTEM' };
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
        detail: `Added ${addedCount} skill(s) extracted from your resume as System-rated.`,
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

  getMasteryBadgeClass(tier: string): string {
    switch (tier) {
      case 'Legend':
        return 'badge-legend';
      case 'Master':
        return 'badge-master';
      case 'Practitioner':
        return 'badge-practitioner';
      case 'Novice':
        return 'badge-novice';
      default:
        return 'badge-neutral';
    }
  }

  getMasteryBadgeIcon(tier: string): string {
    switch (tier) {
      case 'Legend':
        return 'pi pi-crown';
      case 'Master':
        return 'pi pi-trophy';
      case 'Practitioner':
        return 'pi pi-bolt';
      case 'Novice':
        return 'pi pi-shield';
      default:
        return 'pi pi-circle';
    }
  }

  formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }

  setSkillTargetGoal(skillName: string, newTargetGoal: number): void {
    const key = this.normalizeKey(skillName);
    const currentTarget = this.customTargetGoals().get(key);

    let targetGoal = newTargetGoal;
    if (currentTarget === newTargetGoal) {
      targetGoal = 0;
    }

    const updatedMap = new Map(this.customTargetGoals());
    if (targetGoal === 0) {
      updatedMap.delete(key);
    } else {
      updatedMap.set(key, targetGoal);
    }

    // 1. Optimistic UI update
    this.customTargetGoals.set(updatedMap);

    // 2. Client storage (localStorage backup)
    this.saveTargetGoalsToStorage(updatedMap);

    // 3. Database persistence
    if (targetGoal > 0) {
      const targetEntry: Rating = {
        category: skillName,
        rating: targetGoal,
        type: 'TARGET',
      };
      this.ratingApiService
        .createorUpdateSelfRating(targetEntry)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Target Goal Set',
              detail: `Target goal for ${skillName} updated to ${targetGoal}/5 ⭐`,
            });
          },
          error: (err) => {
            console.warn('Backend DB target goal sync fallback:', err);
          },
        });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Target Reset',
        detail: `Custom target goal for ${skillName} reset to role benchmark default.`,
      });
    }
  }

  private async loadData(): Promise<void> {
    try {
      const [ratings, attempts] = await Promise.all([
        lastValueFrom(this.ratingApiService.getSelfRating()),
        lastValueFrom(this.quizApiService.getQuizAttempts()),
      ]);

      const selfRatings = ratings.filter((entry: Rating) =>
        entry.type?.toLowerCase() === 'self' || entry.type?.toLowerCase() === 'system' || entry.type?.toLowerCase() === 'resume'
      );
      const targetRatings = ratings.filter((entry: Rating) => entry.type?.toLowerCase() === 'target');
      
      if (targetRatings.length > 0) {
        const dbTargetsMap = new Map(this.customTargetGoals());
        targetRatings.forEach((tr: Rating) => {
          dbTargetsMap.set(this.normalizeKey(tr.category), tr.rating);
        });
        this.customTargetGoals.set(dbTargetsMap);
        this.saveTargetGoalsToStorage(dbTargetsMap);
      }

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
      const raw = localStorage.getItem('imonbench_deleted_skills') || localStorage.getItem('mordenec_deleted_skills');
      if (raw) {
        const arr = JSON.parse(raw);
        return new Set(arr.map((s: string) => this.normalizeKey(s)));
      }
    } catch {}
    return new Set();
  }

  private saveDeletedSkillsToStorage(set: Set<string>): void {
    try {
      localStorage.setItem('imonbench_deleted_skills', JSON.stringify(Array.from(set)));
    } catch {}
  }

  private loadTargetGoalsFromStorage(): Map<string, number> {
    try {
      const raw = localStorage.getItem('mordenec_skill_target_goals');
      if (raw) {
        const obj = JSON.parse(raw);
        return new Map(Object.entries(obj));
      }
    } catch {}
    return new Map();
  }

  private saveTargetGoalsToStorage(map: Map<string, number>): void {
    try {
      const obj = Object.fromEntries(map);
      localStorage.setItem('mordenec_skill_target_goals', JSON.stringify(obj));
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
