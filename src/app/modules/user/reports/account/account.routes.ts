import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
 
 
  {
    path: 'cache-flow',
    loadComponent: () =>
      import('./cache-flow/cache-flow.component').then(
        m => m.CacheFlowComponent
      ),
 
  },
  
  
];