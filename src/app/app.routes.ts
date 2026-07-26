import { Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login-component/login-component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
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
      // You can add more child routes here for practice, job-profile, etc.
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
    path: 'dashboard',
    loadComponent: () => import('./feature/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: '',
    // loadComponent: () =>
    //   import('./feature/home/home-page/home-page').then((m) => m.HomePageComponent),
    loadComponent: () => import('./feature/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./feature/login/sign-up-component/sign-up-component').then((m) => m.SignUpComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./feature/ai-interview/jobposting/create-interview.component').then(
        (m) => m.CreateInterviewComponent,
      ),
  },
];
