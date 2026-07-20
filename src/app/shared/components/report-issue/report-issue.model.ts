export interface ReportIssue {
  userId: number;
  questionId?: number;
  issueType: string;
  description: string;
  status: 'Open' | 'Closed';
}
