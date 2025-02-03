import { Routes } from '@angular/router';

export const UPLOAD_ROUTES: Routes = [
  {
    path: 'juniper-excel',
    loadComponent: () =>
      import('./juniper-excel/juniper-excel.component').then(
        m => m.JuniperExcelComponent
      ),
   
  },
  {
    path: 'sejour-excel',
    loadComponent: () =>
      import('./sejour-excel/sejour-excel.component').then(
        m => m.SejourExcelComponent
      ),
   
  },
  {
    path: 'cache-flow-excel',
    loadComponent: () =>
      import('./cache-flow-excel/cache-flow-excel.component').then(
        m => m.CacheFlowExcelComponent
      ),
   
  },
  
  
  
];