import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../../core/services/apis/user-api.service';
import { UserResourceService } from '../../../core/services/user-resource.service';
import { ThemeService } from '../../../core/services/theme.service';

export interface CreditLedgerItem {
  id: number;
  type: 'DEDUCTION' | 'PURCHASE' | 'DAILY_GRANT' | 'COIN_EXCHANGE' | 'REFUND';
  feature: string;
  creditsAmount: number;
  freeCreditsUsed: number;
  paidCreditsUsed: number;
  freeBalanceAfter: number;
  paidBalanceAfter: number;
  createdAt: string;
}

export interface PurchaseHistoryItem {
  id: number;
  orderId: string;
  paymentId: string;
  provider: string;
  itemType: 'PLAN' | 'CREDIT_PACK';
  itemName: string;
  amount: number;
  currency: string;
  creditsAdded: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdAt: string;
}

@Component({
  selector: 'app-billing-history-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div 
        [class]="isDark ? 'bg-black/75' : 'bg-slate-900/40'"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
        
        <div 
          [class]="isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-2xl'"
          class="relative w-full max-w-4xl max-h-[90vh] border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
          
          <!-- Header -->
          <div 
            [class]="isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'"
            class="px-6 py-5 border-b flex items-center justify-between transition-colors">
            <div class="flex items-center gap-3">
              <div 
                [class]="isDark ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 border-cyan-300 text-cyan-700'"
                class="p-2.5 rounded-xl border">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 [class]="isDark ? 'text-white' : 'text-slate-900'" class="text-xl font-bold tracking-tight">Billing & Credit Activity</h2>
                <p [class]="isDark ? 'text-slate-400' : 'text-slate-500'" class="text-xs">Detailed purchase invoices and free/paid credit usage audit</p>
              </div>
            </div>
            
            <button 
              (click)="closeModal()"
              [class]="isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'"
              class="p-2 rounded-lg transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Current Balance Stats Banner -->
          <div 
            [class]="isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'"
            class="px-6 py-4 border-b grid grid-cols-1 sm:grid-cols-3 gap-3 transition-colors">
            
            <!-- Free Credits -->
            <div 
              [class]="isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-200 shadow-sm'"
              class="border rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p [class]="isDark ? 'text-emerald-400' : 'text-emerald-600'" class="text-xs font-bold">Free Credits</p>
                <p [class]="isDark ? 'text-white' : 'text-slate-900'" class="text-xl font-extrabold mt-0.5">{{ userResources.freeCredits() | number:'1.1-2' }}</p>
              </div>
              <span [class]="isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border-emerald-300'" class="px-2.5 py-1 text-[11px] font-bold rounded-full border">Daily Refreshed</span>
            </div>

            <!-- Paid Credits -->
            <div 
              [class]="isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-cyan-200 shadow-sm'"
              class="border rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p [class]="isDark ? 'text-cyan-400' : 'text-cyan-600'" class="text-xs font-bold">Paid Credits</p>
                <p [class]="isDark ? 'text-white' : 'text-slate-900'" class="text-xl font-extrabold mt-0.5">{{ userResources.paidCredits() | number:'1.1-2' }}</p>
              </div>
              <span [class]="isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-800 border-cyan-300'" class="px-2.5 py-1 text-[11px] font-bold rounded-full border">Never Expires</span>
            </div>

            <!-- Total Credits -->
            <div 
              [class]="isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-purple-200 shadow-sm'"
              class="border rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p [class]="isDark ? 'text-purple-400' : 'text-purple-600'" class="text-xs font-bold">Total Credits Available</p>
                <p [class]="isDark ? 'text-white' : 'text-slate-900'" class="text-xl font-extrabold mt-0.5">{{ (userResources.freeCredits() + userResources.paidCredits()) | number:'1.1-2' }}</p>
              </div>
              <span [class]="isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-100 text-purple-800 border-purple-300'" class="px-2.5 py-1 text-[11px] font-bold rounded-full border">Combined Balance</span>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div 
            [class]="isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-100/50'"
            class="px-6 border-b flex items-center gap-4 transition-colors">
            
            <button 
              (click)="activeTab = 'credits'"
              [class]="activeTab === 'credits' 
                ? (isDark ? 'border-cyan-400 text-cyan-400 font-semibold' : 'border-cyan-600 text-cyan-700 font-extrabold') 
                : (isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900')"
              class="py-3 px-1 border-b-2 text-sm transition-all flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Credit Usage Ledger
              <span [class]="isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'" class="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full">{{ creditItems.length }}</span>
            </button>

            <button 
              (click)="activeTab = 'purchases'"
              [class]="activeTab === 'purchases' 
                ? (isDark ? 'border-cyan-400 text-cyan-400 font-semibold' : 'border-cyan-600 text-cyan-700 font-extrabold') 
                : (isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900')"
              class="py-3 px-1 border-b-2 text-sm transition-all flex items-center gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Purchase History
              <span [class]="isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'" class="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full">{{ purchaseItems.length }}</span>
            </button>
          </div>

          <!-- Content Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            
            @if (isLoading) {
              <div [class]="isDark ? 'text-slate-400' : 'text-slate-500'" class="py-16 text-center space-y-3">
                <div class="inline-block w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm font-medium">Loading activity logs...</p>
              </div>
            } @else {

              <!-- TAB 1: CREDIT LEDGER -->
              @if (activeTab === 'credits') {
                @if (creditItems.length === 0) {
                  <div 
                    [class]="isDark ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'"
                    class="py-16 text-center rounded-xl border">
                    <svg xmlns="http://www.w3.org/2000/svg" [class]="isDark ? 'text-slate-600' : 'text-slate-400'" class="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p [class]="isDark ? 'text-slate-300' : 'text-slate-800'" class="text-base font-bold">No credit usage logs yet</p>
                    <p [class]="isDark ? 'text-slate-500' : 'text-slate-500'" class="text-xs mt-1">Start using AI interview tools to track your dynamic credit deductions!</p>
                  </div>
                } @else {
                  <div 
                    [class]="isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'"
                    class="overflow-x-auto rounded-xl border">
                    <table class="w-full text-left text-xs">
                      <thead 
                        [class]="isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'"
                        class="uppercase tracking-wider font-extrabold border-b">
                        <tr>
                          <th class="px-4 py-3">Date & Time</th>
                          <th class="px-4 py-3">Feature / Description</th>
                          <th class="px-4 py-3 text-right">Amount</th>
                          <th class="px-4 py-3 text-center">Segregation (Free vs Paid)</th>
                          <th class="px-4 py-3 text-right">Remaining Balances</th>
                        </tr>
                      </thead>
                      <tbody [class]="isDark ? 'divide-slate-800/60' : 'divide-slate-200'" class="divide-y">
                        @for (item of creditItems; track item.id) {
                          <tr [class]="isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'" class="transition-colors">
                            <!-- Date & Time -->
                            <td [class]="isDark ? 'text-slate-400' : 'text-slate-500'" class="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                              {{ item.createdAt | date:'short' }}
                            </td>

                            <!-- Feature Name -->
                            <td [class]="isDark ? 'text-white' : 'text-slate-900'" class="px-4 py-3.5 font-bold">
                              <div class="flex items-center gap-2">
                                @if (item.type === 'DEDUCTION') {
                                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                                } @else if (item.type === 'PURCHASE') {
                                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                                } @else {
                                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                                }
                                <span>{{ item.feature }}</span>
                              </div>
                            </td>

                            <!-- Credits Amount -->
                            <td class="px-4 py-3.5 text-right font-mono font-extrabold whitespace-nowrap">
                              @if (item.creditsAmount > 0) {
                                <span [class]="isDark ? 'text-emerald-400' : 'text-emerald-600'">+{{ item.creditsAmount | number:'1.1-2' }}</span>
                              } @else {
                                <span [class]="isDark ? 'text-rose-400' : 'text-rose-600'">{{ item.creditsAmount | number:'1.1-2' }}</span>
                              }
                            </td>

                            <!-- Free vs Paid Segregation -->
                            <td class="px-4 py-3.5 text-center whitespace-nowrap">
                              <div 
                                [class]="isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'"
                                class="inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-lg">
                                <span [class]="isDark ? 'text-emerald-400' : 'text-emerald-700'" class="font-extrabold">Free: {{ item.freeCreditsUsed | number:'1.1-2' }}</span>
                                <span [class]="isDark ? 'text-slate-600' : 'text-slate-400'">|</span>
                                <span [class]="isDark ? 'text-cyan-400' : 'text-cyan-700'" class="font-extrabold">Paid: {{ item.paidCreditsUsed | number:'1.1-2' }}</span>
                              </div>
                            </td>

                            <!-- Balances After -->
                            <td [class]="isDark ? 'text-slate-400' : 'text-slate-500'" class="px-4 py-3.5 text-right font-mono text-[11px] whitespace-nowrap">
                              Free: <span [class]="isDark ? 'text-emerald-300' : 'text-emerald-700'" class="font-bold">{{ item.freeBalanceAfter | number:'1.1-2' }}</span> |
                              Paid: <span [class]="isDark ? 'text-cyan-300' : 'text-cyan-700'" class="font-bold">{{ item.paidBalanceAfter | number:'1.1-2' }}</span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              }

              <!-- TAB 2: PURCHASE HISTORY -->
              @if (activeTab === 'purchases') {
                @if (purchaseItems.length === 0) {
                  <div 
                    [class]="isDark ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'"
                    class="py-16 text-center rounded-xl border">
                    <svg xmlns="http://www.w3.org/2000/svg" [class]="isDark ? 'text-slate-600' : 'text-slate-400'" class="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p [class]="isDark ? 'text-slate-300' : 'text-slate-800'" class="text-base font-bold">No purchase records found</p>
                    <p [class]="isDark ? 'text-slate-500' : 'text-slate-500'" class="text-xs mt-1">Upgrade your plan or buy credits to view purchase receipts here!</p>
                  </div>
                } @else {
                  <div 
                    [class]="isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'"
                    class="overflow-x-auto rounded-xl border">
                    <table class="w-full text-left text-xs">
                      <thead 
                        [class]="isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'"
                        class="uppercase tracking-wider font-extrabold border-b">
                        <tr>
                          <th class="px-4 py-3">Date</th>
                          <th class="px-4 py-3">Item Purchased</th>
                          <th class="px-4 py-3">Provider</th>
                          <th class="px-4 py-3 text-right">Amount Paid</th>
                          <th class="px-4 py-3 text-center">Credits Added</th>
                          <th class="px-4 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody [class]="isDark ? 'divide-slate-800/60' : 'divide-slate-200'" class="divide-y">
                        @for (p of purchaseItems; track p.id) {
                          <tr [class]="isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'" class="transition-colors">
                            <td [class]="isDark ? 'text-slate-400' : 'text-slate-500'" class="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                              {{ p.createdAt | date:'mediumDate' }}
                            </td>
                            <td [class]="isDark ? 'text-white' : 'text-slate-900'" class="px-4 py-3.5 font-bold">
                              {{ p.itemName }}
                            </td>
                            <td class="px-4 py-3.5 uppercase text-[10px] tracking-wider">
                              <span [class]="isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'" class="px-2 py-0.5 rounded border font-mono font-bold">{{ p.provider }}</span>
                            </td>
                            <td [class]="isDark ? 'text-emerald-400' : 'text-emerald-600'" class="px-4 py-3.5 text-right font-mono font-extrabold text-sm">
                              {{ p.currency === 'USD' ? '$' : '₹' }}{{ getAmount(p) | number:'1.2-2' }}
                            </td>
                            <td [class]="isDark ? 'text-cyan-400' : 'text-cyan-600'" class="px-4 py-3.5 text-center font-mono font-bold">
                              +{{ p.creditsAdded }}
                            </td>
                            <td class="px-4 py-3.5 text-center">
                              <span [class]="isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'" class="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border">
                                {{ p.status }}
                              </span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              }

            }

          </div>

          <!-- Footer -->
          <div 
            [class]="isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'"
            class="px-6 py-4 border-t flex items-center justify-between text-xs transition-colors">
            <span class="flex items-center gap-1.5 font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Authoritative Credit Audit active
            </span>
            <button 
              (click)="closeModal()"
              [class]="isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold'"
              class="px-5 py-2 rounded-xl transition-colors cursor-pointer">
              Close
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class BillingHistoryModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private readonly userApiService = inject(UserApiService);
  readonly userResources = inject(UserResourceService);
  private readonly themeService = inject(ThemeService);

  activeTab: 'credits' | 'purchases' = 'credits';
  isLoading = false;

  creditItems: CreditLedgerItem[] = [];
  purchaseItems: PurchaseHistoryItem[] = [];

  get isDark(): boolean {
    return this.themeService.isEffectiveDark;
  }

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadData();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.userResources.fetchCreditsAndCoins().subscribe({ error: () => {} });

    this.userApiService.getCreditHistory().subscribe({
      next: (res) => {
        this.creditItems = res.rows || [];
        this.userApiService.getPurchaseHistory().subscribe({
          next: (pres) => {
            this.purchaseItems = pres.rows || [];
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getAmount(p: PurchaseHistoryItem): number {
    let amt = parseFloat(p.amount as any) || 0;
    if (amt === 0) {
      const isUsd = (p.currency || '').toUpperCase() === 'USD';
      const name = (p.itemName || '').toLowerCase();
      if (name.includes('gold')) return isUsd ? 2.99 : 50;
      if (name.includes('copper')) return isUsd ? 0.99 : 20;
      if (p.creditsAdded === 1 || name.includes('1 ai credit')) return isUsd ? 0.25 : 5;
      if (p.creditsAdded === 3 || name.includes('3 ai credit')) return isUsd ? 0.50 : 10;
      if (p.creditsAdded === 10 || name.includes('10 ai credit')) return isUsd ? 1.00 : 25;
      if (p.creditsAdded > 0) return isUsd ? p.creditsAdded * 0.25 : p.creditsAdded * 5;
    }
    return amt;
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }
}
