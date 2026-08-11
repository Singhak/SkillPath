import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterviewReportData, LearnerProgressReportData } from '../models/achievement.model';
import { environment } from '../../environments/environment';
import { UserResourceService } from './user-resource.service';
import { AuthService } from './auth.service';
import { AI_CREDIT_COST } from '../../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class InterviewReportService {
  private readonly http = inject(HttpClient);
  private readonly userResourceService = inject(UserResourceService);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/interviews/reports`;

  /**
   * Fetches user's saved interview evaluation reports from backend
   */
  getUserReports(category?: string): Observable<InterviewReportData[]> {
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    return this.http.get<InterviewReportData[]>(url);
  }

  /**
   * Fetches a report using a shared report token
   */
  getReportByShareToken(shareToken: string): Observable<InterviewReportData> {
    return this.http.get<InterviewReportData>(`${this.apiUrl}/share/${shareToken}`);
  }

  /**
   * Sends an email copy of weekly performance summary digest to logged-in user
   */
  sendWeeklyDigestEmail(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-weekly-digest`, {});
  }

  /**
   * Generates a sample or dynamic evaluation report
   */
  createReportData(params: {
    userName?: string;
    userEmail?: string;
    roleOrSkill: string;
    overallScore: number;
    technicalAccuracyScore?: number;
    communicationScore?: number;
    confidenceScore?: number;
    problemSolvingScore?: number;
    category?: 'mock' | 'practice' | 'real';
    technologyScores?: { topic: string; score: number }[];
    categoryScores?: { category: string; score: number }[];
    detailedQuestionScores?: any[];
    summaryFeedback?: string;
    strengths?: string[];
    improvementAreas?: string[];
    recommendedTopics?: string[];
    saveToBackend?: boolean;
  }): InterviewReportData {
    const reportId = 'RPT-' + Math.floor(100000 + Math.random() * 900000);
    const shareToken = btoa(reportId + '-' + Date.now()).substring(0, 16);

    const report: InterviewReportData = {
      reportId,
      sessionId: 'SESS-' + Date.now().toString().slice(-6),
      userName: params.userName || 'Candidate User',
      userEmail: params.userEmail || '',
      roleOrSkill: params.roleOrSkill || 'Technical Practice',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      overallScore: params.overallScore,
      technicalAccuracyScore: params.technicalAccuracyScore ?? params.overallScore,
      communicationScore: params.communicationScore ?? params.overallScore,
      confidenceScore: params.confidenceScore ?? params.overallScore,
      problemSolvingScore: params.problemSolvingScore ?? params.overallScore,
      category: params.category || 'mock',
      technologyScores: params.technologyScores || [],
      categoryScores: params.categoryScores || [],
      detailedQuestionScores: params.detailedQuestionScores || [],
      summaryFeedback: params.summaryFeedback || 'Completed evaluation session.',
      strengths: params.strengths || [],
      improvementAreas: params.improvementAreas || [],
      recommendedTopics: params.recommendedTopics || [],
      shareToken,
    };

    // Save report to backend database asynchronously if requested/valid
    if (params.saveToBackend !== false && params.summaryFeedback) {
      this.http.post<any>(this.apiUrl, report).subscribe({ error: () => { } });
    }

    return report;
  }

  /**
   * Triggers client-side print/PDF download for learner weekly performance summary.
   * Free service - 0 AI Credits charged.
   */
  downloadLearnerProgressReport(report: LearnerProgressReportData): boolean {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;

    const topicRows = report.topicScores && report.topicScores.length > 0
      ? report.topicScores.map(t => `
        <tr>
          <td style="font-weight:600;">${t.topic}</td>
          <td>
            <div style="background:#e2e8f0; border-radius:10px; height:8px; width:100%; overflow:hidden; display:inline-block; vertical-align:middle; margin-right:8px; max-width:120px;">
              <div style="background: linear-gradient(90deg, #4f46e5, #7c3aed); width: ${t.score}%; height:100%;"></div>
            </div>
            <strong>${t.score}%</strong>
          </td>
          <td><span style="background:${t.score >= 80 ? '#dcfce7' : t.score >= 60 ? '#fef9c3' : '#fee2e2'}; color:${t.score >= 80 ? '#166534' : t.score >= 60 ? '#854d0e' : '#991b1b'}; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700;">${t.status}</span></td>
        </tr>
      `).join('')
      : `
        <tr>
          <td colspan="3" style="text-align:center; padding: 18px 14px; background:#f8fafc;">
            <div style="font-weight:700; color:#334155; font-size:13px; margin-bottom:4px;">No topic practice or skill ratings recorded yet</div>
            <div style="font-size:12px; color:#64748b;">
              Evaluate your skills or take practice quizzes in the app to populate your proficiency report scores.<br>
              <strong>👉 Go to Section:</strong> 
              <a href="/skill-rate" style="color:#4f46e5; text-decoration:underline; font-weight:600; margin-right:12px;">Skill Rating (/skill-rate)</a>
              <a href="/quiz-view" style="color:#4f46e5; text-decoration:underline; font-weight:600;">Practice Quizzes (/quiz-view)</a>
            </div>
          </td>
        </tr>
      `;

    const interviewRows = report.recentInterviews && report.recentInterviews.length > 0
      ? report.recentInterviews.map(i => {
        const cat = (i.category || 'MOCK').toUpperCase();
        const catBg = cat === 'REAL' ? '#e0e7ff' : cat === 'PRACTICE' ? '#fef3c7' : '#dcfce7';
        const catColor = cat === 'REAL' ? '#3730a3' : cat === 'PRACTICE' ? '#92400e' : '#166534';
        return `
          <tr>
            <td>
              <span style="background:${catBg}; color:${catColor}; padding:2px 7px; border-radius:6px; font-size:10px; font-weight:700; margin-right:6px; text-transform:uppercase;">${cat}</span>
              <strong>${i.role}</strong>
              <br><small style="color:#64748b;">${i.date}</small>
            </td>
            <td style="font-size:16px; font-weight:800; color:#4f46e5;">${i.score}%</td>
            <td style="color:#334155;">${i.feedback}</td>
          </tr>
        `;
      }).join('')
      : `
        <tr>
          <td colspan="3" style="text-align:center; padding: 18px 14px; background:#f8fafc;">
            <div style="font-weight:700; color:#334155; font-size:13px; margin-bottom:4px;">No AI Mock Interview sessions recorded yet</div>
            <div style="font-size:12px; color:#64748b;">
              Take an AI Mock Interview session to log evaluation scores, AI feedback, and interview performance history.<br>
              <strong>👉 Go to Section:</strong> 
              <a href="/interviews/create" style="color:#4f46e5; text-decoration:underline; font-weight:600;">Start AI Mock Interview (/interviews/create)</a>
            </div>
          </td>
        </tr>
      `;

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>IMONBENCH Weekly Performance & Progress Report - ${report.userName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #0f172a;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 26px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .report-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .hero-card {
            background: linear-gradient(135deg, #1e1b4b, #312e81, #4338ca);
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 24px;
          }
          .stat-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
          }
          .stat-val {
            font-size: 22px;
            font-weight: 800;
            color: #4f46e5;
          }
          .table-style {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .table-style th {
            background: #f1f5f9;
            text-align: left;
            padding: 10px 14px;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
          }
          .table-style td {
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          .section-title {
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
            margin: 20px 0 12px 0;
            border-left: 4px solid #4f46e5;
            padding-left: 10px;
          }
          ul {
            padding-left: 20px;
            line-height: 1.6;
            color: #334155;
          }
          .footer {
            margin-top: 36px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">⚡ IMONBENCH AI</div>
          <div class="report-badge">Learner Weekly Performance Summary</div>
        </div>

        <div class="hero-card">
          <div style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">${report.userName}</div>
          <div style="font-size: 14px; opacity: 0.9;">Target Role: <strong>${report.targetRole}</strong> | Plan: <strong>${report.userPlan} Plan</strong> | Report Date: <strong>${currentDate}</strong></div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Current Level</div>
            <div class="stat-val">Lvl ${report.level}</div>
            <div style="font-size: 11px; color: #475569;">${report.levelTitle}</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Total XP Points</div>
            <div class="stat-val">${report.totalXp} XP</div>
            <div style="font-size: 11px; color: #475569;">${report.unlockedBadgesCount} Badges</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Practice Streak</div>
            <div class="stat-val">🔥 ${report.currentStreak} Days</div>
            <div style="font-size: 11px; color: #475569;">Active Consistency</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Quizzes & Practice</div>
            <div class="stat-val">🎯 ${report.quizCompletedCount}</div>
            <div style="font-size: 11px; color: #475569;">Sessions Completed</div>
          </div>
        </div>

        <div class="section-title">Topic-Wise Practice & Skill Proficiency</div>
        <table class="table-style">
          <thead>
            <tr>
              <th>Topic / Skill Category</th>
              <th>Mastery Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${topicRows}
          </tbody>
        </table>

        <div class="section-title">Mock Interview History</div>
        <table class="table-style">
          <thead>
            <tr>
              <th>Interview Session</th>
              <th>Score</th>
              <th>Evaluator Feedback / Key Notes</th>
            </tr>
          </thead>
          <tbody>
            ${interviewRows}
          </tbody>
        </table>

        <div class="section-title">Verified Key Strengths</div>
        ${
          report.strengths && report.strengths.length > 0
            ? `<ul>${report.strengths.map(s => `<li>${s}</li>`).join('')}</ul>`
            : `
              <div style="padding: 12px 16px; background:#f8fafc; border: 1px dashed #cbd5e1; border-radius:8px; font-size:12px; color:#64748b;">
                No verified strengths logged yet. Complete quizzes at <a href="/quiz-view" style="color:#4f46e5; font-weight:600;">Practice Quizzes (/quiz-view)</a> or rate your skills at <a href="/skill-rate" style="color:#4f46e5; font-weight:600;">Skill Rating (/skill-rate)</a> to build your performance profile.
              </div>
            `
        }

        <div class="section-title">Recommended AI Weekly Focus Topics</div>
        ${
          report.recommendedFocusTopics && report.recommendedFocusTopics.length > 0
            ? `<ul>${report.recommendedFocusTopics.map(r => `<li>${r}</li>`).join('')}</ul>`
            : `
              <div style="padding: 12px 16px; background:#f8fafc; border: 1px dashed #cbd5e1; border-radius:8px; font-size:12px; color:#64748b;">
                No personalized focus recommendations generated yet. Rate your technical skills at <a href="/skill-rate" style="color:#4f46e5; font-weight:600;">Skill Rating (/skill-rate)</a> to receive AI recommendations.
              </div>
            `
        }

        <div class="footer">
          <p>Generated automatically by IMONBENCH AI Learning & Assessment Platform | ${report.userEmail}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    return true;
  }

  /**
   * Triggers client-side print/PDF download using standard browser print engine
   * Checks and deducts AI credit cost (1.00 AI Credit per PDF evaluation report)
   */
  downloadPdfReport(report: InterviewReportData, isSample = false): boolean {
    const requiredCredits = AI_CREDIT_COST.AI_PDF_REPORT_GENERATION;
    const availableCredits = (this.userResourceService.freeCredits() || 0) + (this.userResourceService.paidCredits() || 0);

    if (availableCredits < requiredCredits) {
      alert(`Insufficient AI Credits. Generating an AI PDF Evaluation Report requires ${requiredCredits} AI Credit(s). Available: ${availableCredits}`);
      return false;
    }

    // Deduct AI Credit for report generation
    this.authService.decrementAiCredits(requiredCredits).subscribe();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;

    const sampleBannerHtml = isSample
      ? `<div style="background: #fef3c7; color: #92400e; border: 2px dashed #f59e0b; padding: 12px 16px; border-radius: 10px; font-weight: 700; text-align: center; margin-bottom: 24px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
          ⚠️ SAMPLE DEMO REPORT - FOR FORMAT PREVIEW ONLY (NOT AN OFFICIAL CANDIDATE EVALUATION)
        </div>`
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>IMONBENCH Performance Evaluation Report - ${report.userName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            color: #1e293b;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand {
            font-size: 28px;
            font-weight: 800;
            color: #4f46e5;
            letter-spacing: -0.5px;
          }
          .report-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .score-card {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 24px;
            border-radius: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          .score-num {
            font-size: 48px;
            font-weight: 900;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 12px;
            text-align: center;
          }
          .metric-val {
            font-size: 24px;
            font-weight: 700;
            color: #4f46e5;
          }
          .section {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 10px;
            border-left: 4px solid #6366f1;
            padding-left: 10px;
          }
          ul {
            padding-left: 20px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">⚡ IMONBENCH AI</div>
          <div class="report-badge">Report ID: ${report.reportId}</div>
        </div>

        ${sampleBannerHtml}

        <h1 style="margin: 0 0 6px 0;">Official Performance Evaluation</h1>
        <p style="color: #64748b; margin-top: 0;">Candidate: <strong>${report.userName}</strong> | Role/Skill: <strong>${report.roleOrSkill}</strong> | Date: ${report.date}</p>

        <div class="score-card">
          <div>
            <div style="font-size: 14px; opacity: 0.9; text-transform: uppercase;">Overall Assessment Score</div>
            <div style="font-size: 18px; font-weight: 600;">Grade: ${report.overallScore >= 80 ? 'EXCELLENT' : report.overallScore >= 60 ? 'PROFICIENT' : 'DEVELOPING'}</div>
          </div>
          <div class="score-num">${report.overallScore}%</div>
        </div>

        <div class="metrics-grid">
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Technical Accuracy</div>
            <div class="metric-val">${report.technicalAccuracyScore}%</div>
          </div>
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Communication Clarity</div>
            <div class="metric-val">${report.communicationScore}%</div>
          </div>
          <div class="metric-box">
            <div style="font-size: 12px; color: #64748b;">Confidence Level</div>
            <div class="metric-val">${report.confidenceScore}%</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <p style="line-height: 1.7; color: #334155;">${report.summaryFeedback}</p>
        </div>

        <div class="section">
          <div class="section-title">Verified Key Strengths</div>
          <ul>
            ${report.strengths.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Growth & Targeted Focus Areas</div>
          <ul>
            ${report.improvementAreas.map((a) => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          <p>Verified by IMONBENCH AI Assessment Engine | Share Token: ${report.shareToken}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    return true;
  }
}
