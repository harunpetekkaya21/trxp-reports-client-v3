import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


export interface CacheFlow{
  id:number;
  reportStartDate:Date;
  reportEndtDate:Date;
  

}
@Injectable({
  providedIn: 'root'
})
export class CacheFlowService {

   private readonly baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }
  
  
  
  getCustomers(): Observable<Customer[]> {
      return of([
        { id:1, name: 'AURUM',paymentRule:'Aylik statement gonderilir.10 gun icinde odeme gelir' },
        { id:2, name: 'RATEHAWK',paymentRule:'Aylik statement gonderilir.20 gun icinde odeme gelir' },
        { id:3, name: 'FOR YOU TRAVEL',paymentRule:'Haftalik giris sonrasi odeme.Cuma gunu odemesi gerekir' },
        { id:4, name: 'JUMBO TRAVEL',paymentRule:'Aktif sozlesmesi yok' },
        { id:5, name: 'PAXIMUM',paymentRule:'Haftalik giris sonrasi odeme.Cuma gunu odemesi gerekir' },
        { id:6, name: 'PRIME TRAVEL',paymentRule:'Haftalik giris sonrasi odeme.Cuma gunu odemesi gerekir' },
        { id:7, name: 'BEDSOPIA',paymentRule:'Haftalik giris sonrasi odeme.Cuma gunu odemesi gerekir' },
        { id:8, name: 'TRAVELTINO',paymentRule:'Aylik statement gonderilir.25 gun icinde odeme gelir' },
        { id:9, name: 'WORLD 2 MEET',paymentRule:'Aylik statement gonderilir.21 gun icinde odeme gelir' },
        { id:10, name: 'WEBBEDS',paymentRule:'Aylik statement gonderilir.25 gun icinde odeme gelir' },
  
      ]);
    }
}
