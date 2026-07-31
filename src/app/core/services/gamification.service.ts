import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Achievement, UserGamificationStats } from '../models/achievement.model';
import { UserResourceService } from './user-resource.service';
import { INITIAL_ACHIEVEMENTS } from '../../shared/constants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  private readonly http = inject(HttpClient);
  private readonly userResourceService = inject(UserResourceService);
  private readonly apiUrl = `${environment.apiUrl}/gamification`;

  // Core signals
  readonly currentStreak = signal<number>(0);
  readonly longestStreak = signal<number>(0);
  readonly xpPoints = signal<number>(0);
  readonly lastActivityDate = signal<string>('');
  readonly achievements = signal<Achievement[]>(INITIAL_ACHIEVEMENTS);
  readonly newlyUnlockedBadge = signal<Achievement | null>(null);

  // Stats Counters
  readonly quizCompletedCount = signal<number>(0);
  readonly interviewCompletedCount = signal<number>(0);
  readonly skillsRatedCount = signal<number>(0);

  // Derived Computed signals
  readonly level = computed(() => {
    return Math.floor(this.xpPoints() / 250) + 1;
  });

  readonly levelTitle = computed(() => {
    const lvl = this.level();
    if (lvl === 1) return 'Novice Explorer';
    if (lvl <= 3) return 'Apprentice Developer';
    if (lvl <= 6) return 'Skill Practitioner';
    if (lvl <= 10) return 'Senior Specialist';
    if (lvl <= 15) return 'Master Architect';
    return 'Legendary Tech Leader';
  });

  readonly xpCurrentLevelBase = computed(() => (this.level() - 1) * 250);
  readonly xpNextLevelBase = computed(() => this.level() * 250);

  readonly xpLevelProgress = computed(() => {
    const current = this.xpPoints() - this.xpCurrentLevelBase();
    const needed = 250;
    return Math.min(100, Math.max(0, Math.round((current / needed) * 100)));
  });

  readonly xpToNextLevel = computed(() => {
    return this.xpNextLevelBase() - this.xpPoints();
  });

  readonly unlockedCount = computed(() => {
    return this.achievements().filter((a) => a.isUnlocked).length;
  });

  constructor() {
    this.loadStateFromStorage();
    this.fetchBackendStats();
    this.checkAndUpdateDailyStreak();
  }

  fetchBackendStats(): void {
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (data) => {
        if (data) {
          if (data.xpPoints != null) this.xpPoints.set(data.xpPoints);
          if (data.currentStreak != null) this.currentStreak.set(data.currentStreak);
          if (data.longestStreak != null) this.longestStreak.set(data.longestStreak);
        }
      },
      error: () => { }
    });
  }

  /**
   * Log an activity occurrence (e.g. quiz completion, interview finish, skill rating)
   */
  recordActivity(
    type: 'quiz' | 'interview' | 'skill' | 'daily_login',
    countIncrement = 1,
  ): void {
    this.checkAndUpdateDailyStreak();

    let xpGained = 0;
    if (type === 'quiz') {
      this.quizCompletedCount.update((prev) => prev + countIncrement);
      xpGained = 50 * countIncrement;
    } else if (type === 'interview') {
      this.interviewCompletedCount.update((prev) => prev + countIncrement);
      xpGained = 120 * countIncrement;
    } else if (type === 'skill') {
      this.skillsRatedCount.update((prev) => prev + countIncrement);
      xpGained = 25 * countIncrement;
    } else if (type === 'daily_login') {
      xpGained = 15;
    }

    if (xpGained > 0) {
      this.addXp(xpGained);
    }

    this.checkAchievementUnlocks();
    this.saveStateToStorage();

    // Post activity to backend
    this.http.post<any>(`${this.apiUrl}/activity`, { type, increment: countIncrement }).subscribe({ error: () => { } });
  }

  addXp(amount: number): void {
    const previousLevel = this.level();
    this.xpPoints.update((prev) => prev + amount);

    // Award bonus coins on level up
    if (this.level() > previousLevel) {
      const bonusCoins = (this.level() - previousLevel) * 20;
      this.userResourceService.updateUserCredits({
        coins: this.userResourceService.userCoins() + bonusCoins,
      });
    }
  }

  dismissNewlyUnlockedBadge(): void {
    this.newlyUnlockedBadge.set(null);
  }

  private checkAndUpdateDailyStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.lastActivityDate();

    if (!lastDate) {
      this.currentStreak.set(1);
      this.longestStreak.set(1);
      this.lastActivityDate.set(today);
      return;
    }

    if (lastDate === today) {
      return; // Already recorded activity today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      // Consecutive day!
      const newStreak = this.currentStreak() + 1;
      this.currentStreak.set(newStreak);
      if (newStreak > this.longestStreak()) {
        this.longestStreak.set(newStreak);
      }
    } else {
      // Streak broken
      this.currentStreak.set(1);
    }

    this.lastActivityDate.set(today);
    this.checkAchievementUnlocks();
    this.saveStateToStorage();
  }

  private checkAchievementUnlocks(): void {
    const updated = this.achievements().map((ach) => {
      let progress = 0;
      if (ach.category === 'streak') progress = this.currentStreak();
      if (ach.category === 'quiz') progress = this.quizCompletedCount();
      if (ach.category === 'interview') progress = this.interviewCompletedCount();
      if (ach.category === 'skill') progress = this.skillsRatedCount();

      const wasUnlocked = ach.isUnlocked;
      const nowUnlocked = progress >= ach.requiredCount;

      if (!wasUnlocked && nowUnlocked) {
        const newlyUnlocked = {
          ...ach,
          currentProgress: ach.requiredCount,
          isUnlocked: true,
          unlockedAt: new Date().toLocaleDateString(),
        };
        // Award XP reward
        this.addXp(ach.xpReward);
        this.newlyUnlockedBadge.set(newlyUnlocked);
        return newlyUnlocked;
      }

      return {
        ...ach,
        currentProgress: Math.min(progress, ach.requiredCount),
        isUnlocked: nowUnlocked,
      };
    });

    this.achievements.set(updated);
  }

  private loadStateFromStorage(): void {
    try {
      const saved = localStorage.getItem('skillpath_gamification');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentStreak.set(data.currentStreak ?? 1);
        this.longestStreak.set(data.longestStreak ?? 1);
        this.xpPoints.set(data.xpPoints ?? 0);
        this.lastActivityDate.set(data.lastActivityDate ?? '');
        this.quizCompletedCount.set(data.quizCompletedCount ?? 0);
        this.interviewCompletedCount.set(data.interviewCompletedCount ?? 0);
        this.skillsRatedCount.set(data.skillsRatedCount ?? 0);

        if (Array.isArray(data.achievements)) {
          this.achievements.set(data.achievements);
        }
      }
    } catch {
      // Ignore fallback
    }
  }

  private saveStateToStorage(): void {
    try {
      const data = {
        currentStreak: this.currentStreak(),
        longestStreak: this.longestStreak(),
        xpPoints: this.xpPoints(),
        lastActivityDate: this.lastActivityDate(),
        quizCompletedCount: this.quizCompletedCount(),
        interviewCompletedCount: this.interviewCompletedCount(),
        skillsRatedCount: this.skillsRatedCount(),
        achievements: this.achievements(),
      };
      localStorage.setItem('skillpath_gamification', JSON.stringify(data));
    } catch {
      // Ignore
    }
  }
}
