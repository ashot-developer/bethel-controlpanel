import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  // Public routes (no layout)
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login)
  },
  // Protected routes (with main layout)
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
      },
    ]
  },
  // 404 fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];
