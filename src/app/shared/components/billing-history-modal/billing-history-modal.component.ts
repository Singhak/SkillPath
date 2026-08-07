import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserApiService } from '../../../core/services/apis/user-api.service';
import { UserResourceService } from '../../../core/services/user-resource.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PaymentService } from '../../../core/services/payment.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl:'./billing-history-modal.component.html',
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
export class BillingHistoryModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private readonly userApiService = inject(UserApiService);
  readonly userResources = inject(UserResourceService);
  private readonly paymentService = inject(PaymentService);
  private readonly themeService = inject(ThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  activeTab: 'credits' | 'purchases' = 'credits';
  isLoading = false;
  private isLoaded = false;

  showRestorePanel = false;
  isRestoring = false;
  manualOrderId = '';
  restoreMessage = '';

  creditItems: CreditLedgerItem[] = [];
  purchaseItems: PurchaseHistoryItem[] = [];

  get isDark(): boolean {
    return this.themeService.isEffectiveDark;
  }

  ngOnInit(): void {
    if (this.isOpen && !this.isLoaded) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (changes['isOpen'].currentValue === true) {
        this.loadData();
      } else {
        this.isLoaded = false;
        this.showRestorePanel = false;
        this.restoreMessage = '';
        this.manualOrderId = '';
      }
    }
  }

  loadData(): void {
    this.isLoaded = true;
    this.isLoading = true;
    this.cdr.detectChanges();

    this.userResources.fetchCreditsAndCoins().subscribe({ error: () => {} });

    forkJoin({
      creditRes: this.userApiService.getCreditHistory().pipe(catchError(() => of({ count: 0, rows: [] }))),
      purchaseRes: this.userApiService.getPurchaseHistory().pipe(catchError(() => of({ count: 0, rows: [] })))
    }).subscribe({
      next: ({ creditRes, purchaseRes }) => {
        this.creditItems = creditRes.rows || [];
        this.purchaseItems = purchaseRes.rows || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  switchTab(tab: 'credits' | 'purchases'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  triggerAutoRestore(): void {
    this.isRestoring = true;
    this.restoreMessage = '';
    this.cdr.detectChanges();

    this.paymentService.restorePurchase({}).subscribe({
      next: (res) => {
        this.isRestoring = false;
        this.restoreMessage = res.message || 'Restoration complete.';
        this.loadData();
      },
      error: (err) => {
        this.isRestoring = false;
        this.restoreMessage = err.error?.message || 'Restore failed.';
        this.cdr.detectChanges();
      }
    });
  }

  triggerManualRestore(): void {
    if (!this.manualOrderId || !this.manualOrderId.trim()) {
      this.restoreMessage = 'Please enter a valid Order ID or Payment ID.';
      this.cdr.detectChanges();
      return;
    }

    this.isRestoring = true;
    this.restoreMessage = '';
    this.cdr.detectChanges();

    const id = this.manualOrderId.trim();
    const payload = id.startsWith('pay_') ? { paymentId: id } : { orderId: id };

    this.paymentService.restorePurchase(payload).subscribe({
      next: (res) => {
        this.isRestoring = false;
        this.restoreMessage = res.message || 'Restoration complete.';
        this.manualOrderId = '';
        this.loadData();
      },
      error: (err) => {
        this.isRestoring = false;
        this.restoreMessage = err.error?.message || 'Restore failed.';
        this.cdr.detectChanges();
      }
    });
  }

  getAmount(p: PurchaseHistoryItem): number {
    if (!p) return 0;
    let amt = parseFloat((p.amount || 0) as any) || 0;
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
    this.isLoaded = false;
    this.showRestorePanel = false;
    this.restoreMessage = '';
    this.manualOrderId = '';
    this.close.emit();
    this.cdr.detectChanges();
  }
}
