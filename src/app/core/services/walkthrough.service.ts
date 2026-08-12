import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface TourStep {
  id: string;
  targetSelector: string; // CSS selector or data-tour attribute e.g. '[data-tour="hero-banner"]'
  title: string;
  description: string;
  icon?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  route?: string; // Optional route to navigate to for this step
  requiredPlan?: 'Silver' | 'Copper' | 'Gold'; // Plan requirement if feature is locked
  actionHint?: string;
}

export interface FeatureTour {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Main' | 'Preparation' | 'Practice' | 'Pro Studio';
  requiredPlan?: 'Silver' | 'Copper' | 'Gold';
  steps: TourStep[];
}

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class WalkthroughService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly STORAGE_KEY = 'imonbench_completed_tours';

  // Signals
  readonly activeTour = signal<FeatureTour | null>(null);
  readonly currentStepIndex = signal<number>(0);
  readonly isTourActive = computed(() => this.activeTour() !== null);
  readonly currentStep = computed<TourStep | null>(() => {
    const tour = this.activeTour();
    const index = this.currentStepIndex();
    if (!tour || index < 0 || index >= tour.steps.length) return null;
    return tour.steps[index];
  });

  readonly completedTours = signal<string[]>([]);
  readonly isGuideModalOpen = signal<boolean>(false);
  readonly newlyUnlockedFeature = signal<{ tour: FeatureTour; planName: string } | null>(null);

  // Spotlight dimensions for active target
  readonly targetSpotlight = signal<SpotlightRect | null>(null);

  private previousPlanLevel = 1;
  private resizeListener?: () => void;

  // Catalog of platform tours covering ALL features thoroughly
  readonly toursCatalog: FeatureTour[] = [
    {
      id: 'main_overview',
      title: 'Platform Overview & Dashboard',
      description: 'Comprehensive tour covering your developer dashboard, AI credits, coins, XP badges, skill gap deck, analytics, and activity logs.',
      icon: 'pi pi-home',
      category: 'Main',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'welcome',
          targetSelector: '[data-tour="brand-logo"]',
          title: 'Welcome to ImOnBench AI!',
          description: 'ImOnBench AI is your comprehensive career accelerator and AI interview preparation platform.',
          icon: 'pi pi-sparkles',
          placement: 'right',
          route: '/dashboard',
          actionHint: 'Click Next to explore every feature on your dashboard.'
        },
        {
          id: 'dashboard-hero',
          targetSelector: '[data-tour="hero-actions"]',
          title: 'Quick Actions',
          description: 'Instantly launch a new technical quiz session or jump straight into 1-on-1 AI interview practice.',
          icon: 'pi pi-bolt',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'ai-credits',
          targetSelector: '[data-tour="credit-widget"]',
          title: 'AI Credits Wallet & Purchase',
          description: 'Monitor your remaining AI credits. Credits power full AI mock interviews, live copilot sessions, and automated evaluation reports.',
          icon: 'pi pi-microchip-ai',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'net-coins',
          targetSelector: '[data-tour="coin-widget"]',
          title: 'Net Coins & Rewards Converter',
          description: 'Earn Net Coins by maintaining daily practice streaks, scoring high quiz accuracy, and unlocking badges. Convert coins to AI credits anytime!',
          icon: 'pi pi-bitcoin',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'profile-widget',
          targetSelector: '[data-tour="profile-widget"]',
          title: 'Profile Completeness & Target Role',
          description: 'Keep your target role, bio, and skill stack updated to receive hyper-tailored AI interview questions and customized difficulty.',
          icon: 'pi pi-user-edit',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'gamification-panel',
          targetSelector: '[data-tour="gamification-panel"]',
          title: 'Developer Gamification & Badges',
          description: 'Track your XP level progress, active practice streaks, unlocked achievements, and developer level perks.',
          icon: 'pi pi-trophy',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'skill-gap-panel',
          targetSelector: '[data-tour="skill-gap-panel"]',
          title: 'Skill Gap & Spaced Repetition Review Deck',
          description: 'Review targeted flashcards based on your incorrect quiz responses to reinforce weak areas through spaced repetition.',
          icon: 'pi pi-layers',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'ai-tools-widget',
          targetSelector: '[data-tour="ai-tools-widget"]',
          title: 'AI Tools & Enhancements Suite',
          description: 'Access specialized AI utilities: Resume Parser, Job Description Matcher, STAR Story Coach, and Code Reviewers.',
          icon: 'pi pi-box',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'stats-grid',
          targetSelector: '[data-tour="stats-grid"]',
          title: 'Key Performance Metrics',
          description: 'Analyze your high-level career metrics: Total Quiz Attempts, Overall Accuracy Rate %, Practice Time, and Net XP Points.',
          icon: 'pi pi-chart-bar',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'analytics-grid',
          targetSelector: '[data-tour="analytics-grid"]',
          title: 'Advanced Analytics & Trends',
          description: 'Visualize your attempt trends over time and inspect category distribution charts to identify domain strengths (Unlocked on Copper plan).',
          icon: 'pi pi-chart-line',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'skill-mastery',
          targetSelector: '[data-tour="skill-mastery"]',
          title: 'Skill Mastery Breakdown',
          description: 'Detailed accuracy rate breakdown by technology (Angular, Node.js, SQL, System Design) based on quiz performance.',
          icon: 'pi pi-bolt',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'table-card',
          targetSelector: '[data-tour="table-card"]',
          title: 'Activity Log & Quiz History',
          description: 'Search and inspect your recent quiz attempts, total scores, correct/wrong counts, and time taken per session.',
          icon: 'pi pi-history',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'sidebar-guide-btn',
          targetSelector: '[data-tour="guide-nav-btn"]',
          title: 'Interactive Guide Launcher',
          description: 'Click "Interactive Guide" in the sidebar anytime to replay this tour or launch feature-specific walkthroughs on demand.',
          icon: 'pi pi-compass',
          placement: 'right',
          route: '/dashboard'
        }
      ]
    },
    {
      id: 'quizzes',
      title: 'Quizzes & Technical Drills',
      description: 'Master standard quizzes, 60s Speed Attack vs Alex AI Bot, searchable category filters, hint mechanics, and real-time score analytics.',
      icon: 'pi pi-play',
      category: 'Practice',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'quiz-modes',
          targetSelector: '[data-tour="quiz-cloze-demo"]',
          title: 'Technical Quiz Arena & Practice Modes',
          description: 'Welcome to the Quiz Arena! Choose between untimed Standard Practice or race against Alex AI Bot in 60s Speed Attack mode for up to 3x coin multipliers.',
          icon: 'pi pi-bolt',
          placement: 'bottom',
          route: '/quiz',
          actionHint: 'Click a mode card above or use the quick-try buttons to switch between Standard and Speed Attack!'
        },
        {
          id: 'quiz-filters',
          targetSelector: '[data-tour="quiz-category-filter"]',
          title: 'Searchable Category & Sub-Category Filters',
          description: 'Filter questions by any framework, programming language, or topic via the searchable dropdown. Combine with Sub-Category multi-select for precision drilling.',
          icon: 'pi pi-filter',
          placement: 'bottom',
          route: '/quiz',
          actionHint: 'Use the quick-try buttons to instantly select a category and see sub-categories populate!'
        },
        {
          id: 'quiz-start',
          targetSelector: '[data-tour="quiz-start-btn"]',
          title: 'Launch Your Drill Session',
          description: 'Once category is selected, click Launch Quiz (Standard) or Launch 60s Speed Match vs AI Bot to begin. Earn coins, XP, and streak multipliers on every correct answer.',
          icon: 'pi pi-play-circle',
          placement: 'top',
          route: '/quiz',
          actionHint: 'Select a category first, then hit "Launch Quiz Now" to start your drill session!'
        }
      ]
    },
    {
      id: 'skills',
      title: 'Skill Rating & Gap Matrix',
      description: 'Master target benchmarking, self-rating updates, 3-way radar matrix analysis, resume skill syncing, attempt progression, and head-to-head skill comparison.',
      icon: 'pi pi-bolt',
      category: 'Practice',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'skill-nav',
          targetSelector: '[data-tour="skills-nav-item"]',
          title: 'Skill Matrix Navigation',
          description: 'Access your central hub for self-assessment, target role benchmarking, and competency gap tracking.',
          icon: 'pi pi-compass',
          placement: 'right',
          route: '/skills',
          actionHint: 'Click to open Skill Matrix & Ratings page.'
        },
        {
          id: 'skill-target-role',
          targetSelector: '[data-tour="skill-target-role-bar"]',
          title: 'Target Role Benchmark Switcher',
          description: 'Switch between developer roles (Full-Stack, Frontend Specialist, Backend Lead, AI Engineer). Target goal stars & radar matrix dynamically adjust per role.',
          icon: 'pi pi-briefcase',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click any role chip to instantly align target goal benchmarks.'
        },
        {
          id: 'skill-kpis',
          targetSelector: '[data-tour="skill-kpi-widgets"]',
          title: 'Hero KPI Summary & Mastery Rank',
          description: 'Monitor your Avg Self Rating, Avg Quiz Score, Goal Index % Met, and overall Mastery Rank tier (e.g. Master, Legend, Practitioner).',
          icon: 'pi pi-star-fill',
          placement: 'bottom',
          route: '/skills'
        },
        {
          id: 'skill-guide-btn',
          targetSelector: '[data-tour="skill-guide-btn"]',
          title: 'Interactive Skill Gap Guide',
          description: 'Toggle the interactive guide to understand status badges: Goal Met (Green), Minor Gap (Yellow), and Critical Gap (Red).',
          icon: 'pi pi-info-circle',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click button to expand the visual guide.'
        },
        {
          id: 'skill-resume-sync',
          targetSelector: '[data-tour="resume-sync-card"]',
          title: 'Resume Skills Extraction & AI Sync',
          description: 'Automatically populate your matrix with skills parsed from your uploaded PDF resume. Click Sync Resume Skills anytime to update.',
          icon: 'pi pi-file-pdf',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Imports system-rated resume competencies automatically.'
        },
        {
          id: 'skill-add-form',
          targetSelector: '[data-tour="skill-add-form"]',
          title: 'Rate or Add Competency Form',
          description: 'Search or type any technology name, choose your 1-5 star confidence rating, or use 1-tap quick skill chips to save ratings instantly.',
          icon: 'pi pi-plus-circle',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Use quick chips for 1-click skill rating selection.'
        },
        {
          id: 'skill-analytics',
          targetSelector: '[data-tour="skill-analytics-section"]',
          title: 'Multi-View Visual Analytics',
          description: 'Switch between Bar Chart (Self vs Quiz), 3-Way Radar Spider Matrix (Self vs Quiz vs Target Role Goal), and Doughnut Proficiency Spread.',
          icon: 'pi pi-chart-line',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click chart tabs to toggle visualization modes.'
        },
        {
          id: 'skill-table',
          targetSelector: '[data-tour="skill-matrix-table"]',
          title: 'Competency & Skill Gap Table',
          description: 'Comprehensive table displaying all rated skills, target benchmark goals, quiz scores, attempt counts, and gap status tags.',
          icon: 'pi pi-table',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Use search & filter chips to drill down by tier or resume source.'
        },
        {
          id: 'skill-target-stars',
          targetSelector: '[data-tour="skill-target-stars"]',
          title: 'Interactive Target Goal Stars',
          description: 'Click any target goal star directly in the table to set custom target expectations for specific technologies.',
          icon: 'pi pi-bullseye',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click a star to customize your personal benchmark goal.'
        },
        {
          id: 'skill-self-stars',
          targetSelector: '[data-tour="skill-self-stars"]',
          title: 'Interactive Self-Rating Stars',
          description: 'Click self-rating stars directly in any row to update your confidence rating on the fly.',
          icon: 'pi pi-star',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click stars to adjust your self-assessed rating anytime.'
        },
        {
          id: 'skill-attempts',
          targetSelector: '[data-tour="skill-attempts-btn"]',
          title: 'Attempt History & Score Progression',
          description: 'Click the attempts pill on any skill to launch the Attempt History dialog featuring line chart accuracy progression and attempt logs.',
          icon: 'pi pi-history',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Click attempts pill to view quiz history line graph.'
        },
        {
          id: 'skill-compare',
          targetSelector: '[data-tour="skill-compare-box"]',
          title: 'Head-to-Head Skill Comparison',
          description: 'Check multiple skill checkboxes in the table and click Compare Skills to view a side-by-side radar analysis and metric grid.',
          icon: 'pi pi-sliders-h',
          placement: 'bottom',
          route: '/skills',
          actionHint: 'Select 2+ skills to unlock Head-to-Head Compare!'
        }
      ]
    },
    {
      id: 'ai_interview',
      title: 'AI Mock Interviewer',
      description: 'Simulate realistic technical and behavioral interviews with real-time AI feedback and speech analytics.',
      icon: 'pi pi-microchip-ai',
      category: 'Preparation',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'ai-interview-nav',
          targetSelector: '[data-tour="ai-interview-nav-item"]',
          title: 'AI Interview Studio',
          description: 'Experience 1-on-1 AI mock interviews customized to job descriptions or specific tech stacks.',
          icon: 'pi pi-microchip-ai',
          placement: 'right',
          route: '/aiinterview'
        },
        {
          id: 'create-job-profile',
          targetSelector: '[data-tour="create-interview-btn"]',
          title: 'AI Mock Interview & Job Profile Setup',
          description: 'Paste job descriptions or select target roles to let AI generate relevant technical & situational interview questions.',
          icon: 'pi pi-plus-circle',
          placement: 'bottom',
          route: '/aiinterview'
        },
        {
          id: 'star-story-bank-tool',
          targetSelector: '[data-tour="star-story-bank-btn"]',
          title: 'STAR Story Bank',
          description: 'Structure Situation, Task, Action, and Result stories to deliver impactful responses during behavioral rounds.',
          icon: 'pi pi-star',
          placement: 'bottom',
          route: '/aiinterview'
        }
      ]
    },
    {
      id: 'interviewer_studio',
      title: 'Interviewer Studio & Live Copilot',
      description: 'Host interview sessions, configure technology stack matrices, use live AI copilot probing, and generate candidate evaluation reports.',
      icon: 'pi pi-users',
      category: 'Pro Studio',
      requiredPlan: 'Copper',
      steps: [
        {
          id: 'studio-nav',
          targetSelector: '[data-tour="interviewer-studio-nav-item"]',
          title: 'Interviewer Studio (Pro Feature)',
          description: 'Designed for interviewers, hiring managers, and team leads to conduct structured technical interviews.',
          icon: 'pi pi-users',
          placement: 'right',
          route: '/interviewer-studio',
          requiredPlan: 'Copper'
        },
        {
          id: 'copilot-session',
          targetSelector: '[data-tour="studio-copilot-card"]',
          title: 'Custom Stack Matrix & AI Copilot',
          description: 'Configure technology weights, difficulty distribution, and leverage live AI Copilot to generate follow-up questions during interviews.',
          icon: 'pi pi-verified',
          placement: 'bottom',
          route: '/interviewer-studio',
          requiredPlan: 'Copper'
        }
      ]
    },
    {
      id: 'star_coach',
      title: 'STAR Story Coach & Behavioral Method',
      description: 'Master behavioral interviews using the STAR framework with AI story refinement and repository management.',
      icon: 'pi pi-star',
      category: 'Preparation',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'star-intro',
          targetSelector: '[data-tour="tab-star"]',
          title: 'STAR Story Coach & Response Evaluator',
          description: 'Master behavioral interviews using the STAR framework: Situation (🔵 Context), Task (🟣 Goal), Action (🟢 Contribution), and Result (🟡 Quantified Impact).',
          icon: 'pi pi-star',
          placement: 'bottom',
          route: '/dashboard',
          actionHint: 'Click Next to explore evaluation modes and response grading.'
        },
        {
          id: 'star-mode-switcher',
          targetSelector: '[data-tour="star-mode-switcher"]',
          title: 'Dual Evaluation Engine Mode',
          description: 'Toggle between Fast Rule Engine (Instant keyword checks, free) or AI Coach powered by LLM models (0.25 Credits, deep semantic breakdown & rewrite blueprint).',
          icon: 'pi pi-sliders-h',
          placement: 'bottom',
          route: '/dashboard',
          actionHint: 'Select Fast mode for quick checks or AI mode for deep feedback.'
        },
        {
          id: 'star-question-input',
          targetSelector: '[data-tour="star-question-input"]',
          title: 'Behavioral Interview Question Prompt',
          description: 'Enter any target behavioral interview prompt (e.g. "Describe a complex technical outage" or "How do you resolve conflict with stakeholders?").',
          icon: 'pi pi-question-circle',
          placement: 'right',
          route: '/dashboard',
          actionHint: 'Use "Inject Sample Answer" in the popover helper to auto-fill example data!'
        },
        {
          id: 'star-answer-input',
          targetSelector: '[data-tour="star-answer-input"]',
          title: 'Drafting Your STAR Response',
          description: 'Structure your response into 4 clear parts. Ensure your Action highlights individual "I" contributions and Result includes numbers or % metric gains.',
          icon: 'pi pi-file-edit',
          placement: 'top',
          route: '/dashboard',
          actionHint: 'Type your answer response or test using popover action helpers.'
        },
        {
          id: 'star-grade-btn',
          targetSelector: '[data-tour="star-grade-btn"]',
          title: 'Grading Your STAR Answer',
          description: 'Click Grade Response to evaluate your answer against HR standards and extract individual percentage scores for all 4 pillars.',
          icon: 'pi pi-bolt',
          placement: 'top',
          route: '/dashboard',
          actionHint: 'Click Grade Response or use "Grade Response Now" in the popover assistant!'
        },
        {
          id: 'star-breakdown-card',
          targetSelector: '[data-tour="star-breakdown-card"]',
          title: '4-Pillars Breakdown & AI Rewrites',
          description: 'Inspect percentage scores for Situation, Task, Action, and Result. Switch sub-tabs to read detailed AI analysis and copy improved STAR blueprints.',
          icon: 'pi pi-chart-bar',
          placement: 'left',
          route: '/dashboard',
          actionHint: 'Click "Save to Story Bank" to store your graded story in your repository!'
        },
        {
          id: 'star-repository',
          targetSelector: '[data-tour="tab-storybank"]',
          title: 'STAR Story Bank Repository',
          description: 'Your central library of structured workplace achievements organized by competency category, technology tags, and impact ratings (0-100 score).',
          icon: 'pi pi-bookmark',
          placement: 'bottom',
          route: '/dashboard',
          actionHint: 'Click tab to switch directly into your STAR Story Bank repository.'
        },
        {
          id: 'star-bank-search-bar',
          targetSelector: '[data-tour="star-bank-search-bar"]',
          title: 'Filter, Sort & 1-Tap Copy Export',
          description: 'Filter stories by competency category (Leadership, Conflict, Technical), search keywords, or use 1-Tap Copy to export formatted text for live interviews!',
          icon: 'pi pi-filter',
          placement: 'bottom',
          route: '/dashboard',
          actionHint: 'Click "Add New STAR Story" to draft new achievements anytime.'
        }
      ]
    },
    {
      id: 'gamification',
      title: 'XP Levels & Badges Showcase',
      description: 'Earn XP, level up your developer profile, and unlock exclusive platform badges.',
      icon: 'pi pi-trophy',
      category: 'Main',
      requiredPlan: 'Silver',
      steps: [
        {
          id: 'gamification-header-tour',
          targetSelector: '[data-tour="gamification-header"]',
          title: 'XP Level & Daily Streak Progress',
          description: 'Track your current developer XP level, progress bar, active daily practice streaks, and report exports.',
          icon: 'pi pi-star',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'gamification-badges-tour',
          targetSelector: '[data-tour="gamification-panel"]',
          title: 'Achievements & Milestones Showcase',
          description: 'View your unlocked milestone badges (First Step, Momentum Builder, Trivia Challenger) and filter by achievement category.',
          icon: 'pi pi-trophy',
          placement: 'bottom',
          route: '/dashboard'
        },
        {
          id: 'coins-redemption',
          targetSelector: '[data-tour="coin-widget"]',
          title: 'Net Coins Wallet & Credit Conversion',
          description: 'Earn Net Coins from daily practice streaks and convert them directly into free AI evaluation credits.',
          icon: 'pi pi-bitcoin',
          placement: 'bottom',
          route: '/dashboard'
        }
      ]
    }
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCompletedTours();

      // Monitor window resize/scroll to recalculate active target dimensions
      this.resizeListener = () => this.updateSpotlightPosition();
      window.addEventListener('resize', this.resizeListener);
      window.addEventListener('scroll', this.resizeListener, true);

      // Listen for Plan Level changes to auto-prompt for newly unlocked features!
      effect(() => {
        const currentLevel = this.authService.planLevel();
        if (currentLevel > this.previousPlanLevel) {
          const planName = this.authService.currentPlan();
          this.handlePlanUpgrade(currentLevel, planName);
        }
        this.previousPlanLevel = currentLevel;
      });

      // Auto-trigger main onboarding tour on first launch if authenticated & not completed
      setTimeout(() => {
        if (this.authService.isAuthenticated() && !this.isTourCompleted('main_overview')) {
          this.startTour('main_overview');
        }
      }, 1200);
    }
  }

  private loadCompletedTours(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.completedTours.set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load completed walkthrough tours', e);
    }
  }

  private saveCompletedTours(completed: string[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completed));
    } catch (e) {
      console.warn('Failed to save completed walkthrough tours', e);
    }
  }

  isTourCompleted(tourId: string): boolean {
    return this.completedTours().includes(tourId);
  }

  getTourById(tourId: string): FeatureTour | undefined {
    return this.toursCatalog.find(t => t.id === tourId);
  }

  isFeatureUnlocked(tour: FeatureTour): boolean {
    if (!tour.requiredPlan || tour.requiredPlan === 'Silver') return true;
    return this.authService.hasMinPlan(tour.requiredPlan);
  }

  /**
   * Starts a walkthrough tour by ID.
   * If `forceRestart` is true (e.g. user clicked Guide button), it will restart even if already completed.
   */
  startTour(tourId: string, forceRestart = false): void {
    const tour = this.getTourById(tourId);
    if (!tour) return;

    if (!forceRestart && this.isTourCompleted(tourId)) {
      return; // Walkthrough completed only once automatically
    }

    // Force clean reset first
    this.clearActiveTargetHighlight();
    this.isGuideModalOpen.set(false);

    // Create fresh object reference to guarantee signal change emission & synchronous step 0 reset
    const freshTour: FeatureTour = {
      ...tour,
      steps: tour.steps.map(s => ({ ...s }))
    };

    const firstStep = freshTour.steps[0];

    const activateTourState = () => {
      this.activeTour.set(freshTour);
      this.currentStepIndex.set(0);
      this.navigateToStepRoute(firstStep);
    };

    // If step 0 specifies a route and user is not on that page, navigate FIRST before activating tour!
    if (firstStep?.route && isPlatformBrowser(this.platformId)) {
      const currentUrl = this.router.url.split('?')[0].split('#')[0];
      const cleanTargetRoute = firstStep.route.split('?')[0].split('#')[0];

      if (!currentUrl.startsWith(cleanTargetRoute)) {
        this.router.navigateByUrl(firstStep.route).then(() => {
          setTimeout(activateTourState, 300);
        });
        return;
      }
    }

    activateTourState();
  }

  /**
   * Triggers celebration prompt when user unlocks a new feature tier.
   */
  private handlePlanUpgrade(newLevel: number, planName: string): void {
    // Find tours unlocked by this new plan level that haven't been completed yet
    const newlyUnlockedTour = this.toursCatalog.find(
      t => t.requiredPlan && this.authService.hasMinPlan(t.requiredPlan) && !this.isTourCompleted(t.id)
    );

    if (newlyUnlockedTour) {
      this.newlyUnlockedFeature.set({
        tour: newlyUnlockedTour,
        planName: planName
      });
    }
  }

  dismissUnlockedNotification(): void {
    this.newlyUnlockedFeature.set(null);
  }

  startUnlockedTour(): void {
    const unlocked = this.newlyUnlockedFeature();
    if (unlocked) {
      const tourId = unlocked.tour.id;
      this.dismissUnlockedNotification();
      setTimeout(() => {
        this.startTour(tourId, true);
      }, 50);
    }
  }

  nextStep(): void {
    const tour = this.activeTour();
    if (!tour) return;

    const nextIndex = this.currentStepIndex() + 1;
    if (nextIndex < tour.steps.length) {
      this.currentStepIndex.set(nextIndex);
      this.navigateToStepRoute(tour.steps[nextIndex]);
    } else {
      this.completeTour();
    }
  }

  previousStep(): void {
    const tour = this.activeTour();
    if (!tour) return;

    const prevIndex = this.currentStepIndex() - 1;
    if (prevIndex >= 0) {
      this.currentStepIndex.set(prevIndex);
      this.navigateToStepRoute(tour.steps[prevIndex]);
    }
  }

  skipTour(): void {
    const tour = this.activeTour();
    if (tour) {
      this.markTourAsCompleted(tour.id);
    }
    this.endTour();
  }

  completeTour(): void {
    const tour = this.activeTour();
    if (tour) {
      this.markTourAsCompleted(tour.id);
    }
    this.endTour();
  }

  private markTourAsCompleted(tourId: string): void {
    const current = this.completedTours();
    if (!current.includes(tourId)) {
      const updated = [...current, tourId];
      this.completedTours.set(updated);
      this.saveCompletedTours(updated);
    }
  }

  private activeTargetElement: HTMLElement | null = null;

  private clearActiveTargetHighlight(): void {
    if (this.activeTargetElement) {
      this.activeTargetElement.classList.remove('walkthrough-active-target');
      this.activeTargetElement = null;
    }
  }

  private endTour(): void {
    this.clearActiveTargetHighlight();
    this.activeTour.set(null);
    this.currentStepIndex.set(0);
    this.targetSpotlight.set(null);
  }

  openGuideModal(): void {
    if (this.isTourActive()) {
      this.endTour();
    }
    this.isGuideModalOpen.set(true);
  }

  closeGuideModal(): void {
    this.isGuideModalOpen.set(false);
  }

  resetAllTours(): void {
    this.completedTours.set([]);
    this.saveCompletedTours([]);
  }

  private navigateToStepRoute(step: TourStep): void {
    const executeStepActivation = () => {
      if (step.targetSelector && isPlatformBrowser(this.platformId)) {
        const el = document.querySelector<HTMLElement>(step.targetSelector);
        if (el && step.targetSelector.includes('tab-')) {
          el.click();
        }
      }
      this.updateSpotlightPosition();
    };

    if (step.route && isPlatformBrowser(this.platformId)) {
      const currentUrl = this.router.url;
      const cleanCurrentUrl = currentUrl.split('?')[0].split('#')[0];
      const cleanStepRoute = step.route.split('?')[0].split('#')[0];

      if (!cleanCurrentUrl.startsWith(cleanStepRoute)) {
        this.router.navigateByUrl(step.route).then(() => {
          setTimeout(executeStepActivation, 350);
        });
        return;
      }
    }
    setTimeout(executeStepActivation, 100);
  }

  updateSpotlightPosition(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.clearActiveTargetHighlight();

    const step = this.currentStep();
    if (!step) {
      this.targetSpotlight.set(null);
      return;
    }

    let el: HTMLElement | null = null;
    if (step.targetSelector) {
      el = document.querySelector<HTMLElement>(step.targetSelector);
    }

    if (!el) {
      // Target element not found on current view: set center default spotlight
      this.targetSpotlight.set({
        top: window.innerHeight / 2 - 50,
        left: window.innerWidth / 2 - 100,
        width: 200,
        height: 100
      });
      return;
    }

    this.activeTargetElement = el;
    el.classList.add('walkthrough-active-target');

    // Scroll element into center of viewport instantly so bounding rect is 100% accurate
    el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });

    const updateRect = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const padding = 8;
      this.targetSpotlight.set({
        top: Math.max(0, rect.top - padding),
        left: Math.max(0, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      });
    };

    updateRect();
    setTimeout(updateRect, 60);
  }
}
