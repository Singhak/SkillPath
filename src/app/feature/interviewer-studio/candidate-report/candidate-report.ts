import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InterviewerCopilotService } from '../../../core/services/interviewer-copilot.service';
import { InterviewReportService } from '../../../core/services/interview-report.service';
import { CandidateAssessmentReport } from '../../../core/models/interviewer-studio.model';

@Component({
  selector: 'app-candidate-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-report.html',
  styleUrls: ['./candidate-report.css'],
})
export class CandidateReportComponent implements OnInit {
  private readonly copilotService = inject(InterviewerCopilotService);
  private readonly reportService = inject(InterviewReportService);
  private readonly router = inject(Router);

  report: CandidateAssessmentReport | null = null;
  copiedFeedback = false;

  ngOnInit(): void {
    this.copilotService.loadSessionFromStorage();

    if (this.copilotService.activeReport()) {
      this.report = this.copilotService.activeReport();
    } else if (this.copilotService.activeMatrix()) {
      this.report = this.copilotService.finalizeAndGenerateReport();
    }
  }

  get recommendationClass(): string {
    if (!this.report) return '';
    switch (this.report.recommendation) {
      case 'Strong Hire': return 'strong-hire';
      case 'Hire': return 'hire';
      case 'Lean Hire': return 'lean-hire';
      default: return 'no-hire';
    }
  }

  copyReportForHR(): void {
    if (!this.report) return;

    const formatted = `=== CANDIDATE INTERVIEW ASSESSMENT REPORT ===
Candidate: ${this.report.candidateName}
Role: ${this.report.jobTitle} (${this.report.experienceLevel})
Round: ${this.report.roundType}
Date: ${this.report.date}

OVERALL RECOMMENDATION: ${this.report.recommendation.toUpperCase()} (${this.report.overallScore}%)

SUMMARY:
${this.report.summaryFeedback}

KEY STRENGTHS:
${this.report.strengths.map((s) => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${this.report.areasForImprovement.map((a) => `• ${a}`).join('\n')}

SKILL BREAKDOWN:
${this.report.technologyScores.map((t) => `• ${t.techName}: ${t.score}%`).join('\n')}

QUESTION EVALUATION DETAILS:
${this.report.detailedQuestionScores.map((q) => `[${q.technology}] Score: ${q.score}/5\nQ: ${q.questionText}\nNotes: ${q.notes}\n`).join('\n')}
=============================================`;

    navigator.clipboard.writeText(formatted).then(() => {
      this.copiedFeedback = true;
      setTimeout(() => (this.copiedFeedback = false), 3000);
    });
  }

  printReport(): void {
    if (!this.report) {
      if (typeof window !== 'undefined') window.print();
      return;
    }

    // Generate clean corporate PDF document view via InterviewReportService
    const reportData = this.reportService.createReportData({
      userName: this.report.candidateName,
      roleOrSkill: `${this.report.jobTitle} (${this.report.roundType})`,
      overallScore: this.report.overallScore,
      summaryFeedback: this.report.summaryFeedback,
      strengths: this.report.strengths,
      improvementAreas: this.report.areasForImprovement,
    });

    this.reportService.downloadPdfReport(reportData);
  }

  startNewInterview(): void {
    this.router.navigate(['/interviewer-studio']);
  }
}
