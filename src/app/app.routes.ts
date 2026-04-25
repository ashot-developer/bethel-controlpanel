import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        // canActivate: [authGuard]
      },
      {
        path: 'youth',
        loadComponent: () => import('./features/bethel-youth/bethel-youth').then(m => m.BethelYouth),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
