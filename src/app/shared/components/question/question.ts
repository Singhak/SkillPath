import { Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { FieldsetModule } from 'primeng/fieldset';
import { Question } from './question.model';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, ButtonModule, RadioButton, FormsModule, Highlight, FieldsetModule],
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
    if (quiz && quiz.options) {
      const options = [...quiz.options];
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

  selectOption(option: string): void {
    if (!this.showExplanation()) {
      this.selectedAnswer.set(option);
    }
  }

  getOptionContainerClass(option: string): string {
    const isSubmitted = !!this.showExplanation();
    const isSelected = this.selectedAnswer() === option;
    const isCorrect = this.quiz()?.answer === option;

    if (isSubmitted) {
      if (isCorrect) {
        return 'option-card option-card--correct border-2 border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium shadow-sm';
      }
      if (isSelected && !isCorrect) {
        return 'option-card option-card--wrong border-2 border-red-500 bg-red-50/90 text-red-950 font-medium shadow-sm';
      }
      return 'option-card border border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
    }

    if (isSelected) {
      return 'option-card option-card--selected font-medium shadow-sm cursor-pointer';
    }

    return 'option-card border border-slate-200 cursor-pointer';
  }
}
