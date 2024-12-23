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
  
  
  
];