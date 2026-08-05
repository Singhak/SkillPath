import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../../core/services/gamification.service';
import { InterviewReportService } from '../../../core/services/interview-report.service';
import { Achievement, InterviewReportData } from '../../../core/models/achievement.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gamification-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Top Gamification & Streaks Header Banner -->
    <div class="gamification-banner bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 shadow-xl border border-indigo-500/20 text-white mb-6">
      
      <!-- Network & Sync Status Banner Notification -->
      <div
        *ngIf="gamificationService.syncStatusMessage() as statusMsg"
        class="mb-4 p-3 rounded-xl bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between animate-fadeIn"
      >
        <div class="flex items-center space-x-2">
          <span class="text-base">⚡</span>
          <span class="font-medium">{{ statusMsg }}</span>
        </div>
        <span *ngIf="gamificationService.lastSyncedAt()" class="text-[10px] text-indigo-300/80">
          Last synced: {{ gamificationService.lastSyncedAt() }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

        <!-- User Level & XP Progress -->
        <div class="flex items-center space-x-4">
          <div class="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/30 text-white font-extrabold text-2xl border border-indigo-400/40">
            Lvl {{ gamificationService.level() }}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs uppercase tracking-wider font-semibold text-indigo-300">{{ gamificationService.levelTitle() }}</span>
              <span class="text-xs text-slate-400 font-medium">{{ gamificationService.xpPoints() }} XP</span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-slate-800/80 rounded-full h-3 mt-1.5 overflow-hidden border border-slate-700/50 p-0.5">
              <div
                class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                [style.width.%]="gamificationService.xpLevelProgress()"
              ></div>
            </div>
            <div class="text-[11px] text-slate-400 mt-1 flex justify-between">
              <span>Next Lvl: {{ gamificationService.xpNextLevelBase() }} XP</span>
              <span class="text-indigo-400 font-semibold">{{ gamificationService.xpToNextLevel() }} XP remaining</span>
            </div>
          </div>
        </div>

        <!-- Daily Streak Counter -->
        <div class="flex items-center justify-center lg:justify-start space-x-4 bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/40">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white text-2xl shadow-lg shadow-orange-500/30 animate-pulse">
            🔥
          </div>
          <div>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-black tracking-tight text-amber-400">{{ gamificationService.currentStreak() }} Day Streak!</span>
            </div>
            <p class="text-xs text-slate-400">Longest Streak: <strong class="text-slate-200">{{ gamificationService.longestStreak() }} Days</strong></p>
          </div>
        </div>

        <!-- Quick-Buttons & Sync Progress Option -->
        <div class="flex flex-wrap items-center justify-end gap-2.5">
          <!-- Network Indicator Badge -->
          <div class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span
              class="w-2.5 h-2.5 rounded-full inline-block"
              [ngClass]="isOnline()? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-500 animate-ping'"
            ></span>
            <span class="text-[11px] font-medium text-slate-300">
              {{ isOnline() ? 'Online' : 'Offline Mode' }}
            </span>
          </div>

          <!-- Pending Sync Badge -->
          <div
            *ngIf="gamificationService.pendingSyncCount() > 0"
            class="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center space-x-1"
          >
            <span>⚡</span>
            <span>{{ gamificationService.pendingSyncCount() }} Unsynced</span>
          </div>

          <!-- Convert Coins Button -->
          <button
            (click)="promptBuyAiCredits()"
            class="px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/40 text-amber-200 hover:text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95"
            title="Convert Coins to AI Credits"
          >
            <span>🪙</span>
            <span>Convert Coins</span>
          </button>

          <!-- Sync Progress Button -->
          <button
            (click)="gamificationService.syncProgressWithBackend(true)"
            [disabled]="gamificationService.isSyncing()"
            class="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 hover:text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Sync offline badges, XP, and progress with cloud backend"
          >
            <span [class.animate-spin]="gamificationService.isSyncing()">🔄</span>
            <span>{{ gamificationService.isSyncing() ? 'Syncing...' : 'Sync Progress' }}</span>
          </button>

          <!-- Report PDF -->
          <button
            (click)="generateAndDownloadReport()"
            class="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-indigo-200 hover:text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95 relative"
          >
            <span *ngIf="authService.currentPlan() !== 'Gold'" class="absolute -top-2 -right-2 bg-rose-500 rounded-full w-5 h-5 flex items-center justify-center border border-white text-[10px]">
              <i class="pi pi-lock"></i>
            </span>
            <span>📄</span>
            <span>Report PDF</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Achievements & Badges Showcase Grid -->
    <div class="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-800 gap-4">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center space-x-2">
            <span>🏆</span>
            <span>SkillPath Achievements & Milestones</span>
          </h3>
          <p class="text-xs text-slate-400">Earn XP, level up your developer profile, and unlock exclusive badges.</p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex space-x-1.5 bg-slate-800/70 p-1 rounded-xl border border-slate-700/50 self-start sm:self-auto">
          @for (cat of categories; track $index) {
          <button
            (click)="filterCategory.set(cat.id)"
            [class.bg-indigo-600]="filterCategory() === cat.id"
            [class.text-white]="filterCategory() === cat.id"
            [class.text-slate-400]="filterCategory() !== cat.id"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:text-white"
          >
            {{ cat.label }}
          </button>
          }
        </div>
      </div>

      <!-- Badges Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          *ngFor="let ach of filteredAchievements()"
          [class.opacity-60]="!ach.isUnlocked"
          [class.grayscale]="!ach.isUnlocked"
          class="relative group bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]"
          [ngClass]="ach.isUnlocked ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'border-slate-800'"
        >
          <!-- Badge Header -->
          <div class="flex items-start justify-between mb-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shadow-md bg-gradient-to-tr"
              [ngClass]="ach.badgeClass"
            >
              <i class="pi" [ngClass]="ach.icon"></i>
            </div>
            <span
              *ngIf="ach.isUnlocked"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1"
            >
              <span>✓</span> <span>Unlocked</span>
            </span>
            <span
              *ngIf="!ach.isUnlocked"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-400"
            >
              🔒 Locked
            </span>
          </div>

          <!-- Title & Desc -->
          <h4 class="font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{{ ach.title }}</h4>
          <p class="text-xs text-slate-400 mb-3 min-h-[32px] line-clamp-2">{{ ach.description }}</p>

          <!-- Progress Bar & XP -->
          <div class="mt-auto pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs">
            <div class="text-slate-400 text-[11px]">
              Progress: <strong class="text-indigo-300">{{ ach.currentProgress }}/{{ ach.requiredCount }}</strong>
            </div>
            <span class="font-semibold text-amber-400 text-[11px]">+{{ ach.xpReward }} XP</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Celebration Popup Modal for Newly Unlocked Achievement -->
    <div
      *ngIf="gamificationService.newlyUnlockedBadge() as badge"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div class="bg-gradient-to-b from-slate-900 to-indigo-950 border border-indigo-500/40 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <!-- Confetti effect ring -->
        <div class="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

        <div class="text-4xl mb-2 animate-bounce">🥳🎉</div>
        <h3 class="text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-1">Achievement Unlocked!</h3>
        <h2 class="text-2xl font-black text-white mb-4">{{ badge.title }}</h2>

        <div
          class="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white text-4xl shadow-xl bg-gradient-to-tr"
          [ngClass]="badge.badgeClass"
        >
          <i class="pi" [ngClass]="badge.icon"></i>
        </div>

        <p class="text-xs text-slate-300 mb-6">{{ badge.description }}</p>

        <div class="bg-indigo-500/20 border border-indigo-400/30 rounded-xl py-2 px-4 inline-flex items-center space-x-2 text-amber-400 font-bold text-sm mb-6">
          <span>⚡ Rewards:</span> <span>+{{ badge.xpReward }} XP</span>
        </div>

        <button
          (click)="gamificationService.dismissNewlyUnlockedBadge()"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
        >
          Claim Reward & Continue
        </button>
      </div>
    </div>

    <!-- Buy Credits Modal -->
    <div
      *ngIf="showBuyCreditsModal()"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div class="bg-gradient-to-b from-slate-900 to-indigo-950 border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <h2 class="text-xl font-bold text-white mb-2 flex justify-center items-center gap-2">
          <span>🪙</span> Convert Coins
        </h2>
        <p class="text-sm text-slate-300 mb-6">
          Your conversion rate: <strong class="text-amber-400 font-semibold">{{ currentConversionRate() }} Coins = 1 AI Credit</strong>
        </p>

        <div class="mb-6 flex flex-col items-center">
          <label class="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Number of Credits</label>
          <div class="flex items-center space-x-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
            <button 
              (click)="creditsToBuy.set(creditsToBuy() > 1 ? creditsToBuy() - 1 : 1)"
              class="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex justify-center items-center"
            >
              <i class="pi pi-minus text-xs"></i>
            </button>
            <input 
              type="number" 
              [ngModel]="creditsToBuy()" 
              (ngModelChange)="onCreditsChange($event)"
              class="w-16 text-center bg-transparent text-white font-bold text-lg outline-none appearance-none" 
              min="1"
            />
            <button 
              (click)="creditsToBuy.set(creditsToBuy() + 1)"
              class="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex justify-center items-center"
            >
              <i class="pi pi-plus text-xs"></i>
            </button>
          </div>
          <div class="mt-4 text-sm text-slate-300">
            Total Cost: <strong class="text-amber-400">{{ creditsToBuy() * currentConversionRate() }} Coins</strong>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            (click)="showBuyCreditsModal.set(false)"
            class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all"
          >
            Cancel
          </button>
          <button
            (click)="confirmBuyAiCredits()"
            class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class GamificationPanelComponent {
  readonly gamificationService = inject(GamificationService);
  private readonly interviewReportService = inject(InterviewReportService);
  public readonly authService = inject(AuthService); // public for template
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly messageService = inject(MessageService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  readonly isOnline = computed(() => this.gamificationService.networkService.status());
  readonly filterCategory = signal<string>('all');
  
  readonly showBuyCreditsModal = signal<boolean>(false);
  readonly creditsToBuy = signal<number>(1);
  readonly currentConversionRate = computed(() => {
    const plan = this.authService.currentPlan();
    return plan === 'Gold' ? 30 : plan === 'Copper' ? 50 : 100;
  });

  readonly categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'streak', label: '🔥 Streaks' },
    { id: 'quiz', label: '🎯 Quizzes' },
    { id: 'interview', label: '🤖 Interviews' },
    { id: 'skill', label: '📊 Skills' },
  ];

  filteredAchievements(): Achievement[] {
    const cat = this.filterCategory();
    const list = this.gamificationService.achievements();
    if (cat === 'all') return list;
    return list.filter((a) => a.category === cat);
  }

  generateAndDownloadReport(): void {
    if (this.authService.currentPlan() !== 'Gold') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: 'PDF Evaluation Reports require the Gold plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          }
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }
    const user = this.authService.currentUser();
    const reportData = this.interviewReportService.createReportData({
      userName: user?.name || 'SkillPath Learner',
      userEmail: user?.email || 'learner@skillpath.app',
      roleOrSkill: user?.targetRole || 'Full Stack Engineer',
      overallScore: 88,
    });
    this.interviewReportService.downloadPdfReport(reportData);
  }

  onCreditsChange(val: any): void {
    let parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    this.creditsToBuy.set(parsed);
  }

  promptBuyAiCredits(): void {
    this.creditsToBuy.set(1);
    this.showBuyCreditsModal.set(true);
  }

  confirmBuyAiCredits(): void {
    this.executeBuyAiCredits(this.creditsToBuy(), this.currentConversionRate());
    this.showBuyCreditsModal.set(false);
  }

  private executeBuyAiCredits(credits: number, rate: number): void {
    const cost = credits * rate;
    const currentCoins = this.authService.userCoins();
    if (currentCoins < cost) {
      if (this.messageService) {
        this.messageService.add({
          severity: 'error',
          summary: 'Insufficient Coins',
          detail: `You need ${cost} coins, but only have ${currentCoins}.`,
        });
      } else {
        alert(`Insufficient Coins. You need ${cost} coins, but only have ${currentCoins}.`);
      }
      return;
    }

    this.authService.buyAiCreditsWithCoins(credits).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (this.messageService) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Converted ${cost} coins to ${credits} AI credits!`,
          });
        }
      },
      error: (err) => {
        if (this.messageService) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to convert coins.',
          });
        }
      }
    });
  }
}
