import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
          <a routerLink="/interviewer-studio" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-btn">
            <span>⚙️ Config Wizard</span>
          </a>
          <a routerLink="/interviewer-studio/session" routerLinkActive="active" class="nav-btn">
            <span>⚡ Live Session Co-Pilot</span>
          </a>
          <a routerLink="/interviewer-studio/report" routerLinkActive="active" class="nav-btn">
            <span>📊 Assessment Report</span>
          </a>
        </div>
      </header>
      <main class="studio-content">
        <router-outlet></router-outlet>
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
    .nav-btn:hover {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border-color: rgba(99, 102, 241, 0.4);
    }
    .nav-btn.active {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
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
  `],
})
export class InterviewerStudioLayoutComponent {}
