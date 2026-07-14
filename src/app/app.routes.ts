import { Routes } from '@angular/router';

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
        path: '',
        loadComponent: () => import('./feature/dashboard/dashboard').then(m => m.Dashboard)

    }
];
