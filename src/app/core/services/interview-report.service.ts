import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InterviewReportData } from '../models/achievement.model';
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
    summaryFeedback?: string;
    strengths?: string[];
    improvementAreas?: string[];
    recommendedTopics?: string[];
  }): InterviewReportData {
    const reportId = 'RPT-' + Math.floor(100000 + Math.random() * 900000);
    const shareToken = btoa(reportId + '-' + Date.now()).substring(0, 16);

    const report: InterviewReportData = {
      reportId,
      sessionId: 'SESS-' + Date.now().toString().slice(-6),
      userName: params.userName || 'Candidate User',
      userEmail: params.userEmail || 'candidate@skillpath.app',
      roleOrSkill: params.roleOrSkill || 'Full Stack Engineer',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      overallScore: params.overallScore,
      technicalAccuracyScore: params.technicalAccuracyScore ?? params.overallScore,
      communicationScore: params.communicationScore ?? params.overallScore,
      confidenceScore: params.confidenceScore ?? params.overallScore,
      summaryFeedback:
        params.summaryFeedback ||
        'The candidate demonstrated strong foundational knowledge and clear communication throughout the session.',
      strengths: params.strengths || [
        'Clear articulation of core technical concepts',
        'Effective scenario analysis and problem breakdown',
      ],
      improvementAreas: params.improvementAreas || [
        'Could provide more concrete production examples',
      ],
      recommendedTopics: params.recommendedTopics || [
        'Advanced System Architecture',
        'Performance Optimization',
      ],
      shareToken,
    };

    // Save report to backend database asynchronously
    this.http.post<any>(this.apiUrl, report).subscribe({ error: () => { } });

    return report;
  }

  /**
   * Triggers client-side print/PDF download using standard browser print engine
   * Checks and deducts AI credit cost (1.00 AI Credit per PDF evaluation report)
   */
  downloadPdfReport(report: InterviewReportData): boolean {
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SkillPath Performance Evaluation Report - ${report.userName}</title>
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
          <div class="brand">⚡ SkillPath AI</div>
          <div class="report-badge">Report ID: ${report.reportId}</div>
        </div>

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
          <p>Verified by SkillPath AI Assessment Engine | Share Token: ${report.shareToken}</p>
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
