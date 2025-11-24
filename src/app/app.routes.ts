import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './core/layout/main-layout';

export const routes: Routes = [
  // Public routes (no layout)
  {
    path: 'login',
    component: Login
  },
  // Protected routes (with main layout)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
    ]
  },
  // 404 fallback
  {
    path: '**',
    redirectTo: 'login'
  }
];
