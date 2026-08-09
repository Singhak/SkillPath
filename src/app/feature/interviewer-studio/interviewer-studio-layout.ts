import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-interviewer-studio-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="studio-container">
      <header class="studio-header">
        <div class="brand">
          <span class="icon">🎙️</span>
          <div>
            <h1 class="title">Interviewer Studio & Co-Pilot</h1>
            <p class="subtitle">AI-assisted question matrix generator, real-time rubric evaluator & decision reports</p>
          </div>
        </div>
        <div class="nav-links">
          <a routerLink="/interviewer-studio" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-btn" [class.disabled]="currentPlan() !== 'Gold'">
            <span>⚙️ Config Wizard</span>
          </a>
          <a routerLink="/interviewer-studio/session" routerLinkActive="active" class="nav-btn" [class.disabled]="currentPlan() !== 'Gold'">
            <span>⚡ Live Session Co-Pilot</span>
          </a>
          <a routerLink="/interviewer-studio/report" routerLinkActive="active" class="nav-btn" [class.disabled]="currentPlan() !== 'Gold'">
            <span>📊 Assessment Report</span>
          </a>
        </div>
      </header>
      <main class="studio-content">
        @if (currentPlan() !== 'Gold') {
          <div class="locked-overlay">
            <div class="locked-content">
              <span style="font-size: 3rem; margin-bottom: 1rem; display: block;">🔒</span>
              <h2 style="font-size: 1.8rem; margin: 0 0 0.5rem 0; color: #fff;">Gold Plan Required</h2>
              <p style="color: #94a3b8; margin: 0 0 2rem 0; font-size: 1.1rem; line-height: 1.5;">The Interviewer Studio is an exclusive feature for our Gold members.<br>Upgrade your plan to unlock AI-assisted interviewing.</p>
              <a routerLink="/pricing" class="upgrade-btn">
                <span>⭐ Upgrade to Gold</span>
              </a>
            </div>
          </div>
        }
        <div [class.blurred]="currentPlan() !== 'Gold'">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .studio-container {
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      padding: 1.5rem;
    }
    .studio-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      margin-bottom: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon {
      font-size: 2.2rem;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0.2rem 0 0 0;
    }
    .nav-links {
      display: flex;
      gap: 0.75rem;
    }
    .nav-btn {
      display: flex;
      align-items: center;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      background: rgba(51, 65, 85, 0.5);
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
    }
    .nav-btn:hover:not(.disabled) {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border-color: rgba(99, 102, 241, 0.4);
    }
    .nav-btn.active:not(.disabled) {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    }
    .nav-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .studio-content {
      position: relative;
    }
    .locked-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(15, 23, 42, 0.4);
      border-radius: 16px;
    }
    .locked-content {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      background: rgba(30, 41, 59, 0.95);
      backdrop-filter: blur(16px);
      padding: 3rem;
      border-radius: 24px;
      text-align: center;
      border: 1px solid rgba(245, 158, 11, 0.2);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245, 158, 11, 0.1);
      max-width: 500px;
      width: 90%;
      animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .upgrade-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.8rem 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: #ffffff;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    }
    .upgrade-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
    }
    .blurred {
      filter: blur(8px) grayscale(50%);
      pointer-events: none;
      user-select: none;
      opacity: 0.6;
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.9) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @media (max-width: 768px) {
      .studio-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .nav-links {
        width: 100%;
        flex-wrap: wrap;
      }
    }
  `]
})
export class InterviewerStudioLayoutComponent {
  private authService = inject(AuthService);
  currentPlan = this.authService.currentPlan;
}

