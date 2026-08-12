import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkthroughService } from '../../../core/services/walkthrough.service';

@Component({
  selector: 'app-walkthrough-unlock-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (walkthroughService.newlyUnlockedFeature(); as unlock) {
    <div class="fixed inset-0 z-99999 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="unlockModalTitle">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" (click)="walkthroughService.dismissUnlockedNotification()"></div>
      <div class="relative bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center text-center overflow-hidden animate-bounce-in">
        <!-- Glow -->
        <div class="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-pulse">
          <i class="pi pi-unlock text-3xl text-white"></i>
        </div>

        <span class="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          🎉 Feature Unlocked!
        </span>

        <h3 id="unlockModalTitle" class="text-xl font-extrabold text-white mb-1">
          Welcome to {{ unlock.tour.title }}
        </h3>
        <p class="text-xs text-slate-300 mb-6 leading-relaxed">
          With your upgraded <strong class="text-amber-400">{{ unlock.planName }}</strong> subscription, you have unlocked complete access to {{ unlock.tour.title }}. Take a quick 1-minute guided tour to explore all capabilities!
        </p>

        <div class="flex items-center gap-3 w-full">
          <button type="button" class="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all" (click)="walkthroughService.dismissUnlockedNotification()">
            Maybe Later
          </button>
          <button type="button" class="flex-1 py-2.5 px-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-1.5 transition-all" (click)="walkthroughService.startUnlockedTour()">
            <i class="pi pi-compass"></i>
            <span>Take Tour Now</span>
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    @keyframes bounce-in {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-bounce-in {
      animation: bounce-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class WalkthroughUnlockModalComponent {
  protected readonly walkthroughService = inject(WalkthroughService);
}
