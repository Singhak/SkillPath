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
    //TODO on production mode, enable the below code
    /* this.isProcessingPayment.set(true);
 
     // 1. Create order on backend (backend selects configured provider strategy)
     this.http.post<any>(`${this.apiUrl}/create-order`, { amount, credits, currency, plan }).pipe(
       takeUntilDestroyed(this.destroyRef)
     ).subscribe({
       next: (order) => {
         this.processCheckout(order, amount, credits, currency, plan);
       },
       error: (err) => {
         this.isProcessingPayment.set(false);
         console.error('Error creating payment order', err);
         this.notifyError('Order Failed', err.error?.message || err.error?.error || 'Failed to initialize payment process.');
       }
     });*/
    // Payment Gateway registration is currently in progress
    this.notifyInfo(
      'Subscription and Credit Purchases Coming Soon',
      ' Enjoy full platform features today with our extended 30-Day Free Trial'
    );
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
    console.log('[Cashfree Checkout] Processing cashfree order:', order.orderId);
    this.verifyPayment({
      provider: 'cashfree',
      orderId: order.orderId,
      amount,
      currency: order.currency || currency,
      credits,
      plan
    });
  }

  private handlePayUCheckout(order: any, amount: number, credits: number, currency: string, plan?: string): void {
    console.log('[PayU Checkout] Processing PayU transaction:', order.orderId);
    this.verifyPayment({
      provider: 'payu',
      txnid: order.orderId,
      amount,
      currency: order.currency || currency,
      credits,
      plan
    });
  }

  private verifyPayment(verificationPayload: any): void {
    this.http.post<any>(`${this.apiUrl}/verify`, verificationPayload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res: any) => {
        this.isProcessingPayment.set(false);
        this.userResourceService.updateUserCredits({ paidCredits: res.paidCredits, refetch: true });
        if (verificationPayload.plan && res.plan) {
          this.authService.updateUserProfile({ plan: res.plan });
          this.userResourceService.fetchCreditsAndCoins().subscribe();
          this.notifySuccess('Subscription Activated!', `Success! You have subscribed to the ${res.plan} Plan.`);
        } else {
          this.userResourceService.fetchCreditsAndCoins().subscribe();
          this.notifySuccess('Payment Successful!', `Success! ${verificationPayload.credits} AI Credits added to your account.`);
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
