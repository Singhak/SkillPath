import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Achievement, UserGamificationStats } from '../models/achievement.model';
import { UserResourceService } from './user-resource.service';
import { INITIAL_ACHIEVEMENTS } from '../../shared/constants';
import { environment } from '../../environments/environment';
import { NetworkService } from '../../shared/services/network.service';

export interface PendingSyncActivity {
  id: string;
  type: 'quiz' | 'interview' | 'skill' | 'daily_login';
  countIncrement: number;
  timestamp: string;
}

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
  readonly networkService = inject(NetworkService)

  // Network & Sync State signals
  readonly isSyncing = signal<boolean>(false);
  readonly pendingSyncCount = signal<number>(0);
  readonly lastSyncedAt = signal<string | null>(null);
  readonly syncStatusMessage = signal<string | null>(null);

  // Stats Counters
  readonly quizCompletedCount = signal<number>(0);
  readonly interviewCompletedCount = signal<number>(0);
  readonly skillsRatedCount = signal<number>(0);

  // Offline queue storage & deduplication tracking
  private pendingQueue: PendingSyncActivity[] = [];
  private syncedActivityIds: Set<string> = new Set();
  private autoSyncIntervalId: any = null;

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
    this.loadPendingQueue();
    this.loadSyncedIds();
    this.checkAndUpdateDailyStreak();
    // Immediate initial sync on app startup/login
    this.syncProgressWithBackend(false);
  }

  fetchBackendStats(): void {
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (data) => {
        if (data) {
          if (data.xpPoints != null && data.xpPoints > this.xpPoints()) {
            this.xpPoints.set(data.xpPoints);
          }
          if (data.currentStreak != null && data.currentStreak > this.currentStreak()) {
            this.currentStreak.set(data.currentStreak);
          }
          if (data.longestStreak != null && data.longestStreak > this.longestStreak()) {
            this.longestStreak.set(data.longestStreak);
          }
          this.saveStateToStorage();
        }
      },
      error: () => { }
    });
  }

  /**
   * Automatically or manually sync pending activities & local stats with backend.
   * Deduplicates records so double-syncing or duplicate network requests will not repeat stats.
   */
  syncProgressWithBackend(manual = false): void {
    if (this.isSyncing()) return;

    if (!this.networkService.status()) {
      if (manual) {
        this.syncStatusMessage.set('Currently offline. Progress stored locally until connection is restored.');
      }
      return;
    }

    this.isSyncing.set(true);
    if (manual) {
      this.syncStatusMessage.set('Synchronizing progress with cloud backend...');
    }

    // Filter queue to ensure no duplicate IDs are sent
    const activitiesToSend = this.pendingQueue.filter((act) => !this.syncedActivityIds.has(act.id));

    const payload = {
      activities: activitiesToSend,
      localStats: {
        xpPoints: this.xpPoints(),
        currentStreak: this.currentStreak(),
        longestStreak: this.longestStreak(),
      },
    };

    this.http.post<any>(`${this.apiUrl}/sync`, payload).subscribe({
      next: (res) => {
        // Mark sent activities as synced for deduplication
        activitiesToSend.forEach((act) => this.syncedActivityIds.add(act.id));
        this.saveSyncedIds();

        // Clear synced items from pending queue
        this.pendingQueue = this.pendingQueue.filter((act) => !this.syncedActivityIds.has(act.id));
        this.savePendingQueue();

        if (res && res.stats) {
          const s = res.stats;
          if (s.xpPoints != null && s.xpPoints > this.xpPoints()) this.xpPoints.set(s.xpPoints);
          if (s.currentStreak != null && s.currentStreak > this.currentStreak()) this.currentStreak.set(s.currentStreak);
          if (s.longestStreak != null && s.longestStreak > this.longestStreak()) this.longestStreak.set(s.longestStreak);
        }

        this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => { } });
        this.lastSyncedAt.set(new Date().toLocaleTimeString());
        this.isSyncing.set(false);

        if (manual || activitiesToSend.length > 0) {
          this.syncStatusMessage.set('Progress synced with backend!');
          setTimeout(() => {
            if (this.syncStatusMessage() === 'Progress synced with backend!') {
              this.syncStatusMessage.set(null);
            }
          }, 4000);
        }
      },
      error: () => {
        this.isSyncing.set(false);
        this.fetchBackendStats();
        if (manual) {
          this.syncStatusMessage.set('Cloud sync failed. Will retry automatically.');
        }
      },
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

    // Create unique activity item with deduplication ID
    const activityId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const activityItem: PendingSyncActivity = {
      id: activityId,
      type,
      countIncrement,
      timestamp: new Date().toISOString(),
    };

    if (!this.networkService.status()) {
      this.enqueuePendingActivity(activityItem);
      this.syncStatusMessage.set('Progress saved locally (Offline). Will auto-sync when online.');
    } else {
      // Send directly with deduplication activityId payload
      this.http.post<any>(`${this.apiUrl}/activity`, { type, increment: countIncrement, activityId }).subscribe({
        next: () => {
          this.syncedActivityIds.add(activityId);
          this.saveSyncedIds();
          this.lastSyncedAt.set(new Date().toLocaleTimeString());
        },
        error: () => {
          // If network error occurs, queue item for auto-sync retry
          this.enqueuePendingActivity(activityItem);
          this.syncStatusMessage.set('Network issue. Saved locally for background retry.');
        },
      });
    }
  }

  private enqueuePendingActivity(item: PendingSyncActivity): void {
    // Avoid enqueueing duplicates
    if (!this.pendingQueue.some((a) => a.id === item.id) && !this.syncedActivityIds.has(item.id)) {
      this.pendingQueue.push(item);
      this.savePendingQueue();
    }
  }

  addXp(amount: number): void {
    const previousLevel = this.level();
    this.xpPoints.update((prev) => prev + amount);

    // Award bonus coins on level up
    if (this.level() > previousLevel) {
      const bonusCoins = (this.level() - previousLevel) * 20;
      const newTotal = this.userResourceService.userCoins() + bonusCoins;
      const userStr = localStorage.getItem('currentUser');
      const userId = userStr ? JSON.parse(userStr).id : null;
      if (userId) {
        this.userResourceService.updateCoins(userId, newTotal).subscribe({ error: () => { } });
      } else {
        this.userResourceService.updateUserCredits({ coins: newTotal });
      }
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
      const saved = localStorage.getItem('imonbench_gamification');
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
      localStorage.setItem('imonbench_gamification', JSON.stringify(data));
    } catch {
      // Ignore
    }
  }

  private loadPendingQueue(): void {
    try {
      const saved = localStorage.getItem('imonbench_pending_sync');
      if (saved) {
        this.pendingQueue = JSON.parse(saved) || [];
      } else {
        this.pendingQueue = [];
      }
      this.pendingSyncCount.set(this.pendingQueue.length);
    } catch {
      this.pendingQueue = [];
      this.pendingSyncCount.set(0);
    }
  }

  private savePendingQueue(): void {
    try {
      localStorage.setItem('imonbench_pending_sync', JSON.stringify(this.pendingQueue));
      this.pendingSyncCount.set(this.pendingQueue.length);
    } catch {
      // Ignore
    }
  }

  private loadSyncedIds(): void {
    try {
      const saved = localStorage.getItem('imonbench_synced_ids');
      if (saved) {
        const arr = JSON.parse(saved);
        this.syncedActivityIds = new Set(arr);
      }
    } catch {
      this.syncedActivityIds = new Set();
    }
  }

  private saveSyncedIds(): void {
    try {
      // Limit saved synced IDs to last 500 to keep localStorage clean
      const arr = Array.from(this.syncedActivityIds).slice(-500);
      localStorage.setItem('imonbench_synced_ids', JSON.stringify(arr));
    } catch {
      // Ignore
    }
  }
}
