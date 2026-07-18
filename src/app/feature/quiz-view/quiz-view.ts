import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Question, Quiz } from '../../shared/components/quiz/quiz';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { QuizService } from '../service/quiz-service';
import { MessageService } from 'primeng/api';
import { QuizStatsService } from '../service/quiz-stats.service';
import { Timer } from '../../shared/services/timer';
import { QuizSummaryComponent } from '../service/quiz-summary';

@Component({
  selector: 'app-quiz-view',
  imports: [Quiz, TagModule, ButtonModule, CardModule, QuizSummaryComponent],
  templateUrl: './quiz-view.html',
  styleUrl: './quiz-view.css',
  providers: [Timer],
})
export class QuizView implements OnInit, OnDestroy {
  //Services
  quizService = inject(QuizService);
  messanger = inject(MessageService);
  quizStatsService = inject(QuizStatsService);
  timer = inject(Timer);

  //Variables
  quizes = signal<Question[]>([]);
  quizesCount = signal<number>(0);
  currentQuiz = signal<Question | null>(null);
  currentQuizIndex = signal<number>(0);
  coins = signal(20);
  hintIndex = signal<number>(-1);
  isSubmited = signal<boolean>(false);
  selectedAnswer = signal<string>('');
  numberOfCorrectAns = 0;
  isQuizFinished = signal(false);

  ngOnInit(): void {
    this.quizService.getQuestions({}).subscribe((quizes) => {
      this.quizes.set(quizes);
      this.quizesCount.set(quizes.length);
      this.startQuestion(0);
    });
  }

  private startQuestion(index: number) {
    const quiz = this.quizes()[index];
    this.currentQuiz.set(quiz);
    this.currentQuizIndex.set(index);
    this.quizStatsService.startAttempt(quiz);
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
      // Last question was answered/skipped, finish the quiz
      if (!this.isSubmited()) {
        this.quizStatsService.skipAttempt(this.currentQuiz()!, this.timer.elapsedSeconds);
      }
      this.timer.stop();
      this.isQuizFinished.set(true);
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
      const correctAnswerValue = quiz[quiz.answer as keyof Question];
      if (correctAnswerValue === selected) {
        this.numberOfCorrectAns++;
        isCorrect = true;
      }
      this.quizStatsService.endAttempt(quiz, this.timer.elapsedSeconds, selected, isCorrect);
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
    this.isQuizFinished.set(false);
  }

  onHintClick() {
    if (this.coins() >= 20) {
      this.coins.update((coins) => coins - 2);
      const currentQuizHists = this.currentQuiz()?.hists;
      if (currentQuizHists) {
        if (this.hintIndex() + 1 < currentQuizHists.length) {
          this.quizStatsService.recordHintUsage(this.currentQuiz()!);
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
}
