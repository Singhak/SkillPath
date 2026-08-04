import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
  // region Service Injections
  questionApiService = inject(QuestionApiService);
  messanger = inject(MessageService);
  quizStatsService = inject(QuizStatsService);
  categoryApiService = inject(CatrgoryApiService);
  userService = inject(UserApiService);
  authService = inject(AuthService);
  private readonly reportIssueService = inject(ReportIssueService);
  private readonly route = inject(ActivatedRoute);
  timer = inject(Timer);

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

  // region Component State
  // Quiz selection state
  allCategories = signal<Category[]>([]);
  selectedCategory = signal<string | null>(null);
  selectedSubCategories = signal<string[] | null>(null);

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
    this.quizStatsService.reset();
  }

  // region Data Loading and Setup
  private loadInitialData(): void {
    this.categoryApiService.getCategory().subscribe((categories) => {
      this.allCategories.set(categories);
      this.route.queryParams.subscribe(params => {
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
      this.questionApiService
        .getQuestions({ category, subCategory: subCategories, questionCount: this.questionCount() })
        .subscribe((quize) => {
          this.quizStatsService.quizId.set(quize.quizId);
          this.quizes.set(quize?.questions ?? []);
          this.quizesCount.set(quize?.questions.length ?? 0);
          if (quize?.questions.length > 0) {
            this.startQuestion(0);
          }
        });
    }
  }

  private startQuestion(index: number) {
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
  onNextClick() {
    if (this.currentQuizIndex() + 1 < this.quizesCount()) {
      // If not submitted, it's a skip
      if (!this.isSubmited()) {
        this.quizStatsService.skipAttempt(this.currentQuiz()!, this.timer.elapsedSeconds);
      }
      this.startQuestion(this.currentQuizIndex() + 1);
    } else {
      if (this.isFinishing()) return;

      // Last question was answered/skipped, finish the quiz
      if (!this.isSubmited()) {
        this.quizStatsService.skipAttempt(this.currentQuiz()!, this.timer.elapsedSeconds);
      }
      this.isFinishing.set(true);
      this.timer.stop();
      if (this.authService.isAuthenticated()) {
        // to show summary of quiz to guest users
        this.updateStats();
      } else {
        this.isQuizFinished.set(true);
        this.isFinishing.set(false);
      }
    }
  }

  onSubmitClick() {
    console.log(this.selectedAnswer());
    if (!this.selectedAnswer()?.trim()?.length) return;
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
        score = 5;
        coinsEarned = 5;
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

  onCloseSummary() {
    // Reset the entire quiz state to go back to the selection screen.
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
    this.quizStatsService.reset();
  }

  onRestartQuiz() {
    this.quizStatsService.reset();
    this.isQuizFinished.set(false);
    this.numberOfCorrectAns = 0;
    this.startQuestion(0);
  }

  onHintClick() {
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

  showReportDialog() {
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
  private updateStats() {
    this.gamificationService.recordActivity('quiz');
    //update coins before close
    const coinsEarned = this.quizStatsService.correctAnswerCount() * 5; // we are not deduting the hint use coins since those already deduted
    const newTotalCoins = this.authService.userCoins() + coinsEarned;
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.userService
        .updateUser(userId, { coins: newTotalCoins, totalQuizAttempted: this.userAttempsCount() + 1 })
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
    //update stats
    this.quizStatsService.createQuestionStats();
    this.quizStatsService.updateQuizStats();
  }
}
