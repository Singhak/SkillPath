import { Component, inject, signal, DestroyRef } from '@angular/core';
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
  template: `
    <div class="ai-tools-widget bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 text-white">

      <!-- Header & Tab Switcher -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <span>🤖</span> <span>Next-Gen AI Practice Lab</span>
          </div>
          <h2 class="text-xl font-bold text-white">Advanced AI Tools & Interview Enhancements</h2>
          <p class="text-xs text-slate-400">Resume skill parsing, speech tone analytics, and STAR method behavioral evaluation.</p>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex space-x-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          <button
            (click)="activeTab.set('resume')"
            [class.bg-indigo-600]="activeTab() === 'resume'"
            [class.text-white]="activeTab() === 'resume'"
            [class.text-slate-400]="activeTab() !== 'resume'"
            class="px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>📄</span> <span>Resume Parser</span>
          </button>

          <button
            (click)="activeTab.set('speech')"
            [class.bg-indigo-600]="activeTab() === 'speech'"
            [class.text-white]="activeTab() === 'speech'"
            [class.text-slate-400]="activeTab() !== 'speech'"
            class="px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>🎙️</span> <span>Speech Analytics</span>
          </button>

          <button
            (click)="activeTab.set('star')"
            [class.bg-indigo-600]="activeTab() === 'star'"
            [class.text-white]="activeTab() === 'star'"
            [class.text-slate-400]="activeTab() !== 'star'"
            class="px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>⭐️</span> <span>STAR Coach</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: AI Resume Parser -->
      @if (activeTab() === 'resume') {
        <div class="animate-fadeIn">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Upload Dropzone -->
            <div class="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-slate-850/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer relative group">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                (change)="onFileSelected($event)"
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div class="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h4 class="font-bold text-white text-base mb-1">Upload Resume (PDF, DOCX, TXT)</h4>
              <p class="text-xs text-slate-400 mb-4">AI will automatically parse skills, experience, and update your skill ratings.</p>

              <button class="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs pointer-events-none shadow-md">
                {{ resumeService.isParsing() ? 'Parsing Resume with AI...' : 'Select File' }}
              </button>
            </div>

            <!-- Parsed Results Output -->
            <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Extracted Skill Profile</span>
                @if (resumeService.parsedResume()) {
                  <span class="text-emerald-400 font-semibold">✓ Auto-Synced to Profile</span>
                }
              </div>

              @if (resumeService.parsedResume(); as res) {
                <div class="space-y-4 animate-fadeIn">
                  <div>
                    <span class="text-xs text-slate-400">File Name:</span>
                    <div class="font-bold text-white text-sm">{{ res.fileName }} ({{ res.experienceYears }}+ Years Experience)</div>
                  </div>

                  <div>
                    <span class="text-xs text-slate-400 block mb-2">Extracted Key Skills:</span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (s of res.extractedSkills; track s) {
                        <span
                          class="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs font-semibold"
                        >
                          ⚡ {{ s }}
                        </span>
                      }
                    </div>
                  </div>

                  <div>
                    <span class="text-xs text-slate-400 block mb-2">Suggested Job Profiles:</span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (role of res.suggestedRoles; track role) {
                        <span
                          class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-semibold"
                        >
                          🎯 {{ role }}
                        </span>
                      }
                    </div>
                  </div>
                </div>
              } @else {
                <div class="py-12 text-center text-slate-500 text-xs">
                  Upload a resume file on the left to extract detected skills & target roles.
                </div>
              }

            </div>
          </div>
        </div>
      }

      <!-- TAB 2: Speech & Tone Analytics -->
      @if (activeTab() === 'speech') {
        <div class="animate-fadeIn">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Voice Tester Box -->
            <div class="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-white text-sm mb-1">Voice & Tone Analyzer</h4>
                <p class="text-xs text-slate-400 mb-4">Measures speaking pace (WPM), detects filler words, and rates tone clarity.</p>

                <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[100px] mb-4 text-xs font-mono text-slate-300">
                  @if (speechService.isRecording()) {
                    <span class="text-rose-400 animate-pulse font-bold block mb-1">🔴 Recording live audio...</span>
                  }
                  <p>{{ speechService.liveTranscript() || 'Click "Start Speech Test" and speak an interview response...' }}</p>
                </div>
              </div>

              <div class="space-y-2">
                @if (!speechService.isRecording()) {
                  <button
                    (click)="speechService.startRecording()"
                    class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                  >
                    <span>🎙️</span> <span>Start Speech Test</span>
                  </button>
                } @else {
                  <button
                    (click)="speechService.stopRecording()"
                    class="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <span>⏹ Stop & Analyze Speech</span>
                  </button>
                }
              </div>
            </div>

            <!-- Analytics Output Cards -->
            <div class="lg:col-span-2">
              @if (speechService.speechMetrics(); as m) {
                <div class="space-y-4 animate-fadeIn">
                  <!-- Score Cards Grid -->
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Speaking Speed</div>
                      <div class="text-2xl font-black text-indigo-400 mt-1">{{ m.wpm }} <span class="text-xs font-normal">WPM</span></div>
                      <div class="text-[10px] text-slate-400">Optimal: 130-160</div>
                    </div>

                    <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Filler Words</div>
                      <div class="text-2xl font-black text-rose-400 mt-1">{{ m.fillerWordsCount }}</div>
                      <div class="text-[10px] text-slate-400">Um / Like / Basically</div>
                    </div>

                    <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Tone Confidence</div>
                      <div class="text-2xl font-black text-emerald-400 mt-1">{{ m.confidenceScore }}%</div>
                      <div class="text-[10px] text-slate-400">Clarity: {{ m.clarityScore }}%</div>
                    </div>
                  </div>

                  <!-- AI Feedback Banner -->
                  <div class="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl text-xs text-indigo-200">
                    <strong class="text-white block mb-1">💬 Speech Coach Feedback:</strong>
                    {{ m.feedback }}
                  </div>
                </div>
              } @else {
                <div class="bg-slate-800/20 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  Start the speech test to calculate WPM, filler word count, and tone confidence score.
                </div>
              }

            </div>
          </div>
        </div>
      }

      <!-- TAB 3: STAR Method Coach with Dual Mode Toggle -->
      @if (activeTab() === 'star') {
        <div class="animate-fadeIn">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Question & Response Form -->
            <div class="space-y-4">

              <!-- Dual Mode Evaluation Selector -->
              <div class="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-white block">Evaluation Engine Mode</span>
                  <span class="text-[11px] text-slate-400">Choose between instant rule engine or AI</span>
                </div>

                <div class="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    (click)="evaluationMode.set('instant')"
                    [class.bg-indigo-600]="evaluationMode() === 'instant'"
                    [class.text-white]="evaluationMode() === 'instant'"
                    [class.text-slate-400]="evaluationMode() !== 'instant'"
                    class="px-2.5 py-1.5 rounded-md font-semibold transition-all"
                  >
                    ⚡ Fast (Free)
                  </button>
                  <button
                    (click)="selectGroqAiMode()"
                    class="relative px-2.5 py-1.5 rounded-md font-semibold transition-all flex items-center space-x-1"
                    [class.bg-indigo-600]="evaluationMode() === 'ai_groq'"
                    [class.text-white]="evaluationMode() === 'ai_groq'"
                    [class.text-slate-400]="evaluationMode() !== 'ai_groq'"
                  >
                    @if (authService.currentPlan() === 'Silver') {
                      <span class="absolute -top-2 -right-2 bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center border border-white text-[8px]">
                        <i class="pi pi-lock"></i>
                      </span>
                    }
                    <span>🤖 AI</span>
                    <span class="text-[10px] px-1 bg-amber-500/30 text-amber-300 rounded font-bold">1 Cr</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-300 block mb-1">Behavioral Question:</label>
                <input
                  type="text"
                  [value]="behavioralQuestion()"
                  (input)="behavioralQuestion.set($any($event.target).value)"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-300 block mb-1">Your Answer Response:</label>
                <textarea
                  rows="4"
                  [value]="answerInput()"
                  (input)="answerInput.set($any($event.target).value)"
                  placeholder="Describe a situation where you faced a major technical challenge, what your goal was, what action you took, and the final result..."
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                (click)="evaluateStarResponse()"
                [disabled]="starCoachService.isEvaluatingWithAi()"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                @if (!starCoachService.isEvaluatingWithAi()) {
                  <span>⭐️ Grade Response ({{ evaluationMode() === 'ai_groq' ? 'AI - 1 Credit' : 'Instant - Free' }})</span>
                } @else {
                  <span class="animate-pulse">🤖 Evaluating with AI...</span>
                }
              </button>
            </div>

            <!-- STAR Evaluation Output -->
            <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>STAR Breakdown Score</span>
                @if (starCoachService.latestEvaluation(); as eval) {
                  <span class="text-slate-400 font-normal">
                    Engine: <strong class="text-indigo-300">{{ eval.evaluationMode === 'ai_groq' ? '🤖 AI' : '⚡ Instant Logic' }}</strong>
                  </span>
                }
              </div>

              @if (starCoachService.latestEvaluation(); as eval) {
                <div class="space-y-3 animate-fadeIn">
                  <div class="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 mb-2">
                    <span class="text-xs font-bold text-white">Overall STAR Structure Score</span>
                    <span class="text-xl font-black text-amber-400">{{ eval.overallScore }}%</span>
                  </div>

                  <!-- STAR Pillars -->
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
                      <div class="flex justify-between font-bold text-slate-200"><span>S - Situation</span><span class="text-indigo-400">{{ eval.situationScore }}%</span></div>
                      <p class="text-[11px] text-slate-400 mt-1">{{ eval.situationFeedback }}</p>
                    </div>
                    <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
                      <div class="flex justify-between font-bold text-slate-200"><span>T - Task</span><span class="text-indigo-400">{{ eval.taskScore }}%</span></div>
                      <p class="text-[11px] text-slate-400 mt-1">{{ eval.taskFeedback }}</p>
                    </div>
                    <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
                      <div class="flex justify-between font-bold text-slate-200"><span>A - Action</span><span class="text-indigo-400">{{ eval.actionScore }}%</span></div>
                      <p class="text-[11px] text-slate-400 mt-1">{{ eval.actionFeedback }}</p>
                    </div>
                    <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50">
                      <div class="flex justify-between font-bold text-slate-200"><span>R - Result</span><span class="text-indigo-400">{{ eval.resultScore }}%</span></div>
                      <p class="text-[11px] text-slate-400 mt-1">{{ eval.resultFeedback }}</p>
                    </div>
                  </div>

                  <!-- Suggestion box -->
                  <div class="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl text-[11px] text-purple-200 mt-2">
                    <strong class="text-white block mb-1">💡 Improvement Advice:</strong>
                    {{ eval.improvedAnswerSuggestion }}
                  </div>
                </div>
              } @else {
                <div class="py-12 text-center text-slate-500 text-xs">
                  Type your answer response on the left and click "Grade Response".
                </div>
              }
            </div>

          </div>
        </div>
      }

    </div>
  `,
})
export class AiToolsWidgetComponent {
  readonly speechService = inject(SpeechAnalyticsService);
  readonly resumeService = inject(ResumeParserService);
  readonly starCoachService = inject(StarCoachService);
  readonly userResourceService = inject(UserResourceService);
  public readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeTab = signal<'resume' | 'speech' | 'star'>('resume');
  readonly evaluationMode = signal<'instant' | 'ai_groq'>('instant');

  readonly behavioralQuestion = signal<string>('Describe a complex technical problem you solved under pressure.');
  readonly answerInput = signal<string>('When working on an enterprise Angular project, we faced severe bundle budget bloat. My task was to optimize the initial page load time. I implemented lazy loading for routes, optimized RxJS observables, and enabled esbuild tree-shaking. As a result, initial load dropped by 45%.');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.resumeService.parseResumeFile(input.files[0]);
    }
  }

  selectGroqAiMode(): void {
    if (this.authService.currentPlan() === 'Silver') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: 'AI Evaluation requires at least the Copper plan. Would you like to upgrade your plan?',
          header: 'Upgrade Required',
          icon: 'pi pi-lock',
          acceptLabel: 'View Plans',
          rejectLabel: 'Cancel',
          accept: () => {
            this.router.navigate(['/pricing']);
          }
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

      this.starCoachService.evaluateWithGroqAi(
        this.behavioralQuestion(),
        this.answerInput(),
      ).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    } else {
      this.starCoachService.evaluateInstant(
        this.behavioralQuestion(),
        this.answerInput(),
      );
    }
  }
}
