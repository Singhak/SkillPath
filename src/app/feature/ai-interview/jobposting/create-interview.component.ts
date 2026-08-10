import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AiApiService } from '../../../core/services/apis/ai-api.service';
import { catchError, finalize, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {
  createDownloadLink,
  EXPERIENCE_LEVELS,
  INTERVIEW_STEPS,
  USER_ROLES,
} from '../../../shared/constants';
import { InterviewQuestion } from '../../../core/models/interview-question.model';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { UserResourceService } from '../../../core/services/user-resource.service';
import { AuthService } from '../../../core/services/auth.service';
import { ResumeParserService } from '../../../core/services/resume-parser.service';
import { JobFitService, JobFitResult } from '../../../core/services/job-fit.service';

type UploadMode = 'text' | 'upload';

@Component({
  selector: 'app-create-interview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TextareaModule,
    TabsModule,
    ProgressSpinnerModule,
    TagModule,
    Panel,
    FormsModule,
    TableModule,
    AutoComplete,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './create-interview.component.html',
})
export class CreateInterviewComponent implements OnInit {
  messageService = inject(MessageService);
  readonly router = inject(Router);
  private readonly userResourceService = inject(UserResourceService);
  readonly authService = inject(AuthService);
  readonly resumeService = inject(ResumeParserService);
  readonly jobFitService = inject(JobFitService);

  readonly userRoles = USER_ROLES;
  readonly experienceLevels = EXPERIENCE_LEVELS;
  readonly stepstoFollow = INTERVIEW_STEPS;

  questionCountOptions = [5, 10, 15, 20];
  aiApiService = inject(AiApiService);
  private readonly destroyRef = inject(DestroyRef);

  mode = signal<UploadMode>('text');
  loading = signal(false);
  isAnalyzingFit = signal(false);
  jobFitResult = signal<JobFitResult | null>(null);

  selectedFile = signal<File | null>(null);

  // Properties to hold filtered suggestions
  filteredExperienceLevels: string[] = [];
  filteredUserRoles: string[] = [];

  technicalQuestions: any[] = [];
  behaviouralQuestions: any[] = [];
  scenarioQuestions: any[] = [];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      jobDescription: ['', Validators.required],
      userRole: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      questionCount: [5, Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.resumeService.parsedResume()) {
      this.resumeService.loadSavedResume();
    }
  }

  get estimatedCredits(): string {
    const count = parseInt(this.form.get('questionCount')?.value, 10) || 5;
    return ((count * 0.20) + 1).toFixed(2);
  }

  navigateToPricing(): void {
    this.router.navigate(['/pricing']);
  }

  changeMode(mode: UploadMode) {
    this.mode.set(mode);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile.set(file);

    // Auto extract text if uploading JD file
    this.resumeService.parseResumeFile(file).then(res => {
      if (res.rawTextPreview) {
        this.form.patchValue({ jobDescription: res.rawTextPreview });
        this.analyzeJobFit();
      }
    }).catch(() => {});
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  analyzeJobFit() {
    const { jobDescription, userRole, experienceLevel } = this.form.getRawValue();
    if (!jobDescription || !jobDescription.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Job Description Required',
        detail: 'Please paste or write a Job Description to analyze your job fit.',
      });
      return;
    }

    this.isAnalyzingFit.set(true);

    setTimeout(() => {
      const candidateResume = this.resumeService.parsedResume();
      const result = this.jobFitService.calculateJobFit(
        jobDescription,
        candidateResume,
        userRole,
        experienceLevel
      );

      this.jobFitResult.set(result);
      this.isAnalyzingFit.set(false);

      // Auto fill role / experience if blank
      if (!userRole && candidateResume?.suggestedRoles?.[0]) {
        this.form.patchValue({ userRole: candidateResume.suggestedRoles[0] });
      }
      if (!experienceLevel && candidateResume?.experienceLevel) {
        this.form.patchValue({ experienceLevel: candidateResume.experienceLevel });
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Job Fit Analysis Complete',
        detail: `Calculated Fit Score: ${result.fitScore}% (${result.verdict})`,
      });
    }, 400);
  }

  generateQuestions() {
    if (this.authService.currentPlan() === 'Silver') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Upgrade Required',
        detail: 'Job Profile Evaluation requires at least the Copper plan. Please upgrade your plan to access this feature.',
      });
      this.navigateToPricing();
      return;
    }

    if (this.mode() === 'text' && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.jobFitResult()) {
      this.analyzeJobFit();
    }

    this.loading.set(true);

    const { jobDescription, userRole, experienceLevel, questionCount } = this.form.getRawValue();

    this.aiApiService
      .generateFromJobDescription(jobDescription, userRole, experienceLevel, questionCount)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || err.error?.error || 'Failed to generate questions. Please try again.',
          });
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result: any) => {
        const questions = result?.['questions'] ?? [];
        this.technicalQuestions = questions.filter((q: any) => q.type === 'technical');
        this.behaviouralQuestions = questions.filter((q: any) => q.type === 'behavioral');
        this.scenarioQuestions = questions.filter((q: any) => q.type === 'scenario');
        this.userResourceService.fetchCreditsAndCoins().subscribe({ error: () => {} });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${questions.length} Questions generated successfully`,
        });
      });
  }

  /**
   * Filters experience levels or user rolesbased on the user's query.
   * It also includes the query itself as a suggestion to allow custom values.
   * @param event The autocomplete complete event.
   * @param list the list on which filter apply
   * @param category type of filer on experience level or userRole
   */

  search(event: AutoCompleteCompleteEvent, list: string[], category: string) {
    const query = event.query;
    let filtered: string[] = [];

    // Filter predefined types
    if (list) {
      filtered = list.filter((type) => type.toLowerCase().includes(query.toLowerCase()));
    }

    // Add the custom query to the suggestions if it's not already there
    if (query && !filtered.some((type) => type.toLowerCase() === query.toLowerCase())) {
      filtered.unshift(query);
    }
    if (category == 'experienceLevel') this.filteredExperienceLevels = filtered;
    else if (category == 'userRole') this.filteredUserRoles = filtered;
  }

  getSeverity(level: string): 'success' | 'warn' | 'danger' | 'info' {
    if (!level) return 'info';
    const l = level.toLowerCase();
    if (l.includes('easy') || l.includes('basic') || l.includes('beginner')) return 'success';
    if (l.includes('medium') || l.includes('intermediate')) return 'warn';
    if (l.includes('hard') || l.includes('advanced') || l.includes('expert')) return 'danger';
    return 'info';
  }

  practiceGeneratedQuestions() {
    const questions = this.getAllGeneratedQuestions();

    if (!questions.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'Generate questions first before practicing them.',
      });
      return;
    }

    this.router.navigate(['/aiinterview/interview'], {
      state: { generatedQuestions: questions },
      queryParams: { generatedQuestions: JSON.stringify(questions) },
    });
  }

  takeMockInterview() {
    const questions = this.getAllGeneratedQuestions();

    if (!questions.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'Generate questions first before starting a mock interview.',
      });
      return;
    }

    this.router.navigate(['/aiinterview/mock'], {
      state: { generatedQuestions: questions },
      queryParams: { generatedQuestions: JSON.stringify(questions) },
    });
  }

  exportSingleCategoryAsCsv(category: 'Technical' | 'Behavioural' | 'Scenario' | 'All') {
    let data: any[] = [];
    if (category === 'Technical') data = this.technicalQuestions;
    if (category === 'Behavioural') data = this.behaviouralQuestions;
    if (category === 'Scenario') data = this.scenarioQuestions;
    if (category === 'All')
      data = [...this.technicalQuestions, ...this.behaviouralQuestions, ...this.scenarioQuestions];

    if (data.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'No questions to export.',
      });
      return;
    }

    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = ['question', 'level'];
    const csv = data.map((row: any) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = createDownloadLink(url, `${category.toLowerCase()}-questions.csv`);
    link.click();
    document.body.removeChild(link);
  }

  private getAllGeneratedQuestions(): InterviewQuestion[] {
    return [...this.technicalQuestions, ...this.behaviouralQuestions, ...this.scenarioQuestions]
      .filter((question): question is InterviewQuestion => Boolean(question?.question))
      .map((question, index) => ({
        ...question,
        id: question.id ?? index + 1,
      }));
  }
}
