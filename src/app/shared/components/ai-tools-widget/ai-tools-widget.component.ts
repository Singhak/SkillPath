import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeechAnalyticsService } from '../../../core/services/speech-analytics.service';
import { ResumeParserService } from '../../../core/services/resume-parser.service';
import { StarCoachService } from '../../../core/services/star-coach.service';
import { UserResourceService } from '../../../core/services/user-resource.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-tools-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-tools-widget.component.html',
})
export class AiToolsWidgetComponent implements OnInit {
  readonly speechService = inject(SpeechAnalyticsService);
  readonly resumeService = inject(ResumeParserService);
  readonly starCoachService = inject(StarCoachService);
  readonly userResourceService = inject(UserResourceService);
  public readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly copiedAnswer = signal<boolean>(false);
  readonly starOutputTab = signal<'pillars' | 'analysis' | 'suggestion'>('pillars');
  readonly resumeOutputTab = signal<'metrics' | 'skills' | 'tips'>('metrics');

  copyImprovedAnswer(text: string): void {
    if (!text) {
      return;
    }
    navigator.clipboard.writeText(text);
    this.copiedAnswer.set(true);
    setTimeout(() => this.copiedAnswer.set(false), 2500);
  }

  ngOnInit(): void {
    if (!this.resumeService.parsedResume()) {
      this.resumeService.loadSavedResume();
    }
  }

  readonly activeTab = signal<'resume' | 'speech' | 'star'>('resume');
  readonly resumeInputMode = signal<'upload' | 'paste'>('upload');
  pastedText = '';
  readonly evaluationMode = signal<'instant' | 'ai_groq'>('instant');

  readonly behavioralQuestion = signal<string>(
    'Describe a complex technical problem you solved under pressure.',
  );
  readonly answerInput = signal<string>(
    'When working on an enterprise Angular project, we faced severe bundle budget bloat. My task was to optimize the initial page load time. I implemented lazy loading for routes, optimized RxJS observables, and enabled esbuild tree-shaking. As a result, initial load dropped by 45%.',
  );

  async onFileSelected(event: Event): Promise<void> {
    if (this.resumeService.isParsing()) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      try {
        const res = await this.resumeService.parseResumeFile(input.files[0]);
        if (res && res.creditsDeducted) {
          this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
        }
      } catch (err: any) {
        console.error('Resume parse error:', err);
      }
    }
  }

  async parsePastedResumeText(): Promise<void> {
    if (this.resumeService.isParsing() || !this.pastedText || !this.pastedText.trim()) {
      return;
    }
    try {
      const res = await this.resumeService.parseRawText(this.pastedText.trim());
      if (res && res.creditsDeducted) {
        this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
      }
    } catch (err: any) {
      console.error('Resume parse text error:', err);
    }
  }

  readonly speechEvaluationMode = signal<'instant' | 'ai_groq'>('instant');

  selectSpeechAiMode(): void {
    if (this.authService.currentPlan() === 'Silver') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message:
            'AI Speech Analysis requires at least the Copper plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          },
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }
    this.speechEvaluationMode.set('ai_groq');
  }

  startSpeechRecording(): void {
    if (this.speechEvaluationMode() === 'ai_groq' && this.authService.currentPlan() === 'Silver') {
      this.selectSpeechAiMode();
      return;
    }
    this.speechService.startRecording();
  }

  stopSpeechRecording(): void {
    const useAi = this.speechEvaluationMode() === 'ai_groq';
    if (useAi && this.authService.currentPlan() === 'Silver') {
      this.selectSpeechAiMode();
      return;
    }
    this.speechService.stopRecording(useAi);
  }

  selectGroqAiMode(): void {
    if (this.authService.currentPlan() === 'Silver') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message:
            'AI Evaluation requires at least the Copper plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          },
        });
      } else {
        this.router.navigate(['/pricing']);
      }
      return;
    }
    this.evaluationMode.set('ai_groq');
  }

  evaluateStarResponse(): void {
    if (this.evaluationMode() === 'ai_groq') {
      if (this.authService.currentPlan() === 'Silver') {
        this.selectGroqAiMode();
        return;
      }

      this.starCoachService
        .evaluateWithGroqAi(this.behavioralQuestion(), this.answerInput())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    } else {
      this.starCoachService.evaluateInstant(this.behavioralQuestion(), this.answerInput());
    }
  }
}
