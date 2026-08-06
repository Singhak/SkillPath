import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { UserResourceService } from './user-resource.service';
import { AuthService } from './auth.service';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private userResourceService = inject(UserResourceService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService, { optional: true });
  private apiUrl = `${environment.apiUrl}/payment`;
  private destroyRef = inject(DestroyRef);

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

    // 1. Create order on backend (backend selects configured provider strategy)
    this.http.post<any>(`${this.apiUrl}/create-order`, { amount, credits, currency, plan }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (order) => {
        this.processCheckout(order, credits, plan);
      },
      error: (err) => {
        console.error('Error creating payment order', err);
        this.notifyError('Order Failed', err.error?.message || err.error?.error || 'Failed to initialize payment process.');
      }
    });
  }

  private processCheckout(order: any, credits: number, plan?: string): void {
    const provider = order.provider || (order.id?.startsWith('order_mock_') ? 'mock' : 'razorpay');

    switch (provider) {
      case 'mock':
        this.handleMockCheckout(order, credits, plan);
        break;
      case 'razorpay':
        this.handleRazorpayCheckout(order, credits, plan);
        break;
      case 'stripe':
        this.handleStripeCheckout(order, credits, plan);
        break;
      case 'phonepe':
        this.handlePhonePeCheckout(order, credits, plan);
        break;
      case 'cashfree':
        this.handleCashfreeCheckout(order, credits, plan);
        break;
      case 'payu':
        this.handlePayUCheckout(order, credits, plan);
        break;
      default:
        this.handleMockCheckout(order, credits, plan);
        break;
    }
  }

  private handleMockCheckout(order: any, credits: number, plan?: string): void {
    console.log('[Mock Checkout] Auto-completing test payment for order:', order.orderId || order.id);
    this.verifyPayment({
      provider: 'mock',
      orderId: order.orderId || order.id || 'order_mock_test',
      credits,
      plan
    });
  }

  private handleRazorpayCheckout(order: any, credits: number, plan?: string): void {
    const itemDescription = plan ? `Subscribe to ${plan} Plan` : `Purchase ${credits} AI Credits`;
    const payload = order.checkoutPayload || {};
    const currentUser = this.authService.currentUser();

    const options = {
      key: payload.key || environment.razorpayKeyId || 'rzp_test_TM3geoygBFGL7G',
      amount: order.amount,
      currency: order.currency,
      name: 'SkillPath',
      description: itemDescription,
      order_id: order.orderId || order.id,
      handler: (response: any) => {
        this.verifyPayment({
          provider: 'razorpay',
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          credits,
          plan
        });
      },
      prefill: {
        name: currentUser?.name || '',
        email: currentUser?.email || '',
      },
      modal: {
        ondismiss: () => {
          this.notifyInfo('Payment Cancelled', 'Payment window was closed.');
        }
      },
      theme: { color: '#3b82f6' }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        this.notifyError('Payment Failed', resp.error?.description || 'Transaction failed. Please try again.');
      });
      rzp.open();
    } else {
      this.notifyError('Razorpay Error', 'Razorpay SDK is loading. Please retry in a moment.');
    }
  }

  private handleStripeCheckout(order: any, credits: number, plan?: string): void {
    console.log('[Stripe Checkout] Processing payment intent:', order.orderId);
    this.verifyPayment({
      provider: 'stripe',
      paymentIntentId: order.orderId,
      credits,
      plan
    });
  }

  private handlePhonePeCheckout(order: any, credits: number, plan?: string): void {
    console.log('[PhonePe Checkout] Processing merchant transaction:', order.orderId);
    this.verifyPayment({
      provider: 'phonepe',
      merchantTransactionId: order.orderId,
      credits,
      plan
    });
  }

  private handleCashfreeCheckout(order: any, credits: number, plan?: string): void {
    console.log('[Cashfree Checkout] Processing cashfree order:', order.orderId);
    this.verifyPayment({
      provider: 'cashfree',
      orderId: order.orderId,
      credits,
      plan
    });
  }

  private handlePayUCheckout(order: any, credits: number, plan?: string): void {
    console.log('[PayU Checkout] Processing PayU transaction:', order.orderId);
    this.verifyPayment({
      provider: 'payu',
      txnid: order.orderId,
      credits,
      plan
    });
  }

  private verifyPayment(verificationPayload: any): void {
    this.http.post<any>(`${this.apiUrl}/verify`, verificationPayload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res: any) => {
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
        console.error('Payment verification failed', err);
        this.notifyError('Verification Failed', err.error?.message || 'Payment verification failed. Please contact support.');
      }
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
