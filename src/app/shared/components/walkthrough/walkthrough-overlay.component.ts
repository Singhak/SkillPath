import { Component, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WalkthroughService } from '../../../core/services/walkthrough.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-walkthrough-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './walkthrough-overlay.component.html',
  styleUrl: './walkthrough-overlay.component.css',
})
export class WalkthroughOverlayComponent {
  protected readonly walkthroughService = inject(WalkthroughService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly activeTour = this.walkthroughService.activeTour;
  readonly currentStep = this.walkthroughService.currentStep;
  readonly currentStepIndex = this.walkthroughService.currentStepIndex;
  readonly spotlight = this.walkthroughService.targetSpotlight;

  readonly isLastStep = computed(() => {
    const tour = this.activeTour();
    if (!tour) return false;
    return this.currentStepIndex() === tour.steps.length - 1;
  });

  readonly totalSteps = computed(() => this.activeTour()?.steps.length || 0);

  readonly isStepLocked = computed(() => {
    const step = this.currentStep();
    if (!step?.requiredPlan || step.requiredPlan === 'Silver') return false;
    return !this.authService.hasMinPlan(step.requiredPlan);
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalSteps();
    if (total <= 1) return 100;
    return Math.round(((this.currentStepIndex() + 1) / total) * 100);
  });

  goToStep(index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const tour = this.activeTour();
    if (tour && index >= 0 && index < tour.steps.length) {
      this.walkthroughService.currentStepIndex.set(index);
    }
  }

  onNextStep(event: Event): void {
    event.stopPropagation();
    this.walkthroughService.nextStep();
  }

  onPreviousStep(event: Event): void {
    event.stopPropagation();
    this.walkthroughService.previousStep();
  }

  onSkipTour(event: Event): void {
    event.stopPropagation();
    this.walkthroughService.skipTour();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.walkthroughService.isTourActive()) return;

    if (event.key === 'Escape') {
      this.walkthroughService.skipTour();
    } else if (event.key === 'ArrowRight') {
      this.walkthroughService.nextStep();
    } else if (event.key === 'ArrowLeft') {
      this.walkthroughService.previousStep();
    }
  }

  goToUpgrade(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.walkthroughService.skipTour();
    this.router.navigateByUrl('/pricing');
  }

  // Interactive STAR Story Coach walkthrough actions
  readonly sampleStarPrompts = [
    {
      question: 'Describe a time you resolved a major performance bottleneck in production.',
      answer: 'Situation: Our API backend query latency spiked to 4.2s during peak traffic. Task: My goal was to reduce response latency under 250ms without system downtime. Action: I analyzed SQL execution plans, added composite database indexes, and integrated a Redis cache for hot read queries. Result: Response time dropped by 88% and system sustained 120k daily requests cleanly.'
    },
    {
      question: 'Tell me about a complex project where you had to lead under tight deadlines.',
      answer: 'Situation: We had 3 weeks to migrate our frontend app to Angular 19 for an enterprise launch. Task: I was tasked with orchestrating state management and component refactoring. Action: I broke work into daily Jira milestones, implemented reactive Angular signals, and conducted daily PR reviews. Result: Delivered 2 days early with zero critical post-launch bugs.'
    }
  ];

  injectSampleStarData(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const sample = this.sampleStarPrompts[Math.floor(Math.random() * this.sampleStarPrompts.length)];

    const qEl = document.querySelector<HTMLInputElement>('#behavioral_question');
    const aEl = document.querySelector<HTMLTextAreaElement>('#answer_textarea');

    if (qEl) {
      qEl.value = sample.question;
      qEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (aEl) {
      aEl.value = sample.answer;
      aEl.dispatchEvent(new Event('input', { bubbles: true }));
    }

    setTimeout(() => {
      this.walkthroughService.updateSpotlightPosition();
    }, 150);
  }

  triggerGradeButton(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const btn = document.querySelector<HTMLButtonElement>('[data-tour="star-grade-btn"]');
    if (btn) {
      btn.click();
      setTimeout(() => {
        this.walkthroughService.updateSpotlightPosition();
      }, 250);
    }
  }

  switchToStarTab(tabName: 'star' | 'storybank', event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const selector = tabName === 'star' ? '[data-tour="tab-star"]' : '[data-tour="tab-storybank"]';
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      el.click();
      setTimeout(() => {
        this.walkthroughService.updateSpotlightPosition();
      }, 250);
    }
  }

  private ensureOnQuizPage(callback: () => void): void {
    const currentUrl = this.router.url.split('?')[0].split('#')[0];
    if (!currentUrl.startsWith('/quiz')) {
      this.router.navigateByUrl('/quiz').then(() => {
        setTimeout(callback, 350);
      });
    } else {
      callback();
    }
  }

  // Interactive Quizzes & Technical Drills walkthrough actions
  selectQuizMode(mode: 'standard' | 'speed_bot', event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.ensureOnQuizPage(() => {
      const modeCards = document.querySelectorAll<HTMLElement>('.mode-card');
      if (modeCards.length >= 2) {
        if (mode === 'standard') {
          modeCards[0].click();
        } else {
          modeCards[1].click();
        }
      }
      setTimeout(() => {
        this.walkthroughService.updateSpotlightPosition();
      }, 150);
    });
  }

  isQuizModeActive(mode: 'standard' | 'speed_bot'): boolean {
    if (typeof document === 'undefined') return false;
    const modeCards = document.querySelectorAll<HTMLElement>('.mode-card');
    if (modeCards.length >= 2) {
      if (mode === 'standard') {
        return modeCards[0].classList.contains('mode-card--active');
      } else {
        return modeCards[1].classList.contains('mode-card--active');
      }
    }
    return false;
  }

  /**
   * Selects a category using router query params (the quiz page auto-selects it via queryParams subscription),
   * then opens the Sub-Category multiselect and picks the first available option.
   */
  selectSampleCategory(catName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    // Navigate to /quiz?category=X — quiz-view's loadInitialData() picks this up via queryParams subscription
    // and calls selectedCategory.set() + onCategoryChange() which populates subCategories signal
    this.router.navigateByUrl(`/quiz?category=${encodeURIComponent(catName)}`).then(() => {
      // Wait for Angular to process queryParams, set selectedCategory, and render sub-categories
      setTimeout(() => {
        this.walkthroughService.updateSpotlightPosition();
        // Give Angular another tick to render the multiselect options before opening it
        setTimeout(() => {
          this.autoSelectFirstSubCategory();
        }, 400);
      }, 600);
    });
  }

  /**
   * Opens the Sub-Category PrimeNG MultiSelect, clicks the first rendered option, then closes the panel.
   * p-multiSelect uses appendTo="body" so the overlay panel is appended to <body>.
   */
  private autoSelectFirstSubCategory(): void {
    // The rendered PrimeNG multiselect trigger is a div.p-multiselect inside the p-multiSelect host
    const trigger = document.querySelector<HTMLElement>(
      '[data-tour="quiz-subcategory-filter"] .p-multiselect, [data-tour="quiz-subcategory-filter"] div[role="combobox"]'
    );
    if (!trigger) return;

    trigger.click();

    // Wait for body-appended overlay panel to render
    setTimeout(() => {
      // PrimeNG v17+ body-appended overlay — items are li.p-multiselect-option
      const opts = document.querySelectorAll<HTMLElement>(
        'body > .p-overlay-mask ~ * li.p-multiselect-option, body li.p-multiselect-option, li.p-multiselect-option'
      );

      if (opts.length > 0) {
        opts[0].click();
      }

      // Close panel with Escape after selection
      setTimeout(() => {
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        this.walkthroughService.updateSpotlightPosition();
      }, 300);
    }, 400);
  }



  triggerQuizLaunch(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.ensureOnQuizPage(() => {
      const btn = document.querySelector<HTMLButtonElement>('[data-tour="quiz-start-btn"]') || document.querySelector<HTMLButtonElement>('.start-btn');
      if (btn && !btn.disabled) {
        btn.click();
        setTimeout(() => {
          this.walkthroughService.updateSpotlightPosition();
        }, 300);
      }
    });
  }

  triggerHintClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.ensureOnQuizPage(() => {
      const btn = document.querySelector<HTMLButtonElement>('[data-tour="quiz-hint-btn"]') || document.querySelector<HTMLButtonElement>('.action-btn--hint');
      if (btn && !btn.disabled) {
        btn.click();
        setTimeout(() => {
          this.walkthroughService.updateSpotlightPosition();
        }, 250);
      }
    });
  }

  selectFirstOption(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.ensureOnQuizPage(() => {
      const opts = document.querySelectorAll<HTMLElement>('.quiz-question-area [role="button"]');
      if (opts.length > 0) {
        opts[0].click();
        setTimeout(() => {
          this.walkthroughService.updateSpotlightPosition();
        }, 200);
      }
    });
  }

  navigateToQuizPage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigateByUrl('/quiz').then(() => {
      setTimeout(() => {
        this.walkthroughService.updateSpotlightPosition();
      }, 300);
    });
  }


  // Calculate popover position style based on spotlight position & autonomous collision-free placement
  getPopoverStyle(): { [key: string]: string } {
    const spot = this.spotlight();
    const step = this.currentStep();
    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (!spot) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    // Measure exact DOM dimensions of popover tooltip if rendered
    let popoverWidth = 440;
    let popoverHeight = 340;

    if (typeof document !== 'undefined') {
      const popoverEl = document.querySelector<HTMLElement>('.walkthrough-popover');
      if (popoverEl) {
        popoverWidth = popoverEl.offsetWidth || 440;
        popoverHeight = popoverEl.offsetHeight || 340;
      }
    }

    popoverWidth = Math.min(popoverWidth, winWidth - 32);

    const gap = 14;
    const spotBottom = spot.top + spot.height;
    const spotRight = spot.left + spot.width;

    // Check 4-direction clearance around the target spotlight rectangle
    const fitsTop = spot.top - popoverHeight - gap >= 12;
    const fitsBottom = spotBottom + popoverHeight + gap <= winHeight - 12;
    const fitsRight = spotRight + popoverWidth + gap <= winWidth - 12;
    const fitsLeft = spot.left - popoverWidth - gap >= 12;

    let chosenPlacement: 'top' | 'bottom' | 'right' | 'left' = 'bottom';
    const preferred = step?.placement || 'bottom';

    // 1. Check preferred placement first
    if (preferred === 'top' && fitsTop) chosenPlacement = 'top';
    else if (preferred === 'bottom' && fitsBottom) chosenPlacement = 'bottom';
    else if (preferred === 'right' && fitsRight) chosenPlacement = 'right';
    else if (preferred === 'left' && fitsLeft) chosenPlacement = 'left';
    else {
      // 2. Automatically select best non-overlapping side
      if (fitsTop) chosenPlacement = 'top';
      else if (fitsBottom) chosenPlacement = 'bottom';
      else if (fitsRight) chosenPlacement = 'right';
      else if (fitsLeft) chosenPlacement = 'left';
      else {
        // Fallback: Select direction with largest clearance
        const spaceAbove = spot.top;
        const spaceBelow = winHeight - spotBottom;
        const spaceRight = winWidth - spotRight;
        const spaceLeft = spot.left;
        const maxSpace = Math.max(spaceAbove, spaceBelow, spaceRight, spaceLeft);

        if (maxSpace === spaceAbove) chosenPlacement = 'top';
        else if (maxSpace === spaceBelow) chosenPlacement = 'bottom';
        else if (maxSpace === spaceRight) chosenPlacement = 'right';
        else chosenPlacement = 'left';
      }
    }

    let top = 0;
    let left = 0;

    if (chosenPlacement === 'top') {
      top = spot.top - popoverHeight - gap;
      left = spot.left + spot.width / 2 - popoverWidth / 2;
    } else if (chosenPlacement === 'bottom') {
      top = spotBottom + gap;
      left = spot.left + spot.width / 2 - popoverWidth / 2;
    } else if (chosenPlacement === 'right') {
      top = spot.top + spot.height / 2 - popoverHeight / 2;
      left = spotRight + gap;
    } else {
      // 'left'
      top = spot.top + spot.height / 2 - popoverHeight / 2;
      left = spot.left - popoverWidth - gap;
    }

    // Keep horizontal position within screen boundaries
    left = Math.max(12, Math.min(left, winWidth - popoverWidth - 12));

    // Clamp top position so popover strictly avoids overlapping spotlight target
    if (chosenPlacement === 'top') {
      top = Math.min(top, spot.top - popoverHeight - 4);
      top = Math.max(12, top);
    } else if (chosenPlacement === 'bottom') {
      top = Math.max(top, spotBottom + 4);
      top = Math.min(winHeight - popoverHeight - 12, top);
    } else {
      top = Math.max(12, Math.min(top, winHeight - popoverHeight - 12));
    }

    const maxAvailHeight = winHeight - top - 12;

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      maxHeight: `${maxAvailHeight}px`
    };
  }
}
