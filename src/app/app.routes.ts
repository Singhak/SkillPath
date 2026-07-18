import { Routes } from '@angular/router';
import { LoginComponent } from './feature/login/login-component/login-component';

export const routes: Routes = [
    {
        path: 'interview',
        loadComponent: () => import('./feature/interview/interview.component').then(m => m.InterviewComponent)
    },
    {
        path: 'quiz',
        loadComponent: () => import('./feature/quiz-view/quiz-view').then(m => m.QuizView)
    },
    {
        path: 'skills',
        loadComponent: () => import('./feature/skill-rate/skill-rate').then(m => m.SkillRate)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./feature/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: '',
        loadComponent: () => import('./feature/home/home-page/home-page').then(m => m.HomePageComponent)
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'sign-up',
        loadComponent: () => import('./feature/login/sign-up-component/sign-up-component').then(m => m.SignUpComponent)
    },
    {
        path:'create',
        loadComponent: () => import('./feature/jobposting/create-interview.component').then(m => m.CreateInterviewComponent)
    }
];
