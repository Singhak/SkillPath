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
  templateUrl: './billing-history-modal.component.html',
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

  pageSize = 10;
  creditPage = 1;
  purchasePage = 1;
  totalCreditCount = 0;
  totalPurchaseCount = 0;
  isTableLoading = false;

  get totalCreditPages(): number {
    return Math.ceil(this.totalCreditCount / this.pageSize) || 1;
  }

  get creditStartIndex(): number {
    if (this.totalCreditCount === 0) return 0;
    return (this.creditPage - 1) * this.pageSize + 1;
  }

  get creditEndIndex(): number {
    return Math.min(this.creditPage * this.pageSize, this.totalCreditCount);
  }

  get totalPurchasePages(): number {
    return Math.ceil(this.totalPurchaseCount / this.pageSize) || 1;
  }

  get purchaseStartIndex(): number {
    if (this.totalPurchaseCount === 0) return 0;
    return (this.purchasePage - 1) * this.pageSize + 1;
  }

  get purchaseEndIndex(): number {
    return Math.min(this.purchasePage * this.pageSize, this.totalPurchaseCount);
  }

  loadCreditPage(page: number): void {
    if (page < 1 || (page > this.totalCreditPages && this.totalCreditCount > 0)) return;
    this.creditPage = page;
    this.isTableLoading = true;
    this.cdr.detectChanges();

    const offset = (page - 1) * this.pageSize;
    this.userApiService.getCreditHistory(this.pageSize, offset).pipe(
      catchError(() => of({ count: 0, rows: [] }))
    ).subscribe({
      next: (res) => {
        this.creditItems = res.rows || [];
        this.totalCreditCount = res.count ?? this.creditItems.length;
        this.isTableLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isTableLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPurchasePage(page: number): void {
    if (page < 1 || (page > this.totalPurchasePages && this.totalPurchaseCount > 0)) return;
    this.purchasePage = page;
    this.isTableLoading = true;
    this.cdr.detectChanges();

    const offset = (page - 1) * this.pageSize;
    this.userApiService.getPurchaseHistory(this.pageSize, offset).pipe(
      catchError(() => of({ count: 0, rows: [] }))
    ).subscribe({
      next: (res) => {
        this.purchaseItems = res.rows || [];
        this.totalPurchaseCount = res.count ?? this.purchaseItems.length;
        this.isTableLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isTableLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  prevCreditPage(): void {
    if (this.creditPage > 1 && !this.isTableLoading) {
      this.loadCreditPage(this.creditPage - 1);
    }
  }

  nextCreditPage(): void {
    if (this.creditPage < this.totalCreditPages && !this.isTableLoading) {
      this.loadCreditPage(this.creditPage + 1);
    }
  }

  prevPurchasePage(): void {
    if (this.purchasePage > 1 && !this.isTableLoading) {
      this.loadPurchasePage(this.purchasePage - 1);
    }
  }

  nextPurchasePage(): void {
    if (this.purchasePage < this.totalPurchasePages && !this.isTableLoading) {
      this.loadPurchasePage(this.purchasePage + 1);
    }
  }

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
    this.creditPage = 1;
    this.purchasePage = 1;
    this.cdr.detectChanges();

    this.userResources.fetchCreditsAndCoins().subscribe({ error: () => { } });

    const offsetCredit = (this.creditPage - 1) * this.pageSize;
    const offsetPurchase = (this.purchasePage - 1) * this.pageSize;

    forkJoin({
      creditRes: this.userApiService.getCreditHistory(this.pageSize, offsetCredit).pipe(catchError(() => of({ count: 0, rows: [] }))),
      purchaseRes: this.userApiService.getPurchaseHistory(this.pageSize, offsetPurchase).pipe(catchError(() => of({ count: 0, rows: [] })))
    }).subscribe({
      next: ({ creditRes, purchaseRes }) => {
        this.creditItems = creditRes.rows || [];
        this.totalCreditCount = creditRes.count ?? this.creditItems.length;
        this.purchaseItems = purchaseRes.rows || [];
        this.totalPurchaseCount = purchaseRes.count ?? this.purchaseItems.length;
        this.isLoading = false;
        this.isTableLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.isTableLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  switchTab(tab: 'credits' | 'purchases'): void {
    this.activeTab = tab;
    this.creditPage = 1;
    this.purchasePage = 1;
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
    if (!this.manualOrderId?.trim()) {
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
    const amt = Number.parseFloat(String(p.amount ?? 0)) || 0;
    if (amt > 0) return amt;

    return this.getFallbackAmount(p);
  }

  private getFallbackAmount(p: PurchaseHistoryItem): number {
    const isUsd = (p.currency || '').toUpperCase() === 'USD';
    const name = (p.itemName || '').toLowerCase();
    const credits = p.creditsAdded || 0;

    if (name.includes('gold')) return isUsd ? 2.99 : 50;
    if (name.includes('copper')) return isUsd ? 0.99 : 20;

    const packagePrice = this.getCreditPackagePrice(credits, name, isUsd);
    if (packagePrice !== null) return packagePrice;

    return credits > 0 ? (isUsd ? credits * 0.25 : credits * 5) : 0;
  }

  private getCreditPackagePrice(credits: number, name: string, isUsd: boolean): number | null {
    const packages = [
      { check: credits === 1 || name.includes('1 ai credit'), usd: 0.25, inr: 5 },
      { check: credits === 3 || name.includes('3 ai credit'), usd: 0.50, inr: 10 },
      { check: credits === 10 || name.includes('10 ai credit'), usd: 1.00, inr: 25 }
    ];

    const found = packages.find(pkg => pkg.check);
    if (!found) return null;

    return isUsd ? found.usd : found.inr;
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
