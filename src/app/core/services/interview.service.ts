import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InterviewSession } from './interview-session';
import { AIQuestion } from './question';
import { GroqService } from './groq.service';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private groqService = inject(GroqService);

  readonly session = signal<InterviewSession | null>(null);

  readonly currentQuestion = computed(() => {
    const s = this.session();
    if (!s || s.currentQuestionIndex >= s.questions.length) {
      return null;
    }
    return s.questions[s.currentQuestionIndex];
  });

  readonly isInterviewFinished = computed(() => {
    const s = this.session();
    return s ? s.currentQuestionIndex >= s.questions.length : false;
  });

  startInterview(topic: string): Observable<AIQuestion[]> {
    return this.groqService.getInterviewQuestions(topic).pipe(
      tap(questions => {
        this.session.set({
          topic,
          questions,
          history: [],
          currentQuestionIndex: 0
        });
      })
    );
  }

  submitAnswer(answer: string): Observable<string> {
    const currentQ = this.currentQuestion();
    if (!currentQ) {
      throw new Error('No active question to submit an answer for.');
    }

    return this.groqService.evaluateAnswer(currentQ.text, answer).pipe(
      tap(feedback => {
        this.session.update(s => s ? { ...s, history: [...s.history, { question: currentQ, answer, feedback }] } : null)
      })
    );
  }

  nextQuestion() {
    this.session.update(s => s ? { ...s, currentQuestionIndex: s.currentQuestionIndex + 1 } : null);
  }

  endInterview() {
    this.session.set(null);
  }
}