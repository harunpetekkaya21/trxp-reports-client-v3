import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./dashboard/dashboard.component').then(m=>m.DashboardComponent),
        // data:{preload:'true'}
    },
    // {
    //   path: 'users',
    //   loadComponent: () =>
    //     import('./users/users.component').then(m => m.UsersComponent),
    // },
   
  ];
