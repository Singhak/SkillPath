import { Component, computed, effect, inject, OnDestroy, OnInit, signal, DestroyRef, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { QuizStatsService } from '../service/quiz-stats.service';
import { AuthService } from '../../core/services/auth.service';
import { Timer } from '../../shared/services/timer';
import { QuizSummaryComponent } from '../service/quiz-summary/quiz-summary';
import { Category } from '../../core/models/category.model';
import { FormsModule } from '@angular/forms';
import { Question } from '../../shared/components/question/question.model';
import { QuestionComponent } from '../../shared/components/question/question';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { ReportIssueService } from '../../core/services/report-issue.service';
import { GamificationService } from '../../core/services/gamification.service';
import { ReportIssueComponent } from '../../shared/components/report-issue/report-issue.component';
import { CatrgoryApiService } from '../../core/services/apis/category-api.service';
import { QuestionApiService } from '../../core/services/apis/question-api.service';
import { UserApiService } from '../../core/services/apis/user-api.service';

@Component({
  selector: 'app-quiz-view',
  imports: [
    QuestionComponent,
    TagModule,
    ButtonModule,
    QuizSummaryComponent,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    DialogModule,
    SelectModule,
    TextareaModule,
    CommonModule,
    ReportIssueComponent,
  ],
  templateUrl: './quiz-view.html',
  styleUrl: './quiz-view.css',
  providers: [Timer],
})
export class QuizView implements OnInit, OnDestroy {
  readonly Math = Math;
  // region Service Injections
  readonly questionApiService = inject(QuestionApiService);
  readonly messanger = inject(MessageService);
  readonly quizStatsService = inject(QuizStatsService);
  readonly categoryApiService = inject(CatrgoryApiService);
  readonly userService = inject(UserApiService);
  readonly authService = inject(AuthService);
  private readonly reportIssueService = inject(ReportIssueService);
  private readonly route = inject(ActivatedRoute);
  readonly timer = inject(Timer);
  private readonly destroyRef = inject(DestroyRef);

  readonly questionCountOptions = [5, 10, 15];
  readonly questionCount = signal<number>(15);
  // endregion

  constructor() {
    effect(() => {
      if (this.reportIssueService.displayDialog()) {
        this.timer.stop();
      } else {
        this.timer.start();
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.currentQuiz() || this.isQuizFinished() || this.isVsMatchFinished()) return;

    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

    const key = event.key;

    if (key === 'Enter') {
      event.preventDefault();
      if (!this.isSubmited()) {
        if (this.selectedAnswer()?.trim()?.length) {
          this.onSubmitClick();
          // If it's the last question, automatically finish!
          if (this.currentQuizIndex() + 1 === this.quizesCount()) {
            setTimeout(() => this.onNextClick(), 150);
          }
        }
      } else {
        // If answer already submitted, pressing Enter proceeds to Next / Finish
        this.onNextClick();
      }
    } else if (key === 'ArrowRight' || key === ' ') {
      if (this.isSubmited()) {
        event.preventDefault();
        this.onNextClick();
      }
    }
  }

  // region Component State
  // Quiz selection state
  allCategories = signal<Category[]>([]);
  selectedCategory = signal<string | null>(null);
  selectedSubCategories = signal<string[] | null>(null);

  // Mode Selection: Standard vs Speed-Quiz vs AI Bot
  quizMode = signal<'standard' | 'speed_bot'>('standard');

  // Speed-Quiz Timer & Streak State
  speedTimeRemaining = signal<number>(60);
  currentStreak = signal<number>(0);
  maxStreak = signal<number>(0);
  streakMultiplier = computed(() => {
    const streak = this.currentStreak();
    if (streak >= 5) return 3.0;
    if (streak >= 3) return 2.0;
    if (streak >= 2) return 1.5;
    return 1.0;
  });

  // AI Bot Simulation State
  botScore = signal<number>(0);
  botProgressIndex = signal<number>(0);
  botCorrectCount = signal<number>(0);
  botStatusMessage = signal<string>('Alex AI Bot is preparing...');
  isBotFinished = signal<boolean>(false);

  // VS Match Result State
  isVsMatchFinished = signal<boolean>(false);
  vsMatchWinner = signal<'user' | 'bot' | 'tie'>('user');
  bonusCoinsEarned = signal<number>(0);

  private speedTimerInterval: any = null;
  private botInterval: any = null;

  // Quiz gameplay state
  quizes = signal<Question[]>([]);
  quizesCount = signal<number>(0);
  currentQuiz = signal<Question | null>(null);
  currentQuizIndex = signal<number>(0);
  hintIndex = signal<number>(-1);
  selectedAnswer = signal<string>('');
  numberOfCorrectAns = 0;
  userAttempsCount = signal(0);

  // UI state
  isLoading = signal<boolean>(false);
  isSubmited = signal<boolean>(false);
  isQuizFinished = signal(false);
  isFinishing = signal(false);
  // endregion

  // region Computed State
  categories = computed(() => this.allCategories().map((c) => c.category));
  subCategories = signal<string[]>([]);
  coins = this.authService.userCoins;
  availableHints = computed(() => {
    const hints = this.currentQuiz()?.hints ?? [];
    const usedHints = this.hintIndex() + 1;
    return hints.length - usedHints;
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.timer.destroy();
    this.stopSpeedQuizEngine();
    this.quizStatsService.reset();
  }

  // region Data Loading and Setup
  private loadInitialData(): void {
    this.categoryApiService.getCategory().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((categories) => {
      this.allCategories.set(categories);
      this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
        const categoryQuery = params['category'];
        if (categoryQuery) {
          const matchedCategory = categories.find(c => c.category.toLowerCase() === categoryQuery.toLowerCase());
          if (matchedCategory) {
            this.selectedCategory.set(matchedCategory.category);
            this.onCategoryChange();
          }
        }
      });
    });
  }

  fetchQuiz(): void {
    const category = this.selectedCategory();
    const subCategories = this.selectedSubCategories();
    if (category) {
      this.isLoading.set(true);
      this.questionApiService
        .getQuestions({ category, subCategory: subCategories, questionCount: this.questionCount() })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (quize) => {
            this.quizStatsService.quizId.set(quize.quizId);
            this.quizes.set(quize?.questions ?? []);
            this.quizesCount.set(quize?.questions.length ?? 0);
            if (quize?.questions.length > 0) {
              this.startQuestion(0);
              if (this.quizMode() === 'speed_bot') {
                this.startSpeedQuizEngine();
              }
            }
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
            this.messanger.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load quiz questions. Please try again.',
              life: 5000,
            });
          },
        });
    }
  }

  private startSpeedQuizEngine(): void {
    this.stopSpeedQuizEngine();
    this.speedTimeRemaining.set(60);
    this.currentStreak.set(0);
    this.maxStreak.set(0);
    this.botScore.set(0);
    this.botProgressIndex.set(0);
    this.botCorrectCount.set(0);
    this.isBotFinished.set(false);
    this.isVsMatchFinished.set(false);
    this.bonusCoinsEarned.set(0);
    this.botStatusMessage.set('Alex AI Bot is analyzing Q1...');

    // 1. Start 60s Countdown Timer
    this.speedTimerInterval = setInterval(() => {
      if (this.speedTimeRemaining() > 0) {
        this.speedTimeRemaining.update((t) => t - 1);
        if (this.speedTimeRemaining() === 0) {
          this.finishSpeedMatch();
        }
      }
    }, 1000);

    // 2. Start Concurrent AI Bot Simulation
    this.simulateBotGameplay();
  }

  private simulateBotGameplay(): void {
    const totalQ = this.quizesCount();
    if (totalQ === 0) return;

    const botStep = () => {
      if (this.isBotFinished() || this.botProgressIndex() >= totalQ || this.speedTimeRemaining() <= 0) {
        this.isBotFinished.set(true);
        this.botStatusMessage.set('Alex AI Bot has completed all questions!');
        return;
      }

      const currentIdx = this.botProgressIndex();
      this.botStatusMessage.set(`Alex AI Bot is solving Q${currentIdx + 1}...`);

      // Simulated thinking delay (2.2s to 4.5s per question)
      const delayMs = Math.floor(Math.random() * 2300) + 2200;

      this.botInterval = setTimeout(() => {
        if (this.speedTimeRemaining() <= 0) return;

        // 80% Bot Accuracy
        const isCorrect = Math.random() < 0.8;
        if (isCorrect) {
          this.botScore.update((s) => s + 5);
          this.botCorrectCount.update((c) => c + 1);
          this.botStatusMessage.set(`Alex AI Bot answered Q${currentIdx + 1} correctly! ⚡`);
        } else {
          this.botStatusMessage.set(`Alex AI Bot missed Q${currentIdx + 1}.`);
        }

        this.botProgressIndex.update((idx) => idx + 1);

        if (this.botProgressIndex() >= totalQ) {
          this.isBotFinished.set(true);
          this.botStatusMessage.set('Alex AI Bot completed the speed challenge!');
        } else {
          botStep();
        }
      }, delayMs);
    };

    botStep();
  }

  private stopSpeedQuizEngine(): void {
    if (this.speedTimerInterval) {
      clearInterval(this.speedTimerInterval);
      this.speedTimerInterval = null;
    }
    if (this.botInterval) {
      clearTimeout(this.botInterval);
      this.botInterval = null;
    }
  }

  private finishSpeedMatch(): void {
    if (this.isVsMatchFinished()) return;

    this.stopSpeedQuizEngine();
    this.timer.stop();

    const userTotalScore = this.quizStatsService.totalScore();
    const botTotal = this.botScore();

    let bonusCoins = 0;
    let winner: 'user' | 'bot' | 'tie' = 'user';

    if (userTotalScore > botTotal) {
      winner = 'user';
      bonusCoins = 25; // Victory bonus!
    } else if (userTotalScore === botTotal) {
      winner = 'tie';
      bonusCoins = 10;
    } else {
      winner = 'bot';
      bonusCoins = 0;
    }

    this.vsMatchWinner.set(winner);
    this.bonusCoinsEarned.set(bonusCoins);

    // Save coins & stats in background WITHOUT setting isQuizFinished to true
    this.saveStatsInBackground();

    // Set VS scoreboard active
    this.isVsMatchFinished.set(true);
    this.isFinishing.set(false);
  }

  showDetailedSummaryFromVs(): void {
    this.isVsMatchFinished.set(false);
    this.isQuizFinished.set(true);
  }

  private startQuestion(index: number): void {
    const question = this.quizes()[index];
    this.currentQuiz.set(question);
    this.currentQuizIndex.set(index);
    this.quizStatsService.startAttempt(question);
    this.selectedAnswer.set('');
    this.isSubmited.set(false);
    this.hintIndex.set(-1);
    this.timer.restart();
  }
  // endregion

  // region Event Handlers
  onCategoryChange(): void {
    const category = this.selectedCategory();
    if (category) {
      const categoryData = this.allCategories().find((c) => c.category === category);
      this.subCategories.set(categoryData ? categoryData.subCategories : []);
      this.selectedSubCategories.set(null); // Reset sub-category selection
    } else {
      this.subCategories.set([]);
      this.selectedSubCategories.set(null);
    }
  }

  // Handles both "Next" and "Skip"
  onNextClick(): void {
    if (this.currentQuizIndex() + 1 < this.quizesCount()) {
      // If not submitted, it's a skip
      if (!this.isSubmited()) {
        this.quizStatsService.skipAttempt(this.currentQuiz()!, this.timer.elapsedSeconds);
        this.currentStreak.set(0); // Reset streak on skip
      }
      this.startQuestion(this.currentQuizIndex() + 1);
    } else {
      if (this.isFinishing()) {
        return;
      }

      // Last question was answered/skipped, finish the quiz
      if (!this.isSubmited()) {
        this.quizStatsService.skipAttempt(this.currentQuiz()!, this.timer.elapsedSeconds);
        this.currentStreak.set(0);
      }
      this.isFinishing.set(true);
      this.timer.stop();

      if (this.quizMode() === 'speed_bot') {
        this.finishSpeedMatch();
      } else {
        if (this.authService.isAuthenticated()) {
          this.updateStats();
        } else {
          this.isQuizFinished.set(true);
          this.isFinishing.set(false);
        }
      }
    }
  }

  onSubmitClick(): void {
    if (!this.selectedAnswer()?.trim()?.length) {
      return;
    }
    this.isSubmited.set(true);
    const quiz = this.currentQuiz();
    const selected = this.selectedAnswer();

    if (quiz && selected) {
      let isCorrect = false;
      let score = 0;
      let coinsEarned = 0;

      const correctAnswerValue = quiz.answer;
      if (correctAnswerValue === selected) {
        this.numberOfCorrectAns++;
        isCorrect = true;

        // Streak Multiplier Calculation
        this.currentStreak.update((s) => s + 1);
        if (this.currentStreak() > this.maxStreak()) {
          this.maxStreak.set(this.currentStreak());
        }

        const mult = this.streakMultiplier();
        score = Math.round(5 * mult);
        coinsEarned = Math.round(5 * mult);
      } else {
        // Reset streak on incorrect answer
        this.currentStreak.set(0);
      }

      this.quizStatsService.endAttempt({
        question: quiz,
        timeTaken: this.timer.elapsedSeconds,
        selectedAnswer: selected,
        isCorrect,
        score,
        coinsEarned,
      });
    }

    this.timer.stop();
  }

  onCloseSummary(): void {
    // Reset the entire quiz state to go back to the selection screen.
    this.stopSpeedQuizEngine();
    this.quizes.set([]);
    this.quizesCount.set(0);
    this.currentQuiz.set(null);
    this.currentQuizIndex.set(0);
    this.hintIndex.set(-1);
    this.isSubmited.set(false);
    this.selectedAnswer.set('');
    this.numberOfCorrectAns = 0;
    this.isQuizFinished.set(false);
    this.isFinishing.set(false);
    this.isVsMatchFinished.set(false);
    this.currentStreak.set(0);
    this.maxStreak.set(0);
    this.quizStatsService.reset();
  }

  onRestartQuiz(): void {
    this.stopSpeedQuizEngine();
    this.quizStatsService.reset();
    this.isQuizFinished.set(false);
    this.isVsMatchFinished.set(false);
    this.numberOfCorrectAns = 0;
    this.currentStreak.set(0);
    this.maxStreak.set(0);
    this.startQuestion(0);
    if (this.quizMode() === 'speed_bot') {
      this.startSpeedQuizEngine();
    }
  }

  onHintClick(): void {
    const hintCost = 2;
    if (this.coins() >= hintCost) {
      const currentQuizHints = this.currentQuiz()?.hints;
      if (currentQuizHints) {
        if (this.hintIndex() + 1 < currentQuizHints.length) {
          this.quizStatsService.recordHintUsage(this.currentQuiz()!, hintCost);
          const newTotal = this.coins() - hintCost;
          this.authService.updateCoins(newTotal);
          this.hintIndex.update((hintIndex) => hintIndex + 1);
        }
      }
    } else {
      this.messanger.add({
        severity: 'info',
        summary: 'Hints',
        detail: "You don't have enough coins to use hint",
        life: 5000,
      });
    }
  }

  showReportDialog(): void {
    this.reportIssueService.showDialog({
      title: 'Report an Issue with this Question',
      issueTypes: ['Question', 'Options', 'Explanation', 'Answer', 'Other'],
      reportData: {
        questionId: this.currentQuiz()!.id,
        description: '',
      },
    });
  }
  // endregion

  private readonly gamificationService = inject(GamificationService);

  // region Private Helpers
  private saveStatsInBackground(): void {
    this.gamificationService.recordActivity('quiz');
    const coinsEarned = this.quizStatsService.totalCoinsEarned() + this.bonusCoinsEarned();
    const newTotalCoins = this.authService.userCoins() + coinsEarned;
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.userService
        .updateUser(userId, { coins: newTotalCoins, totalQuizAttempted: this.userAttempsCount() + 1 })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.authService.updateCoins(newTotalCoins);
            this.isFinishing.set(false);
          },
          error: () => {
            this.isFinishing.set(false);
          }
        });
    } else {
      this.isFinishing.set(false);
    }
    this.quizStatsService.createQuestionStats();
    this.quizStatsService.updateQuizStats();
  }

  private updateStats(): void {
    this.gamificationService.recordActivity('quiz');
    // update coins before close
    const coinsEarned = this.quizStatsService.totalCoinsEarned() + this.bonusCoinsEarned();
    const newTotalCoins = this.authService.userCoins() + coinsEarned;
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.userService
        .updateUser(userId, { coins: newTotalCoins, totalQuizAttempted: this.userAttempsCount() + 1 })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.authService.updateCoins(newTotalCoins);
            this.isQuizFinished.set(true);
            this.isFinishing.set(false);
          },
          error: () => {
            this.isQuizFinished.set(true);
            this.isFinishing.set(false);
          }
        });
    } else {
      this.isQuizFinished.set(true);
      this.isFinishing.set(false);
    }
    // update stats
    this.quizStatsService.createQuestionStats();
    this.quizStatsService.updateQuizStats();
  }
}
