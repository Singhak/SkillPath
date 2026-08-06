import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserResourceService } from '../../core/services/user-resource.service';
import { PaymentService } from '../../core/services/payment.service';
import { Router } from '@angular/router';
import { BillingHistoryModalComponent } from '../../shared/components/billing-history-modal/billing-history-modal.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, BillingHistoryModalComponent],
  template: `
    <div class="min-h-screen bg-gray-950 text-white py-20 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      
      <!-- Background Effects -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      <div class="text-center mb-10 relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Choose Your Journey
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Unlock the full potential of AI with our flexible pricing plans. Whether you're just starting out or scaling up, we have a plan for you.
        </p>

        <!-- Currency Switcher Toggle & History Button -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <div class="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-inner">
            <button 
              (click)="setCurrency('INR')" 
              [class]="selectedCurrency === 'INR' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white'"
              class="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2">
              <span>🇮🇳</span> INR (₹)
            </button>
            <button 
              (click)="setCurrency('USD')" 
              [class]="selectedCurrency === 'USD' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:text-white'"
              class="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2">
              <span>🌐</span> USD ($)
            </button>
          </div>

          <button 
            (click)="isBillingModalOpen = true"
            class="px-5 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-cyan-400 text-sm font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Billing & Credit History
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 w-full px-4">
        
        <!-- Silver (Free) Plan -->
        <div class="group relative rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded-t-3xl opacity-50"></div>
          
          <h3 class="text-2xl font-bold text-gray-200 mb-2">Silver</h3>
          <p class="text-gray-400 text-sm mb-6 h-10">Perfect to get started and explore basic learning capabilities.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">Free</span>
          </div>

          @if (isCurrentPlan('Silver')) {
            <button disabled class="w-full py-3 px-6 rounded-full font-semibold bg-white/10 text-emerald-400 border border-emerald-500/30 mb-8 cursor-not-allowed opacity-90 flex items-center justify-center gap-2">
              <i class="pi pi-check-circle text-emerald-400"></i> Current Active Plan
            </button>
          } @else {
            <button (click)="getStarted()" class="w-full py-3 px-6 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 mb-8 cursor-pointer">
              Get Started
            </button>
          }

          <div class="space-y-4">
            <p class="font-semibold text-gray-300 uppercase tracking-wider text-xs mb-4">What's included</p>
            <ul class="space-y-3">
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-green-400 mt-1 mr-3 text-lg"></i>
                <span>Daily 5 AI Credits</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-green-400 mt-1 mr-3 text-lg"></i>
                <span>Basic Activity Logging</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-green-400 mt-1 mr-3 text-lg"></i>
                <span>Basic Skill Mastery View</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-green-400 mt-1 mr-3 text-lg"></i>
                <span>Standard Resume Parsing Cost</span>
              </li>
              <li class="flex items-start text-gray-500 line-through">
                <i class="pi pi-times-circle mt-1 mr-3 text-lg"></i>
                <span>AI Answer, STAR & Voice Evaluations</span>
              </li>
              <li class="flex items-start text-gray-500 line-through">
                <i class="pi pi-times-circle mt-1 mr-3 text-lg"></i>
                <span>Performance Trends & Charts</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copper Plan -->
        <div class="group relative rounded-3xl backdrop-blur-xl bg-white/5 border border-amber-500/30 p-8 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] mt-4 md:mt-0">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-t-3xl opacity-75"></div>
          
          <h3 class="text-2xl font-bold text-orange-400 mb-2">Copper</h3>
          <p class="text-gray-400 text-sm mb-6 h-10">Enhanced features, AI evaluations & analytics for active learners.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">{{ selectedCurrency === 'USD' ? '$0.99' : '₹20' }}</span>
            <span class="text-gray-400">/mo</span>
          </div>

          @if (isCurrentPlan('Copper')) {
            <button disabled class="w-full py-3 px-6 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-8 cursor-not-allowed opacity-90 flex items-center justify-center gap-2">
              <i class="pi pi-check-circle text-amber-400"></i> Current Active Plan
            </button>
          } @else if (isCurrentPlan('Gold')) {
            <button disabled class="w-full py-3 px-6 rounded-full font-semibold bg-white/5 text-gray-400 border border-white/10 mb-8 cursor-not-allowed opacity-60 flex items-center justify-center gap-2">
              Included in Gold Plan
            </button>
          } @else {
            <button (click)="subscribePlan('Copper')" class="w-full py-3 px-6 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 transition-opacity mb-8 shadow-lg shadow-orange-500/20 cursor-pointer">
              Subscribe Now
            </button>
          }

          <div class="space-y-4">
            <p class="font-semibold text-gray-300 uppercase tracking-wider text-xs mb-4">Everything in Silver, plus:</p>
            <ul class="space-y-3">
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Daily 5 AI Credits</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>10 One-time Bonus AI Credits</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>25% Free AI Credit Rollover</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Better Coin Conversion (50 = 1)</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>AI Answer, STAR & Voice Evaluations</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Resume Parsing Discount (1 Credit Off)</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Performance Trends & Analytics</span>
              </li>
              <li class="flex items-start text-gray-500 line-through">
                <i class="pi pi-times-circle mt-1 mr-3 text-lg"></i>
                <span>Spaced Repetition & Interview Studio</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Gold Plan -->
        <div class="group relative rounded-3xl backdrop-blur-xl bg-gradient-to-b from-blue-900/40 to-white/5 border border-blue-400/50 p-8 transform md:-translate-y-4 shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.25)] transition-all duration-300 z-20">
          
          <!-- Popular Badge -->
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
            Most Popular
          </div>
          
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-t-3xl"></div>
          
          <h3 class="text-2xl font-bold text-blue-300 mb-2">Gold</h3>
          <p class="text-gray-300 text-sm mb-6 h-10">The ultimate experience with Interviewer Studio, Review Decks & Skill Gap Insights.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">{{ selectedCurrency === 'USD' ? '$2.99' : '₹50' }}</span>
            <span class="text-gray-400">/mo</span>
          </div>

          @if (isCurrentPlan('Gold')) {
            <button disabled class="w-full py-3 px-6 rounded-full font-bold bg-blue-500/20 text-blue-200 border border-blue-400/50 mb-8 cursor-not-allowed opacity-90 flex items-center justify-center gap-2">
              <i class="pi pi-check-circle text-blue-400"></i> Current Active Plan {{ isTrialActive ? '(Free Trial)' : '' }}
            </button>
          } @else {
            @if (!hasUsedTrial && !isTrialActive) {
              <button (click)="startTrial()" class="w-full py-3 px-6 rounded-full font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 transition-colors mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer">
                Start 14-Day Free Trial
              </button>
            }

            <button (click)="subscribePlan('Gold')" class="w-full py-3 px-6 rounded-full font-bold bg-white text-blue-900 hover:bg-gray-100 transition-colors mb-8 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer">
              Go Gold
            </button>
          }

          <div class="space-y-4">
            <p class="font-semibold text-blue-200 uppercase tracking-wider text-xs mb-4">Everything in Copper, plus:</p>
            <ul class="space-y-3">
              <li class="flex items-start text-white">
                <i class="pi pi-star-fill text-yellow-400 mt-1 mr-3 text-lg"></i>
                <span class="font-medium">Take Interview Session (Interviewer Studio)</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Daily 5 AI Credits</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>20 One-time Bonus AI Credits</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>50% Free AI Credit Rollover (Maximum)</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Best Coin Conversion (30 = 1)</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Max Resume Parsing Discount (2 Credits Off)</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Spaced Repetition Review Deck</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Skill Gap Analysis & Target Role Insights</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>PDF Evaluation & Detailed Candidate Reports</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <!-- Buy AI Credits Section -->
      <div class="max-w-5xl mx-auto w-full mt-24 relative z-10 px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">Buy AI Credits</h2>
          <p class="text-gray-400">Need more power right now? Top up your AI credits instantly.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1 Credit -->
          <div class="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center hover:bg-white/10 transition-colors">
             <div class="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
               <span class="text-2xl font-bold text-blue-400">1</span>
             </div>
             <h4 class="text-xl font-semibold text-white mb-2">1 AI Credit</h4>
             <div class="text-3xl font-bold text-white mb-4">{{ selectedCurrency === 'USD' ? '$0.25' : '₹5' }}</div>
             <button (click)="buyCredits(selectedCurrency === 'USD' ? 0.25 : 5, 1)" class="w-full py-2 rounded-full font-medium bg-white/10 hover:bg-blue-600 transition-colors">Buy Now</button>
          </div>
          
          <!-- 3 Credits -->
          <div class="rounded-2xl bg-white/5 border border-purple-500/30 p-6 flex flex-col items-center relative overflow-hidden hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.15)]">
             <div class="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">33% OFF</div>
             <div class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
               <span class="text-2xl font-bold text-purple-400">3</span>
             </div>
             <h4 class="text-xl font-semibold text-white mb-2">3 AI Credits</h4>
             <div class="text-3xl font-bold text-white mb-1">{{ selectedCurrency === 'USD' ? '$0.50' : '₹10' }}</div>
             <div class="text-sm text-purple-300 line-through mb-4">{{ selectedCurrency === 'USD' ? '$0.75' : '₹15' }}</div>
             <button (click)="buyCredits(selectedCurrency === 'USD' ? 0.50 : 10, 3)" class="w-full py-2 rounded-full font-medium bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/25">Buy Now</button>
          </div>
          
          <!-- 10 Credits -->
          <div class="rounded-2xl bg-white/5 border border-cyan-500/30 p-6 flex flex-col items-center relative overflow-hidden hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.15)]">
             <div class="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">50% OFF</div>
             <div class="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
               <span class="text-2xl font-bold text-cyan-400">10</span>
             </div>
             <h4 class="text-xl font-semibold text-white mb-2">10 AI Credits</h4>
             <div class="text-3xl font-bold text-white mb-1">{{ selectedCurrency === 'USD' ? '$1.00' : '₹25' }}</div>
             <div class="text-sm text-cyan-300 line-through mb-4">{{ selectedCurrency === 'USD' ? '$2.50' : '₹50' }}</div>
             <button (click)="buyCredits(selectedCurrency === 'USD' ? 1.00 : 25, 10)" class="w-full py-2 rounded-full font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/25">Buy Now</button>
          </div>
        </div>

        <!-- AI Credit Usage Rates Breakdown Matrix -->
        <div class="mt-12 p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
          <div class="text-center mb-6">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2 uppercase tracking-wider">
              ⚡ Fee Schedule
            </span>
            <h3 class="text-2xl font-bold text-white">AI Credit Charge Matrix</h3>
            <p class="text-gray-400 text-sm mt-1">Simple transparent per-action credit deductions across all AI services</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">🎯</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">Question Generation</div>
                  <div class="text-xs text-gray-400">Mock AI Interview</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 0.20 / Q
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-purple-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">✍️</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">Answer Evaluation</div>
                  <div class="text-xs text-gray-400">STAR & AI Feedback</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 0.25 / Ans
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-blue-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">📄</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">AI PDF Report</div>
                  <div class="text-xs text-gray-400">Candidate Evaluation Export</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 1.00 / Report
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-emerald-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">🔍</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">Job Profile Analysis</div>
                  <div class="text-xs text-gray-400">Interview Studio & JD Match</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 2.00 / Job
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">🎤</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">Speech Analytics</div>
                  <div class="text-xs text-gray-400">Fluency & Tone Feedback</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 1.00 / Session
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-rose-500/30 transition-all">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">🤖</div>
                <div>
                  <div class="font-semibold text-sm text-gray-200">Resume Parsing</div>
                  <div class="text-xs text-gray-400">ATS Skills Extraction</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ 2 - 5 / File
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Comparison Table -->
      <div class="max-w-5xl mx-auto w-full mt-24 relative z-10 px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-4">Compare Features</h2>
          <p class="text-gray-400">A detailed breakdown of everything included in our plans.</p>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-white/10 backdrop-blur-md bg-white/5">
          <table class="w-full text-left text-sm text-gray-400">
            <thead class="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th scope="col" class="px-6 py-4">Features</th>
                <th scope="col" class="px-6 py-4 text-center">Silver (Free)</th>
                <th scope="col" class="px-6 py-4 text-center text-orange-400">Copper ({{ selectedCurrency === 'USD' ? '$0.99' : '₹20' }}/mo)</th>
                <th scope="col" class="px-6 py-4 text-center text-blue-400">Gold ({{ selectedCurrency === 'USD' ? '$2.99' : '₹50' }}/mo)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Daily AI Credits</th>
                <td class="px-6 py-4 text-center">5 Daily Credits</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">5 Daily Credits</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">5 Daily Credits</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">One-Time Subscription Bonus</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">+10 Credits (One-Time)</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">+20 Credits (One-Time)</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Credit Rollover</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">25% Rollover</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">50% Rollover (Max)</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Coin to AI Credit Conversion</th>
                <td class="px-6 py-4 text-center">100 Coins = 1 Credit</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">50 Coins = 1 Credit</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">30 Coins = 1 Credit</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors bg-orange-500/10">
                <th scope="row" class="px-6 py-4 font-medium text-amber-300">Job Profile & AI Evaluations (STAR, Voice & Answer)</th>
                <td class="px-6 py-4 text-center text-gray-400 font-medium">Requires Copper or Gold</td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Resume Parsing Discount</th>
                <td class="px-6 py-4 text-center">Standard Cost</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">1 Credit Off</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">2 Credits Off</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Performance Trends & Charts</th>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Skill Gap Analysis & Target Role Insights</th>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Spaced Repetition Review Deck</th>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Take Interview Session (Interviewer Studio)</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">PDF & Detailed Candidate Reports</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400"><i class="pi pi-check text-green-400"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <app-billing-history-modal [isOpen]="isBillingModalOpen" (close)="isBillingModalOpen = false" />
    </div>
  `
})
export class PricingComponent {
  authService = inject(AuthService);
  userResourceService = inject(UserResourceService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  selectedCurrency: 'INR' | 'USD' = 'INR';
  isBillingModalOpen = false;

  setCurrency(currency: 'INR' | 'USD') {
    this.selectedCurrency = currency;
  }

  get isTrialActive(): boolean {
    return this.authService.currentUser()?.isTrialActive || false;
  }

  get hasUsedTrial(): boolean {
    return this.authService.currentUser()?.hasUsedTrial || false;
  }

  startTrial() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.hasUsedTrial) {
      alert("You have already used your free trial.");
      return;
    }

    this.userResourceService.startFreeTrial().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        alert("14-Day Free Trial started successfully!");
        this.authService.updateUserProfile({
          plan: res.plan,
          isTrialActive: res.isTrialActive,
          trialExpiryDate: res.trialExpiryDate,
          hasUsedTrial: true
        });
      },
      error: (err) => {
        alert(err.error?.message || "Error starting trial");
      }
    });
  }

  getStarted() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  get currentPlan(): 'Silver' | 'Copper' | 'Gold' {
    return (this.authService.currentPlan() || 'Silver') as 'Silver' | 'Copper' | 'Gold';
  }

  isCurrentPlan(plan: 'Silver' | 'Copper' | 'Gold'): boolean {
    return this.currentPlan.toLowerCase() === plan.toLowerCase();
  }

  subscribePlan(plan: 'Copper' | 'Gold') {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isCurrentPlan(plan)) {
      alert(`You are already subscribed to the ${plan} Plan.`);
      return;
    }

    if (this.isCurrentPlan('Gold') && plan === 'Copper') {
      alert(`You already have active Gold membership which includes all Copper features.`);
      return;
    }

    const isUsd = this.selectedCurrency === 'USD';
    let amount = 0;
    let credits = 0;

    if (plan === 'Copper') {
      amount = isUsd ? 0.99 : 20;
      credits = 10;
    } else if (plan === 'Gold') {
      amount = isUsd ? 2.99 : 50;
      credits = 20;
    }

    this.paymentService.initiatePayment(amount, credits, this.selectedCurrency, plan);
  }

  buyCredits(amount: number, credits: number) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.paymentService.initiatePayment(amount, credits, this.selectedCurrency);
  }
}
