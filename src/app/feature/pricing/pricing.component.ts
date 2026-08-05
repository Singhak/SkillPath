import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserResourceService } from '../../core/services/user-resource.service';
import { PaymentService } from '../../core/services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-950 text-white py-20 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      
      <!-- Background Effects -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

      <div class="text-center mb-16 relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Choose Your Journey
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Unlock the full potential of AI with our flexible pricing plans. Whether you're just starting out or scaling up, we have a plan for you.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 w-full px-4">
        
        <!-- Silver (Free) Plan -->
        <div class="group relative rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-500 rounded-t-3xl opacity-50"></div>
          
          <h3 class="text-2xl font-bold text-gray-200 mb-2">Silver</h3>
          <p class="text-gray-400 text-sm mb-6 h-10">Perfect to get started and explore AI capabilities.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">Free</span>
          </div>

          <button class="w-full py-3 px-6 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 mb-8">
            Get Started
          </button>

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
          <p class="text-gray-400 text-sm mb-6 h-10">Enhanced features for regular users needing more power.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">₹20</span>
            <span class="text-gray-400">/mo</span>
          </div>

          <button class="w-full py-3 px-6 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 transition-opacity mb-8 shadow-lg shadow-orange-500/20">
            Subscribe Now
          </button>

          <div class="space-y-4">
            <p class="font-semibold text-gray-300 uppercase tracking-wider text-xs mb-4">Everything in Silver, plus:</p>
            <ul class="space-y-3">
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>5 Additional AI Credits</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Better Coin Conversion (50 = 1)</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Rollover 25% of free AI credit</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Performance Trends Chart</span>
              </li>
              <li class="flex items-start text-gray-300">
                <i class="pi pi-check-circle text-orange-400 mt-1 mr-3 text-lg"></i>
                <span>Category Distribution Analytics</span>
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
          <p class="text-gray-300 text-sm mb-6 h-10">The ultimate experience for professionals and power users.</p>
          
          <div class="mb-8">
            <span class="text-5xl font-extrabold text-white">₹50</span>
            <span class="text-gray-400">/mo</span>
          </div>

          @if (!hasUsedTrial && !isTrialActive) {
            <button (click)="startTrial()" class="w-full py-3 px-6 rounded-full font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 transition-colors mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Start 14-Day Free Trial
            </button>
          }

          <button class="w-full py-3 px-6 rounded-full font-bold bg-white text-blue-900 hover:bg-gray-100 transition-colors mb-8 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Go Gold
          </button>

          <div class="space-y-4">
            <p class="font-semibold text-blue-200 uppercase tracking-wider text-xs mb-4">Everything in Copper, plus:</p>
            <ul class="space-y-3">
              <li class="flex items-start text-white">
                <i class="pi pi-star-fill text-yellow-400 mt-1 mr-3 text-lg"></i>
                <span class="font-medium">Take Interview Session</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>15 Additional AI Credits</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Best Coin Conversion (30 = 1)</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Rollover 50% of free AI credit</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>PDF Evaluation Reports</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Spaced Repetition Review Deck</span>
              </li>
              <li class="flex items-start text-white">
                <i class="pi pi-check-circle text-blue-400 mt-1 mr-3 text-lg"></i>
                <span>Detailed Candidate Reports</span>
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
             <div class="text-3xl font-bold text-white mb-4">₹5</div>
             <button (click)="buyCredits(5, 1)" class="w-full py-2 rounded-full font-medium bg-white/10 hover:bg-blue-600 transition-colors">Buy Now</button>
          </div>
          
          <!-- 3 Credits -->
          <div class="rounded-2xl bg-white/5 border border-purple-500/30 p-6 flex flex-col items-center relative overflow-hidden hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.15)]">
             <div class="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">33% OFF</div>
             <div class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
               <span class="text-2xl font-bold text-purple-400">3</span>
             </div>
             <h4 class="text-xl font-semibold text-white mb-2">3 AI Credits</h4>
             <div class="text-3xl font-bold text-white mb-1">₹10</div>
             <div class="text-sm text-purple-300 line-through mb-4">₹15</div>
             <button (click)="buyCredits(10, 3)" class="w-full py-2 rounded-full font-medium bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/25">Buy Now</button>
          </div>
          
          <!-- 10 Credits -->
          <div class="rounded-2xl bg-white/5 border border-cyan-500/30 p-6 flex flex-col items-center relative overflow-hidden hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.15)]">
             <div class="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">50% OFF</div>
             <div class="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
               <span class="text-2xl font-bold text-cyan-400">10</span>
             </div>
             <h4 class="text-xl font-semibold text-white mb-2">10 AI Credits</h4>
             <div class="text-3xl font-bold text-white mb-1">₹25</div>
             <div class="text-sm text-cyan-300 line-through mb-4">₹50</div>
             <button (click)="buyCredits(25, 10)" class="w-full py-2 rounded-full font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/25">Buy Now</button>
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
                <th scope="col" class="px-6 py-4 text-center">Copper (₹20/mo)</th>
                <th scope="col" class="px-6 py-4 text-center text-blue-400">Gold (₹50/mo)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Daily AI Credits</th>
                <td class="px-6 py-4 text-center">5</td>
                <td class="px-6 py-4 text-center">10 (5 base + 5 extra)</td>
                <td class="px-6 py-4 text-center">20 (5 base + 15 extra)</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Credit Rollover</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center">25%</td>
                <td class="px-6 py-4 text-center">50%</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Coin to AI Credit Conversion</th>
                <td class="px-6 py-4 text-center">100 Coins = 1 Credit</td>
                <td class="px-6 py-4 text-center font-medium text-orange-400">50 Coins = 1 Credit</td>
                <td class="px-6 py-4 text-center font-medium text-blue-400">30 Coins = 1 Credit</td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Take Interview Session</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Performance Trends & Charts</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">PDF Evaluation Reports</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
              <tr class="hover:bg-white/5 transition-colors">
                <th scope="row" class="px-6 py-4 font-medium text-gray-200">Spaced Repetition Review Deck</th>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center text-gray-600">-</td>
                <td class="px-6 py-4 text-center"><i class="pi pi-check text-green-400"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class PricingComponent {
  authService = inject(AuthService);
  userResourceService = inject(UserResourceService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

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

  buyCredits(amount: number, credits: number) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.paymentService.initiatePayment(amount, credits);
  }
}
