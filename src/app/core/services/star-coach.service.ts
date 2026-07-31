import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { GroqService } from './groq.service';
import { UserResourceService } from './user-resource.service';
import { environment } from '../../environments/environment';

export interface StarEvaluationResult {
  overallScore: number;
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  situationFeedback: string;
  taskFeedback: string;
  actionFeedback: string;
  resultFeedback: string;
  improvedAnswerSuggestion: string;
  evaluationMode: 'instant' | 'ai_groq';
}

@Injectable({
  providedIn: 'root',
})
export class StarCoachService {
  private readonly http = inject(HttpClient);
  private readonly groqService = inject(GroqService);
  private readonly userResourceService = inject(UserResourceService);
  private readonly apiUrl = `${environment.apiUrl}/ai-evaluations/star`;

  readonly latestEvaluation = signal<StarEvaluationResult | null>(null);
  readonly isEvaluatingWithAi = signal<boolean>(false);

  /**
   * Alias method for backward compatibility
   */
  evaluateBehavioralAnswer(question: string, answerText: string): StarEvaluationResult {
    return this.evaluateInstant(question, answerText);
  }

  /**
   * Fast Instant Logic Evaluation (Free, 0 Credits)
   */
  evaluateInstant(question: string, answerText: string): StarEvaluationResult {
    const text = answerText.toLowerCase();

    const hasSituation = text.includes('when') || text.includes('project') || text.includes('team') || text.includes('company') || text.includes('faced');
    const hasTask = text.includes('goal') || text.includes('task') || text.includes('needed') || text.includes('responsible') || text.includes('objective');
    const hasAction = text.includes('i implemented') || text.includes('i built') || text.includes('i created') || text.includes('i decided') || text.includes('action') || text.includes('solved');
    const hasResult = text.includes('result') || text.includes('percent') || text.includes('%') || text.includes('improved') || text.includes('delivered') || text.includes('outcome');

    const situationScore = hasSituation ? 90 : 55;
    const taskScore = hasTask ? 88 : 60;
    const actionScore = hasAction ? 92 : 65;
    const resultScore = hasResult ? 95 : 50;

    const overallScore = Math.round((situationScore + taskScore + actionScore + resultScore) / 4);

    const result: StarEvaluationResult = {
      overallScore,
      situationScore,
      taskScore,
      actionScore,
      resultScore,
      situationFeedback: hasSituation
        ? 'Well-defined context and environment setup.'
        : 'Briefly state the background context, company scale, or specific problem scenario.',
      taskFeedback: hasTask
        ? 'Clear description of your specific responsibility.'
        : 'Explicitly define what your exact goal or objective was in that situation.',
      actionFeedback: hasAction
        ? 'Excellent focus on your direct individual actions and engineering decisions.'
        : 'Use "I" statements to highlight what YOU specifically built or executed.',
      resultFeedback: hasResult
        ? 'Outstanding quantitative outcome and metric impact provided!'
        : 'Add measurable results (e.g. "improved load time by 40%", "delivered 2 weeks ahead of schedule").',
      improvedAnswerSuggestion: `Structure your answer with: 1) Situation: "In my previous role at...", 2) Task: "My goal was to...", 3) Action: "I designed and implemented...", 4) Result: "This achieved a 35% performance boost."`,
      evaluationMode: 'instant',
    };

    this.latestEvaluation.set(result);
    return result;
  }

  /**
   * Deep AI STAR Evaluation via Backend API (Deducts 1 AI Credit)
   */
  evaluateWithGroqAi(question: string, answerText: string): Observable<StarEvaluationResult> {
    this.isEvaluatingWithAi.set(true);

    // Deduct 1 AI credit from user balance
    this.userResourceService.decrementAiCredits(1).subscribe({ error: () => { } });

    return this.http.post<any>(this.apiUrl, { question, answer: answerText }).pipe(
      map((res) => {
        const result: StarEvaluationResult = {
          overallScore: res.overallScore || 85,
          situationScore: res.situationScore || 85,
          taskScore: res.taskScore || 80,
          actionScore: res.actionScore || 90,
          resultScore: res.resultScore || 75,
          situationFeedback: 'Context and situation clarity evaluated by AI.',
          taskFeedback: 'Task responsibility structure assessed.',
          actionFeedback: res.starFeedback || 'Action items and execution detail clear.',
          resultFeedback: 'Quantitative outcome and result metrics evaluated.',
          improvedAnswerSuggestion: res.improvedAnswer || 'Focus on highlighting quantified production metrics.',
          evaluationMode: 'ai_groq',
        };

        this.latestEvaluation.set(result);
        this.isEvaluatingWithAi.set(false);
        return result;
      }),
      catchError(() => {
        const fallback = this.evaluateInstant(question, answerText);
        this.isEvaluatingWithAi.set(false);
        return of(fallback);
      })
    );
  }
}
