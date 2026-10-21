import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { UserResourceService } from './user-resource.service';
import { AuthService } from './auth.service';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly userResourceService = inject(UserResourceService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService, { optional: true });
  private readonly apiUrl = `${environment.apiUrl}/payment`;
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Tracks payment lifecycle loading state (order creation -> gateway modal -> payment verification)
   */
  readonly isProcessingPayment = signal<boolean>(false);

  /**
   * Set when more than one gateway is available; the pricing UI shows a chooser and calls selectProvider()
   */
  readonly providerChoice = signal<{ id: string; label: string }[] | null>(null);
  private pendingPurchase: { credits: number; currency: string; plan?: string } | null = null;

  private static readonly PROVIDER_LABELS: Record<string, string> = {
    razorpay: 'Razorpay (UPI, Cards, NetBanking)',
    cashfree: 'Cashfree (UPI, Cards, NetBanking)',
    payu: 'PayU (UPI, Cards, NetBanking)',
    stripe: 'Stripe (Cards)',
    phonepe: 'PhonePe',
  };

  /**
   * Fetch active payment gateway configuration & supported providers list
   */
  public getPaymentConfig(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/config`);
  }

  /**
   * Provider-agnostic payment trigger function used across the UI
   */
  public initiatePayment(amount: number, credits: number, currency: string = 'INR', plan?: string): void {
    if (this.isProcessingPayment()) {
      return; // Block accidental duplicate payment triggers
    }

    if (plan) {
      const currentPlan = (this.authService.currentPlan() || 'Silver').toLowerCase();
      if (currentPlan === plan.toLowerCase()) {
        this.notifyInfo('Already Subscribed', `You are already subscribed to the ${plan} Plan.`);
        return;
      }
      if (currentPlan === 'gold' && plan.toLowerCase() === 'copper') {
        this.notifyInfo('Active Plan', 'You already have active Gold membership which includes all Copper features.');
        return;
      }
    }
    this.isProcessingPayment.set(true);

    // Ask the backend which providers are available for this currency
    this.getPaymentConfig().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        const providers: { id: string; currencies: string[] }[] = (config.providers || [])
          .filter((p: any) => p.currencies?.includes(currency));
        this.pendingPurchase = { credits, currency, plan };

        if (providers.length === 0) {
          this.isProcessingPayment.set(false);
          this.notifyError('Payments Unavailable', `No payment method is available for ${currency} right now.`);
        } else if (providers.length === 1) {
          this.createOrder(providers[0].id);
        } else {
          this.isProcessingPayment.set(false);
          this.providerChoice.set(providers.map(p => ({
            id: p.id,
            label: PaymentService.PROVIDER_LABELS[p.id] || p.id
          })));
        }
      },
      error: () => {
        this.isProcessingPayment.set(false);
        this.notifyError('Payments Unavailable', 'Could not load payment options. Please try again.');
      }
    });
  }

  /** Called by the provider chooser UI */
  public selectProvider(providerId: string): void {
    this.providerChoice.set(null);
    if (!this.pendingPurchase) { return; }
    this.isProcessingPayment.set(true);
    this.createOrder(providerId);
  }

  public cancelProviderSelection(): void {
    this.providerChoice.set(null);
    this.pendingPurchase = null;
  }

  private createOrder(provider: string): void {
    const purchase = this.pendingPurchase;
    if (!purchase) { this.isProcessingPayment.set(false); return; }
    const { credits, currency, plan } = purchase;

    // Amount is intentionally not sent: the server prices every order
    this.http.post<any>(`${this.apiUrl}/create-order`, { credits, currency, plan, provider }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (order) => this.processCheckout(order, order.amount, credits, currency, plan),
      error: (err) => {
        this.isProcessingPayment.set(false);
        console.error('Error creating payment order', err);
        this.notifyError('Order Failed', err.error?.message || err.error?.error || 'Failed to initialize payment process.');
      }
    });
  }

  /**
   * Handle the redirect back from Cashfree / PayU (query: provider, order_id, status).
   * Call from the pricing page on init. Fulfilment always goes through the server-side /verify.
   */
  public handlePaymentReturn(): void {
    // Works for both path routing (/pricing?x) and hash routing (/#/pricing?x)
    const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const params = new URLSearchParams(window.location.search || hashQuery);
    const provider = params.get('provider');
    const orderId = params.get('order_id');
    const status = (params.get('status') || '').toLowerCase();
    if ((provider !== 'cashfree' && provider !== 'payu') || (!orderId && !status)) { return; }

    window.history.replaceState({}, '', window.location.pathname + window.location.hash.split('?')[0]);

    if (!orderId || ['invalid', 'error'].includes(status)) {
      this.notifyError('Payment Failed', 'We could not confirm your payment. If money was debited, use Restore Purchase.');
      return;
    }
    if (provider === 'payu' && status && status !== 'success') {
      this.notifyError('Payment Failed', 'Your payment was not completed. You have not been charged.');
      return;
    }

    this.isProcessingPayment.set(true);
    this.verifyPayment({ provider, orderId });
  }

  private processCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    const provider = order.provider || (order.id?.startsWith('order_mock_') ? 'mock' : 'razorpay');

    switch (provider) {
      case 'mock':
        this.handleMockCheckout(order, amount, credits, currency, plan);
        break;
      case 'razorpay':
        this.handleRazorpayCheckout(order, amount, credits, currency, plan);
        break;
      case 'stripe':
        this.handleStripeCheckout(order, amount, credits, currency, plan);
        break;
      case 'phonepe':
        this.handlePhonePeCheckout(order, amount, credits, currency, plan);
        break;
      case 'cashfree':
        this.handleCashfreeCheckout(order, amount, credits, currency, plan);
        break;
      case 'payu':
        this.handlePayUCheckout(order, amount, credits, currency, plan);
        break;
      default:
        this.handleMockCheckout(order, amount, credits, currency, plan);
        break;
    }
  }

  private handleMockCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    console.log('[Mock Checkout] Auto-completing test payment for order:', order.orderId || order.id);
    this.verifyPayment({
      provider: 'mock',
      orderId: order.orderId || order.id || 'order_mock_test',
      amount,
      currency: order.currency || currency,
      credits,
      plan
    });
  }

  private handleRazorpayCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    const itemDescription = plan ? `Subscribe to ${plan} Plan` : `Purchase ${credits} AI Credits`;
    const payload = order.checkoutPayload || {};
    const currentUser = this.authService.currentUser();

    const options = {
      key: payload.key || environment.razorpayKeyId || 'rzp_test_TM3geoygBFGL7G',
      amount: order.amount,
      currency: order.currency || currency,
      name: 'IMONBENCH',
      description: itemDescription,
      order_id: order.orderId || order.id,
      handler: (response: any) => {
        this.verifyPayment({
          provider: 'razorpay',
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount,
          currency: order.currency || currency,
          credits,
          plan
        });
      },
      prefill: {
        name: currentUser?.name || '',
        email: currentUser?.emailId || currentUser?.email || '',
      },
      modal: {
        ondismiss: () => {
          this.isProcessingPayment.set(false);
          this.notifyInfo('Payment Cancelled', 'Payment window was closed.');
        }
      },
      theme: { color: '#3b82f6' }
    };

    if (window.Razorpay) {
      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          this.isProcessingPayment.set(false);
          this.notifyError('Payment Failed', resp.error?.description || 'Transaction failed. Please try again.');
        });
        rzp.open();
      } catch (err: any) {
        this.isProcessingPayment.set(false);
        console.error('Error opening Razorpay modal:', err);
        this.notifyError('Payment Error', 'Failed to open payment modal. Please try again.');
      }
    } else {
      this.isProcessingPayment.set(false);
      this.notifyError('Razorpay Error', 'Razorpay SDK is loading. Please retry in a moment.');
    }
  }

  private handleStripeCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    console.log('[Stripe Checkout] Processing payment intent:', order.orderId);
    this.verifyPayment({
      provider: 'stripe',
      paymentIntentId: order.orderId,
      amount,
      currency: order.currency || currency,
      credits,
      plan
    });
  }

  private handlePhonePeCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    console.log('[PhonePe Checkout] Processing merchant transaction:', order.orderId);
    this.verifyPayment({
      provider: 'phonepe',
      merchantTransactionId: order.orderId,
      amount,
      currency: order.currency || currency,
      credits,
      plan
    });
  }

  private handleCashfreeCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    const payload = order.checkoutPayload || {};
    this.loadScript('https://sdk.cashfree.com/js/v3/cashfree.js').then(() => {
      const cashfree = window.Cashfree({ mode: payload.env === 'production' ? 'production' : 'sandbox' });
      // Redirects to Cashfree; user returns to /pricing?provider=cashfree&order_id=... (see handlePaymentReturn)
      cashfree.checkout({ paymentSessionId: payload.paymentSessionId, redirectTarget: '_self' });
    }).catch(() => {
      this.isProcessingPayment.set(false);
      this.notifyError('Cashfree Error', 'Could not load the payment SDK. Please try again.');
    });
  }

  private handlePayUCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    const payload = order.checkoutPayload || {};
    // PayU requires a browser form POST; the result returns via the backend callback to /pricing
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payload.actionUrl;
    Object.entries(payload.fields || {}).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(el);
    });
  }

  private verifyPayment(verificationPayload: any): void {
    this.http.post<any>(`${this.apiUrl}/verify`, verificationPayload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res: any) => {
        this.isProcessingPayment.set(false);
        this.userResourceService.updateUserCredits({ paidCredits: res.paidCredits, refetch: true });
        if (res.plan) {
          this.authService.updateUserProfile({ plan: res.plan });
          this.userResourceService.fetchCreditsAndCoins().subscribe();
          this.notifySuccess('Subscription Activated!', `Success! You have subscribed to the ${res.plan} Plan.`);
        } else {
          this.userResourceService.fetchCreditsAndCoins().subscribe();
          this.notifySuccess('Payment Successful!', 'Success! AI Credits have been added to your account.');
        }
      },
      error: (err: any) => {
        this.isProcessingPayment.set(false);
        console.error('Payment verification failed', err);
        this.notifyError('Verification Failed', err.error?.message || 'Payment verification failed. Please contact support.');
      }
    });
  }

  /**
   * Restore purchase for recovery of unfulfilled orders due to glitches
   */
  public restorePurchase(payload?: { orderId?: string; paymentId?: string; provider?: string }): Observable<any> {
    return new Observable((observer) => {
      this.http.post<any>(`${this.apiUrl}/restore`, payload || {}).subscribe({
        next: (res: any) => {
          if (res.restored) {
            if (res.paidCredits !== undefined) {
              this.userResourceService.updateUserCredits({ paidCredits: res.paidCredits, refetch: true });
            }
            if (res.plan) {
              this.authService.updateUserProfile({ plan: res.plan });
            }
            this.userResourceService.fetchCreditsAndCoins().subscribe();
            this.notifySuccess('Purchase Restored!', res.message || 'Your purchase has been restored successfully.');
          } else if (res.alreadyFulfilled) {
            this.notifyInfo('Purchase Active', res.message || 'This purchase is already active on your account.');
          } else {
            this.notifyInfo('Restore Info', res.message || 'No restorable purchases found.');
          }
          observer.next(res);
          observer.complete();
        },
        error: (err: any) => {
          console.error('Restore purchase error', err);
          this.notifyError('Restore Failed', err.error?.message || 'Could not restore purchase. Please check your order details or contact support.');
          observer.error(err);
        }
      });
    });
  }

  private notifySuccess(summary: string, detail: string): void {
    if (this.messageService) {
      this.messageService.add({ severity: 'success', summary, detail });
    } else {
      alert(`${summary}: ${detail}`);
    }
  }

  private notifyError(summary: string, detail: string): void {
    if (this.messageService) {
      this.messageService.add({ severity: 'error', summary, detail });
    } else {
      alert(`${summary}: ${detail}`);
    }
  }

  private notifyInfo(summary: string, detail: string): void {
    if (this.messageService) {
      this.messageService.add({ severity: 'info', summary, detail });
    } else {
      alert(`${summary}: ${detail}`);
    }
  }
}
