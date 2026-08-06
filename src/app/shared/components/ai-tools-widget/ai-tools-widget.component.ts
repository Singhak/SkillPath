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
          <!-- Input Mode Switcher: Upload File vs Paste Raw Text -->
          <div class="flex items-center space-x-2 mb-4 bg-slate-800/60 p-1 rounded-xl w-fit border border-slate-700/60">
            <button
              (click)="resumeInputMode.set('upload')"
              [class.bg-indigo-600]="resumeInputMode() === 'upload'"
              [class.text-white]="resumeInputMode() === 'upload'"
              [class.text-slate-400]="resumeInputMode() !== 'upload'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <span>📁 Upload File (PDF/DOCX/TXT)</span>
            </button>

            <button
              (click)="resumeInputMode.set('paste')"
              [class.bg-indigo-600]="resumeInputMode() === 'paste'"
              [class.text-white]="resumeInputMode() === 'paste'"
              [class.text-slate-400]="resumeInputMode() !== 'paste'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <span>✍️ Paste Resume Text</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Input Area: File Dropzone or Raw Textarea -->
            @if (resumeInputMode() === 'upload') {
              <div
                [class.pointer-events-none]="resumeService.isParsing()"
                [class.opacity-60]="resumeService.isParsing()"
                class="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-slate-850/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer relative group min-h-[260px]"
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  [disabled]="resumeService.isParsing()"
                  (change)="onFileSelected($event)"
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed disabled:pointer-events-none"
                />
                <div class="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  @if (resumeService.isParsing()) {
                    <span class="inline-block animate-spin text-2xl">⏳</span>
                  } @else {
                    <span>📄</span>
                  }
                </div>
                <h4 class="font-bold text-white text-base mb-1">Upload Full Resume (PDF, DOCX, TXT)</h4>
                <div class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold mb-2">
                  <span>⚡ Size-Based Cost: 2 - 5 AI Credits</span>
                </div>
                <p class="text-xs text-slate-400 mb-4 max-w-xs">Full text is extracted client-side (PDF.js / XML) and sent to AI for deep ATS analysis.</p>

                <button
                  [disabled]="resumeService.isParsing()"
                  class="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs pointer-events-none shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (resumeService.isParsing()) {
                    <span class="inline-block animate-spin text-sm">🔄</span>
                    <span>AI Parsing in Progress...</span>
                  } @else {
                    <span>Choose File</span>
                  }
                </button>
              </div>
            } @else {
              <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[260px]">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-bold text-slate-300">Paste Full Resume Text:</label>
                    <span class="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      ⚡ Est. Cost: {{ resumeService.calculateEstimatedCredits(pastedText, authService.currentPlan()) }} Credits
                    </span>
                  </div>
                  <textarea
                    [(ngModel)]="pastedText"
                    [disabled]="resumeService.isParsing()"
                    rows="8"
                    placeholder="Paste the complete contents of your resume here (experience, skills, contact info, projects)..."
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono resize-none disabled:opacity-50"
                  ></textarea>
                </div>
                <button
                  (click)="parsePastedResumeText()"
                  [disabled]="resumeService.isParsing() || !pastedText.trim()"
                  class="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  @if (resumeService.isParsing()) {
                    <span class="inline-block animate-spin text-sm">🔄</span>
                    <span>AI Parsing in Progress...</span>
                  } @else {
                    <span>🤖 Parse Resume Content ({{ resumeService.calculateEstimatedCredits(pastedText, authService.currentPlan()) }} Credits)</span>
                  }
                </button>
              </div>
            }

            <!-- Parsed Results & ATS Score Card -->
            <div class="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Extracted Profile & ATS Score</span>
                @if (resumeService.parsedResume()) {
                  <span class="text-emerald-400 font-semibold flex items-center space-x-1.5 text-xs">
                    @if (resumeService.parsedResume()?.creditsDeducted) {
                      <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full text-[10px]">
                        ⚡ {{ resumeService.parsedResume()?.creditsDeducted }} Credits Charged
                      </span>
                    }
                    <span>✓ {{ resumeService.parsedResume()?.parsedBy === 'AI' ? 'AI Deep Analysis' : 'Pattern Parsed' }}</span>
                  </span>
                }
              </div>

              @if (resumeService.parsedResume(); as res) {
                <div class="space-y-4 animate-fadeIn">
                  <!-- Name & ATS Rating Badge -->
                  <div class="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
                    <div>
                      <div class="font-bold text-white text-sm">{{ res.candidateName || res.fileName }}</div>
                      <div class="text-xs text-slate-400">{{ res.experienceLevel || 'Candidate' }} • {{ res.experienceYears }}+ Years Experience</div>
                    </div>
                    @if (res.atsScore !== undefined) {
                      <div class="text-right">
                        <div class="text-xl font-extrabold" [ngClass]="{
                          'text-emerald-400': res.atsScore >= 80,
                          'text-amber-400': res.atsScore >= 60 && res.atsScore < 80,
                          'text-rose-400': res.atsScore < 60
                        }">
                          {{ res.atsScore }}<span class="text-xs text-slate-400 font-normal">/100</span>
                        </div>
                        <div class="text-[10px] uppercase font-bold text-slate-400">ATS Rating</div>
                      </div>
                    }
                  </div>

                  <!-- ATS Category Breakdown Bars -->
                  @if (res.atsBreakdown) {
                    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Formatting</span>
                          <span class="font-bold text-white">{{ res.atsBreakdown.formatting }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="res.atsBreakdown.formatting"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Impact</span>
                          <span class="font-bold text-white">{{ res.atsBreakdown.impact }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-purple-500 rounded-full" [style.width.%]="res.atsBreakdown.impact"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Skill Match</span>
                          <span class="font-bold text-white">{{ res.atsBreakdown.skillsRelevance }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="res.atsBreakdown.skillsRelevance"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Completeness</span>
                          <span class="font-bold text-white">{{ res.atsBreakdown.completeness }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div class="h-full bg-sky-500 rounded-full" [style.width.%]="res.atsBreakdown.completeness"></div>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- Extracted Skills -->
                  <div>
                    <span class="text-xs text-slate-400 block mb-1.5">Extracted Skills:</span>
                    <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      @for (s of res.extractedSkills; track s) {
                        <span class="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs font-semibold">
                          ⚡ {{ s }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Suggested Profiles -->
                  <div>
                    <span class="text-xs text-slate-400 block mb-1.5">Suggested Roles:</span>
                    <div class="flex flex-wrap gap-1.5">
                      @for (role of res.suggestedRoles; track role) {
                        <span class="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-semibold">
                          🎯 {{ role }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- ATS Feedback Tips -->
                  @if (res.atsFeedback && res.atsFeedback.length > 0) {
                    <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs">
                      <div class="font-bold text-amber-300 mb-1 flex items-center space-x-1">
                        <span>💡 ATS Improvement Recommendations:</span>
                      </div>
                      <ul class="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                        @for (tip of res.atsFeedback; track tip) {
                          <li>{{ tip }}</li>
                        }
                      </ul>
                    </div>
                  }

                </div>
              } @else {
                <div class="py-4 space-y-4 animate-fadeIn text-left">
                  <div class="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5">
                    <div class="font-bold text-indigo-300 text-xs mb-1 flex items-center space-x-1.5">
                      <span>🚀</span> <span>Why Parse Your Resume with SkillPath AI?</span>
                    </div>
                    <p class="text-[11px] text-slate-300 leading-relaxed">
                      Transform your raw resume into a personalized career launcher with automated profile sync and ATS optimization.
                    </p>
                  </div>

                  <div class="grid grid-cols-1 gap-2.5 text-xs">
                    <div class="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                        ⚡
                      </div>
                      <div>
                        <div class="font-bold text-white text-xs mb-0.5">1. Auto-Populate Skill Profile</div>
                        <div class="text-[11px] text-slate-400">Instantly extracts technical skills, tools, and experience level—saving you manual data entry.</div>
                      </div>
                    </div>

                    <div class="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                        📊
                      </div>
                      <div>
                        <div class="font-bold text-white text-xs mb-0.5">2. Enterprise ATS Rating (0-100)</div>
                        <div class="text-[11px] text-slate-400">Evaluates formatting, keyword density, and actionable recommendations to pass HR screening.</div>
                      </div>
                    </div>

                    <div class="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-start space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                        🎯
                      </div>
                      <div>
                        <div class="font-bold text-white text-xs mb-0.5">3. Tailored AI Mock Interviews</div>
                        <div class="text-[11px] text-slate-400">Generates custom interview questions based on suggested target roles for your actual background.</div>
                      </div>
                    </div>
                  </div>

                  <div class="text-center pt-2">
                    <span class="text-[11px] text-slate-400 font-medium">
                      👈 Select a PDF/DOCX file or paste text on the left to analyze now
                    </span>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      }

      <!-- TAB 2: Speech & Tone Analytics -->
      @if (activeTab() === 'speech') {
        <div class="animate-fadeIn space-y-4">

          <!-- Dual Mode Evaluation Selector -->
          <div class="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-white block">Evaluation Engine Mode</span>
              <span class="text-[11px] text-slate-400">Choose between instant rule engine or AI</span>
            </div>

            <div class="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                (click)="speechEvaluationMode.set('instant')"
                [class.bg-indigo-600]="speechEvaluationMode() === 'instant'"
                [class.text-white]="speechEvaluationMode() === 'instant'"
                [class.text-slate-400]="speechEvaluationMode() !== 'instant'"
                class="px-2.5 py-1.5 rounded-md font-semibold transition-all"
              >
                ⚡ Fast (Free)
              </button>
              <button
                (click)="selectSpeechAiMode()"
                class="relative px-2.5 py-1.5 rounded-md font-semibold transition-all flex items-center space-x-1"
                [class.bg-indigo-600]="speechEvaluationMode() === 'ai_groq'"
                [class.text-white]="speechEvaluationMode() === 'ai_groq'"
                [class.text-slate-400]="speechEvaluationMode() !== 'ai_groq'"
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

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Voice Tester Box -->
            <div class="lg:col-span-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-white text-sm mb-1">Voice & Tone Analyzer</h4>
                <p class="text-xs text-slate-400 mb-4">Measures speaking pace (WPM), detects filler words, and rates tone clarity.</p>

                <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[100px] mb-4 text-xs font-mono text-slate-300">
                  @if (speechService.isRecording()) {
                    <div class="space-y-1.5 mb-2 pb-2 border-b border-slate-800">
                      <div class="flex flex-wrap items-center justify-between gap-1 text-rose-400 text-[11px] font-bold">
                        <span class="animate-pulse flex items-center space-x-1"><span>🔴</span> <span>Live Audio Stream</span></span>
                        <span class="text-amber-400 font-mono text-[10px]">Silence: {{ speechService.liveSilenceSeconds() }}s | Pauses: {{ speechService.livePauseCount() }} | Fillers: {{ speechService.liveVocalFillerCount() }}</span>
                      </div>
                      <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex items-center">
                        <div 
                          class="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
                          [style.width.%]="speechService.liveVolumeLevel()"
                        ></div>
                      </div>
                    </div>
                  }
                  <p>{{ speechService.liveTranscript() || 'Click "Start Speech Test" and speak an interview response...' }}</p>
                </div>
              </div>

              <div class="space-y-2">
                @if (!speechService.isRecording()) {
                  <button
                    (click)="startSpeechRecording()"
                    class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                  >
                    <span>🎙️</span> <span>Start Speech Test</span>
                  </button>
                } @else {
                  <button
                    (click)="stopSpeechRecording()"
                    class="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <span>⏹ Stop & Analyze Speech ({{ speechEvaluationMode() === 'ai_groq' ? 'AI - 1 Credit' : 'Instant - Free' }})</span>
                  </button>
                }
              </div>
            </div>

            <!-- Analytics Output Cards -->
            <div class="lg:col-span-2">
              @if (speechService.speechMetrics(); as m) {
                <div class="space-y-4 animate-fadeIn">
                  <!-- Score Cards Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Speaking Speed</div>
                      <div class="text-xl font-black text-indigo-400 mt-1">{{ m.wpm }} <span class="text-xs font-normal">WPM</span></div>
                      <div class="text-[10px] text-slate-400">Net: {{ m.netWpm || m.wpm }} WPM</div>
                    </div>

                    <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Filler Sounds</div>
                      <div class="text-xl font-black text-rose-400 mt-1">{{ m.fillerWordsCount }}</div>
                      <div class="text-[10px] text-slate-400">Um / Uh / Like</div>
                    </div>

                    <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Pauses & Silence</div>
                      <div class="text-xl font-black text-amber-400 mt-1">{{ m.pausesCount || 0 }} <span class="text-xs font-normal">pauses</span></div>
                      <div class="text-[10px] text-slate-400">{{ m.silenceSeconds || 0 }}s silent ({{ m.silencePercentage || 0 }}%)</div>
                    </div>

                    <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      <div class="text-[11px] text-slate-400">Tone Confidence</div>
                      <div class="text-xl font-black text-emerald-400 mt-1">{{ m.confidenceScore }}%</div>
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
export class AiToolsWidgetComponent implements OnInit {
  readonly speechService = inject(SpeechAnalyticsService);
  readonly resumeService = inject(ResumeParserService);
  readonly starCoachService = inject(StarCoachService);
  readonly userResourceService = inject(UserResourceService);
  public readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService, { optional: true });
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.resumeService.parsedResume()) {
      this.resumeService.loadSavedResume();
    }
  }

  readonly activeTab = signal<'resume' | 'speech' | 'star'>('resume');
  readonly resumeInputMode = signal<'upload' | 'paste'>('upload');
  pastedText = '';
  readonly evaluationMode = signal<'instant' | 'ai_groq'>('instant');

  readonly behavioralQuestion = signal<string>('Describe a complex technical problem you solved under pressure.');
  readonly answerInput = signal<string>('When working on an enterprise Angular project, we faced severe bundle budget bloat. My task was to optimize the initial page load time. I implemented lazy loading for routes, optimized RxJS observables, and enabled esbuild tree-shaking. As a result, initial load dropped by 45%.');

  async onFileSelected(event: Event): Promise<void> {
    if (this.resumeService.isParsing()) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const res = await this.resumeService.parseResumeFile(input.files[0]);
      if (res && res.creditsDeducted) {
        this.userResourceService.decrementAiCredits(res.creditsDeducted).subscribe({ error: () => {} });
      }
    }
  }

  async parsePastedResumeText(): Promise<void> {
    if (this.resumeService.isParsing() || !this.pastedText || !this.pastedText.trim()) return;
    const res = await this.resumeService.parseRawText(this.pastedText.trim());
    if (res && res.creditsDeducted) {
      this.userResourceService.decrementAiCredits(res.creditsDeducted).subscribe({ error: () => {} });
    }
  }

  readonly speechEvaluationMode = signal<'instant' | 'ai_groq'>('instant');

  selectSpeechAiMode(): void {
    if (this.authService.currentPlan() === 'Silver') {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: 'AI Speech Analysis requires at least the Copper plan. Would you like to upgrade your plan?',
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
