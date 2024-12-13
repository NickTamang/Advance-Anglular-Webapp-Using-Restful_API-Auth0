import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'my-items',
    loadComponent: () =>
      import('./components/my-items/my-items.component').then((m) => m.MyItemsComponent),
  },
];
