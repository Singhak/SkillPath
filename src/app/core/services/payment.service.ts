import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResourceService } from './user-resource.service';

declare var window: any; // For Razorpay

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private userResourceService = inject(UserResourceService);
  private apiUrl = `${environment.apiUrl}/payment`;

  public initiatePayment(amount: number, credits: number): void {
    // 1. Create Order on Backend
    this.http.post<any>(`${this.apiUrl}/create-order`, { amount, credits }).subscribe({
      next: (order) => {
        // 2. Initialize Razorpay Checkout
        const options = {
          key: environment.razorpayKeyId || 'rzp_test_placeholder', // Usually injected via environment
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: order.currency,
          name: 'SkillPath',
          description: `Purchase ${credits} AI Credits`,
          order_id: order.id,
          handler: (response: any) => {
             this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, credits);
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

        if (order.id && order.id.startsWith("order_mock_")) {
           // Skip razorpay UI if it's a mock order (for dev without keys)
           console.log("Mock Order Created, skipping Razorpay UI");
           this.verifyPayment('mock_payment_id', order.id, 'mock_signature', credits);
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

  private verifyPayment(paymentId: string, orderId: string, signature: string, credits: number) {
     this.http.post<any>(`${this.apiUrl}/verify`, {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        credits: credits
     }).subscribe({
        next: (res: any) => {
           // Update user resource state
           this.userResourceService.updateUserCredits({ paidCredits: res.paidCredits });
           alert(`Success! ${credits} AI Credits added to your account.`);
        },
        error: (err: any) => {
           console.error('Payment verification failed', err);
           alert('Payment verification failed. Please contact support.');
        }
     });
  }
}
