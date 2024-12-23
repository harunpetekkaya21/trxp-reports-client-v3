import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
    // {
    //   path: '',
    //   loadComponent: () =>
    //     import('.').then(m=>m.DashboardComponent),
    //     // data:{preload:'true'}
    // },
    // {
    //   path: 'users',
    //   loadComponent: () =>
    //     import('./users/users.component').then(m => m.UsersComponent),
    // },
    // {
    //   path: 'reports',
    //   loadChildren: () =>
    //     import('./reports/reports.routes').then(m => m.REPORTS_ROUTES),
    //     // data:{preload:'true'}
    // },
    {
      path: 'reservations',
      loadChildren: () =>
        import('./reservations/reservations.routes').then(m => m.RESERVATIONS_ROUTES),
        // data:{preload:'true'}
    },
    // {
    //   path: 'uploads',
    //   loadChildren: () =>
    //     import('./files/uploads/uploads.routes').then(m => m.UPLOAD_ROUTES),
    //     // data:{preload:'true'}
    // },
  ];
