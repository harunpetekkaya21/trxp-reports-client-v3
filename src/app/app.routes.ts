import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    loadChildren: () =>
      import('./modules/user/user.routes').then(m => m.USER_ROUTES)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('../../src/app/modules/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
    // data:{preload:'true'}
  },


];
