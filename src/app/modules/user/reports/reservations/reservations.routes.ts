import { Routes } from '@angular/router';

export const RESERVATIONS_ROUTES: Routes = [
 
 
  {
    path: 'reservation-date',
    loadComponent: () =>
      import('./reservation-date/reservation-date.component').then(
        m => m.ReservationDateComponent
      ),
 
  },
  {
    path: 'agency',
    loadComponent: () =>
      import('./agency/agency.component').then(
        m => m.AgencyComponent
      ),
 
  },
  {
    path: 'area',
    loadComponent: () =>
      import('./area/area.component').then(
        m => m.AreaComponent
      ),
 
  },
  {
    path: 'hotel',
    loadComponent: () =>
      import('./hotel/hotel.component').then(
        m => m.HotelComponent
      ),
 
  },
  {
    path: 'nationality',
    loadComponent: () =>
      import('./nationality/nationality.component').then(
        m => m.NationalityComponent
      ),
 
  },
  {
    path: 'supplier',
    loadComponent: () =>
      import('./supplier/supplier.component').then(
        m => m.SupplierComponent
      ),
 
  },
  
];