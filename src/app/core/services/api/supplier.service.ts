import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupBySupplierResponse } from '../../models/supplier/GroupBySupplierResponse';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { ErrorModel } from '../../models/errors/ErrorModel';
import { environment } from '../../../../environments/environment';
export interface Supplier {
  id: number;
  name: string;
  paymentRule: string;

}
@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }



  getReservationsGroupedBySupplier(
    orderBy: string = 'TotalSalesPrice',
    status: string = 'Ok',
    descending: boolean = true,
    page: number = 0,
    pageSize: number = 10,

  ): Observable<GroupBySupplierResponse> {
    const params = new HttpParams()
      .set('orderBy', orderBy)
      .set('descending', descending.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('status', status);

    return this.http.get<GroupBySupplierResponse>(`${this.baseUrl}/suppliers/sales-report`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );
  }


  getSupplierS(): Observable<Supplier[]> {
    return of([
      { id:1, name: 'AKAY TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:2, name: 'ANIXIE TRAVEL',paymentRule:'Fatura gonderildikten 14 gun sonra odemesi gerceklestirilir.' },
      { id:3, name: 'BIRDIE HOLIDAYS',paymentRule:'Giris oncesi odeme' },
      { id:4, name: 'CUBA VENTURE TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:5, name: 'CYPRUS ROYAL TOURISM',paymentRule:'Giris oncesi odeme' },
      { id:6, name: 'DANAOS TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:7, name: 'ECC TOUR',paymentRule:'Giris oncesi odeme' },
      { id:8, name: 'HI FOURS TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:9, name: 'JOYCE TOUR',paymentRule:'Giris oncesi odeme' },
      { id:10, name: 'MTS TOUR',paymentRule:'Giris oncesi odeme' },
      { id:11, name: 'ODEON TOUR',paymentRule:'Giris oncesi odeme' },
      { id:12, name: 'SKYMAX HOLIDAYS',paymentRule:'Depozitolu giris oncesi odeme' },
      { id:13, name: 'SMILE PRIME TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:14, name: 'SUMMER TOUR',paymentRule:'Giris oncesi odeme' },
      { id:15, name: 'SUNDANCE TRAVEL',paymentRule:'Giris oncesi odeme' },
      { id:16, name: 'YOUR WORLD TRAVEL',paymentRule:'Giris oncesi VCC odeme' },
      

    ]);
  }
}
