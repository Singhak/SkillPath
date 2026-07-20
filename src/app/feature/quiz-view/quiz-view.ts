import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { QuizService } from '../service/quiz-service';
import { MessageService } from 'primeng/api';
import { QuizStatsService } from '../service/quiz-stats.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Timer } from '../../shared/services/timer';
import { QuizSummaryComponent } from '../service/quiz-summary';
import { CatrgoryService } from '../service/category.service';
import { Category } from '../../core/models/category.model';
import { FormsModule } from '@angular/forms';
import { Question } from '../../shared/components/question/question.model';
import { QuestionComponent } from '../../shared/components/question/question';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { ReportIssueService } from '../../core/services/report-issue.service';
import { ReportIssueComponent } from '../../shared/components/report-issue/report-issue.component';

@Component({
  selector: 'app-quiz-view',
  imports: [
    QuestionComponent,
    TagModule,
    ButtonModule,
    CardModule,
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
  //Services
  quizService = inject(QuizService);
  messanger = inject(MessageService);
  quizStatsService = inject(QuizStatsService);
  categoryService = inject(CatrgoryService);
  userService = inject(UserService);
  authService = inject(AuthService);
  reportIssueService = inject(ReportIssueService);
  timer = inject(Timer);

  constructor() {
    effect(() => {
      if (this.reportIssueService.displayDialog()) {
        this.timer.stop();
      } else {
        this.timer.start();
      }
    });
  }

  //Variables
  quizes = signal<Question[]>([]);
  quizesCount = signal<number>(0);
  currentQuiz = signal<Question | null>(null);
  currentQuizIndex = signal<number>(0);
  hintIndex = signal<number>(-1);
  isSubmited = signal<boolean>(false);
  selectedAnswer = signal<string>('');
  numberOfCorrectAns = 0;
  isQuizFinished = signal(false);
  isFinishing = signal(false);

  // Category and Sub-category selection
  allCategories = signal<Category[]>([]);
  categories = computed(() => this.allCategories().map((c) => c.category));
  subCategories = signal<string[]>([]);
  selectedCategory = signal<string | null>(null);
  selectedSubCategories = signal<string[] | null>(null);

  coins = this.authService.userCoins;

  // Report Issue
  availableHints = computed(() => {
    const hints = this.currentQuiz()?.hints ?? [];
    const usedHints = this.hintIndex() + 1;
    return hints.length - usedHints;
  });

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe((categories) => {
      this.allCategories.set(categories);
    });
  }

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

  fetchQuiz(): void {
    const category = this.selectedCategory();
    const subCategories = this.selectedSubCategories();
    if (category) {
      this.quizService.getQuestions({ category, subCategory: subCategories }).subscribe((quize) => {
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

      //update coins before close
      const coinsEarned = this.quizStatsService.correctAnswerCount() * 5; // we are not deduting the hint use coins since those already deduted
      const newTotalCoins = this.authService.userCoins() + coinsEarned;
      this.userService.updateUser({ coins: newTotalCoins }).subscribe(() => {
        this.authService.updateCoins(newTotalCoins);
        this.isQuizFinished.set(true);
        this.isFinishing.set(false);
      });
    }
  }

  onSkipClick() {
    this.onNextClick();
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

  onRestartQuiz() {
    this.quizStatsService.reset();
    this.isQuizFinished.set(false);
    this.numberOfCorrectAns = 0;
    this.startQuestion(0);
  }

  onCloseSummary() {
    this.quizStatsService.updateQuizStats();
    this.quizStatsService.createQuestionStats();
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

  ngOnDestroy(): void {
    this.timer.destroy();
    this.quizStatsService.reset();
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
}
