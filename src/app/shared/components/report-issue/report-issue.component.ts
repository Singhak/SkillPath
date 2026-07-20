import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ReportIssueService } from '../../../core/services/report-issue.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReportIssue } from './report-issue.model';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, SelectModule, TextareaModule],
  templateUrl: './report-issue.component.html',
})
export class ReportIssueComponent {
  reportIssueService = inject(ReportIssueService);
  authService = inject(AuthService);
  messanger = inject(MessageService);

  displayDialog = this.reportIssueService.displayDialog;
  report = this.reportIssueService.report;
  isReporting = this.reportIssueService.isReporting;
  config = this.reportIssueService.config;

  submitReport() {
    const currentReport = this.report();
    if (!currentReport.description?.trim() || !currentReport.issueType) {
      this.messanger.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Issue Type and Description are required.',
      });
      return;
    }

    const finalReport: ReportIssue = {
      questionId: currentReport.questionId,
      issueType: currentReport.issueType,
      description: currentReport.description,
      userId: Number(this.authService.currentUser()?.id),
      status: 'Open',
    };

    this.reportIssueService.submitReport(finalReport);
  }

  closeDialog() {
    this.reportIssueService.closeDialog();
  }
}
