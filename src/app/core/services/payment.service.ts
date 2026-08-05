import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResourceService } from './user-resource.service';
import { AuthService } from './auth.service';

declare var window: any; // For Razorpay

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private userResourceService = inject(UserResourceService);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/payment`;
  private destroyRef = inject(DestroyRef);

  public initiatePayment(amount: number, credits: number, currency: string = 'INR', plan?: string): void {
    // 1. Create Order on Backend
    this.http.post<any>(`${this.apiUrl}/create-order`, { amount, credits, currency, plan }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (order) => {
        const itemDescription = plan ? `Subscribe to ${plan} Plan` : `Purchase ${credits} AI Credits`;
        // 2. Initialize Razorpay Checkout
        const options = {
          key: environment.razorpayKeyId || 'rzp_test_placeholder',
          amount: order.amount,
          currency: order.currency,
          name: 'SkillPath',
          description: itemDescription,
          order_id: order.id,
          handler: (response: any) => {
             this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, credits, plan);
          },
          prefill: {
            name: 'User',
            email: 'user@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#3399cc'
          }
        };

        if (!environment.production && order.id && order.id.startsWith("order_mock_")) {
           // Skip razorpay UI if it's a mock order (for dev without keys)
           this.verifyPayment('mock_payment_id', order.id, 'mock_signature', credits, plan);
           return;
        }

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          console.error("Razorpay SDK not loaded");
        }
      },
      error: (err) => {
        console.error('Error creating order', err);
      }
    });
  }

  private verifyPayment(paymentId: string, orderId: string, signature: string, credits: number, plan?: string) {
     this.http.post<any>(`${this.apiUrl}/verify`, {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        credits: credits,
        plan: plan
     }).pipe(
        takeUntilDestroyed(this.destroyRef)
     ).subscribe({
        next: (res: any) => {
           // Update user resource state
           this.userResourceService.updateUserCredits({ paidCredits: res.paidCredits });
           if (res.plan) {
             this.authService.updateUserProfile({ plan: res.plan });
             alert(`Success! You have subscribed to the ${res.plan} Plan!`);
           } else {
             alert(`Success! ${credits} AI Credits added to your account.`);
           }
        },
        error: (err: any) => {
           console.error('Payment verification failed', err);
           alert('Payment verification failed. Please contact support.');
        }
     });
  }
}
