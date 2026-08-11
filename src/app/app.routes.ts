import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'aiinterview',
    loadComponent: () =>
      import('./feature/ai-interview/ai-interview-layout.component').then(
        (m) => m.AiInterviewLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/ai-interview/ai-dashboard/ai-interview').then(
            (m) => m.AiInterviewComponent,
          ),
      },
      {
        path: 'interview',
        loadComponent: () =>
          import('./feature/ai-interview/interview/interview.component').then(
            (m) => m.InterviewComponent,
          ),
      },
      {
        path: 'mock',
        loadComponent: () =>
          import('./feature/ai-interview/mock-interview/mock-interview.component').then(
            (m) => m.MockInterviewComponent,
          ),
      },
      {
        path: 'job-profile',
        loadComponent: () =>
          import('./feature/ai-interview/jobposting/create-interview.component').then(
            (m) => m.CreateInterviewComponent,
          ),
      },
    ],
  },
  {
    path: 'quiz',
    loadComponent: () => import('./feature/quiz-view/quiz-view').then((m) => m.QuizView),
  },
  {
    path: 'skills',
    loadComponent: () => import('./feature/skill-rate/skill-rate').then((m) => m.SkillRate),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./feature/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/login/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./feature/login/sign-up-component/sign-up-component').then((m) => m.SignUpComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./feature/login/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./feature/login/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'help',
    loadComponent: () => import('./feature/help/help.component').then((m) => m.HelpComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'interviewer-studio',
    loadComponent: () =>
      import('./feature/interviewer-studio/interviewer-studio-layout').then(
        (m) => m.InterviewerStudioLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/interviewer-studio/wizard/studio-wizard').then(
            (m) => m.StudioWizardComponent
          ),
      },
      {
        path: 'session',
        loadComponent: () =>
          import('./feature/interviewer-studio/copilot-session/copilot-session').then(
            (m) => m.CopilotSessionComponent
          ),
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./feature/interviewer-studio/candidate-report/candidate-report').then(
            (m) => m.CandidateReportComponent
          ),
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'candidate-view',
    loadComponent: () =>
      import('./feature/interviewer-studio/candidate-view/candidate-view').then(
        (m) => m.CandidateViewComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./feature/ai-interview/jobposting/create-interview.component').then(
        (m) => m.CreateInterviewComponent,
      ),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./feature/pricing/pricing.component').then((m) => m.PricingComponent),
  },
];
