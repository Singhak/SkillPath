import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'quiz',
        loadComponent: () => import('./feature/quiz-view/quiz-view').then(m => m.QuizView)
    },
    {
        path: '',
        loadComponent: () => import('./feature/dashboard/dashboard').then(m => m.Dashboard)

    }
];
