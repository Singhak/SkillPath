import { Component, computed, input, model, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RadioButton } from 'primeng/radiobutton'
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
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  answer: string;
  code?: string;
  language: string;
  hists?: string[];
  concept?: string;
  explanation?: string;
}
