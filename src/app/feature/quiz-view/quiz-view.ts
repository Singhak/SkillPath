import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Question, Quiz } from '../../shared/components/quiz/quiz';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { QuizService } from '../service/quiz-service';
import { MessageService } from 'primeng/api';
import { Timer } from '../../shared/services/timer';
import { ChartService } from '../../shared/services/chart';

@Component({
  selector: 'app-quiz-view',
  imports: [Quiz, TagModule, ButtonModule, CardModule],
  templateUrl: './quiz-view.html',
  styleUrl: './quiz-view.css',
  providers: [Timer]
})
export class QuizView implements OnInit, OnDestroy {

//Services
  chartService = inject(ChartService);
  quizService = inject(QuizService);
  messanger = inject(MessageService)
  timer = inject(Timer);

//Variables
  quizes = signal<Question[]>([])
  quizesCount = signal<number>(0);
  currentQuiz = signal<Question | null>(null);
  currentQuizIndex = signal<number>(0);
  coins = signal(20);
  hintIndex = signal<number>(-1);
  isSubmited = signal<boolean>(false);
  selectedAnswer = signal<string>('');
  numberOfCorrectAns = 0;

  ngOnInit(): void {
    this.quizService.getQuizes().then(quizes => {
      this.quizes.set(quizes);
      this.currentQuiz.set(quizes[0]);
      this.quizesCount.set(quizes.length);
      this.timer.start();
      console.log(quizes);
      
    })
  }

  onNextClick() {
    if (this.currentQuizIndex() + 1 < this.quizesCount()) {
      this.currentQuizIndex.set(this.currentQuizIndex() + 1);
      this.currentQuiz.set(this.quizes()[this.currentQuizIndex()]);
      this.selectedAnswer.set('');
      this.isSubmited.set(false);
      this.hintIndex.set(-1);
      this.timer.start();

    }

  }

  onSubmitClick() {
    console.log(this.selectedAnswer());
    if(!this.selectedAnswer()?.trim()?.length) return;
    this.isSubmited.set(true);
    if (this.currentQuiz()?.answer === this.selectedAnswer()) {
      this.numberOfCorrectAns++;
    }
    this.timer.reset()
  }

  onHintClick() {
    if (this.coins() >= 20) {
      this.coins.update(coins => coins - 2);
      const currentQuizHists = this.currentQuiz()?.hists;
      if (currentQuizHists) {
        if (this.hintIndex() + 1 < currentQuizHists.length) {
          this.hintIndex.update(hintIndex => hintIndex + 1);
        }
      }
    } else {
      this.messanger.add({ severity: 'info', summary: 'Hints', detail: "You don't have enough coins to use hint", life: 5000 })
    }
  }

  ngOnDestroy(): void {
    this.timer.destroy();
  }

}
