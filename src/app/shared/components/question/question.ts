import { Component, computed, input, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { FieldsetModule } from 'primeng/fieldset';
import { Question } from './question.model';

@Component({
  selector: 'app-quiz',
  imports: [ButtonModule, RadioButton, FormsModule, Highlight, FieldsetModule],
  templateUrl: './question.html',
  styleUrl: './question.css',
})
export class QuestionComponent {
  index = input.required<number>();
  hintIndex = input.required<number>();
  quiz = input.required<Question | null>();
  selectedAnswer = model<string>();
  showExplanation = input<boolean>();
  options = computed<string[]>(() => {
    const quiz = this.quiz();
    if (quiz) {
      const options = quiz.options;
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return options;
    }
    return [];
  });

  hints = computed<string[]>(() => {
    const currentQuiz = this.quiz();
    const hintIdx = this.hintIndex();
    if (currentQuiz && currentQuiz.hints && hintIdx >= 0) {
      // Return a slice of the hints array up to and including the current hintIndex
      return currentQuiz.hints.slice(0, hintIdx + 1);
    }
    return [];
  });
}
