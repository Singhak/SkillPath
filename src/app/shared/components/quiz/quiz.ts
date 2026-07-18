import { Component, computed, input, model, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-quiz',
  imports: [ButtonModule, RadioButton, FormsModule, Highlight, FieldsetModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  index = input.required<number>();
  hintIndex = input.required<number>();
  quiz = input.required<Question | null>();
  selectedAnswer = model<string>();
  showExplanation = input<boolean>();
  options = computed<string[]>(() => {
    const quiz = this.quiz();
    if (quiz) {
      const options = [quiz.option1, quiz.option2, quiz.option3, quiz.option4];
      // Fisher-Yates shuffle to randomize options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return options;
    }
    return [];
  });

  // async autoFormater(rawCode?: string) {
  //   if (rawCode?.length)
  //     return await prettier.format(rawCode, {
  //       parser: 'typescript',
  //       plugins: [parserTypeScript],
  //       singleQuote: true,
  //       semi: true
  //     });
  //   return ''
  // }

  async ngOnInit() {
    // this.formattedCode = await this.autoFormater(this.quiz().code);
  }

  hints = computed<string[]>(() => {
    const currentQuiz = this.quiz();
    const hintIdx = this.hintIndex();
    if (currentQuiz && currentQuiz.hists && hintIdx >= 0) {
      // Return a slice of the hints array up to and including the current hintIndex
      return currentQuiz.hists.slice(0, hintIdx + 1);
    }
    return [];
  });
}

export interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  language: string;
  hists?: string[];
  concept?: string;
  explanation?: string;
  category: string;
  subCategory: string;
  codeSnippet?: string;
}
