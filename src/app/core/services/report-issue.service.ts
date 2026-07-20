import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportIssue } from '../../shared/components/report-issue/report-issue.model';
export interface ReportIssueConfig {
  title: string;
  issueTypes: string[];
  reportData: Partial<ReportIssue>;
}

@Injectable({
  providedIn: 'root',
})
export class ReportIssueService {
  private http = inject(HttpClient);
  private messanger = inject(MessageService);
  private readonly apiUrl = `${environment.apiUrl}/report-issues`;

  displayDialog = signal(false);
  isReporting = signal(false);
  report = signal<Partial<ReportIssue>>({});
  config = signal<Partial<ReportIssueConfig>>({});


  showDialog(config: ReportIssueConfig) {
    this.config.set(config);
    this.report.set({
      issueType: config.issueTypes[0] as ReportIssue['issueType'],
      description: '',
      ...config.reportData,
    });
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.report.set({});
  }

  submitReport(report: ReportIssue) {
    this.isReporting.set(true);
    this.http
      .post(this.apiUrl, report)
      .pipe(finalize(() => this.isReporting.set(false)))
      .subscribe({
        next: () => {
          this.closeDialog();
          this.messanger.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Issue reported successfully!',
          });
        },
        error: (err) => {
          this.messanger.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to report issue. Please try again.',
          });
        },
      });
  }
}