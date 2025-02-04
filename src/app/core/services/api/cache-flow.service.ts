import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { ErrorModel } from '../../models/errors/ErrorModel';


export interface CacheFlowSupplierReportDatesDto{
  reportStartEndDate:string;
}
@Injectable({
  providedIn: 'root'
})
export class CacheFlowService {
  private baseUrl = environment.apiUrl;
  private apiUrlGetCustomers = `${this.baseUrl}/CacheFlows/get-customers`;
  private apiUrlGetSuppliers = `${this.baseUrl}/CacheFlows/get-suppliers`;

  private apiUrlGetCustomerDates = `${this.baseUrl}/CacheFlows/get-customers-dates`;
  private apiUrlGetSupplierDates = `${this.baseUrl}/CacheFlows/get-suppliers-dates`;


  
  private apiUrlGetCustomerCacheFlowReports = `${this.baseUrl}/CacheFlows/get-customer-cache-flow-reports`;
  private apiUrlGetSupplierCacheFlowReports = `${this.baseUrl}/CacheFlows/get-suplier-cache-flow-reports`;

  constructor(private http: HttpClient) { }



  getCustomers(): Observable<{data:any[],totalCount:number}> {

    return this.http.get<{data:any[],totalCount:number}>(this.apiUrlGetCustomers).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }

  getSuppliers(): Observable<{data:any[],totalCount:number}> {

    return this.http.get<{data:any[],totalCount:number}>(this.apiUrlGetSuppliers).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }

  getSupplierDates(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrlGetSupplierDates).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }

  getCustomerDates(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrlGetCustomerDates).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }


  getCustomersCacheFlowReports(customerId:number,reportDate:string): Observable<{data:any[],totalBalanceDue:number}> {
    const params = new HttpParams().set('customerId', customerId).set('reportsFullDate', reportDate)
    return this.http.get<{data:any[],totalBalanceDue:number}>(this.apiUrlGetCustomerCacheFlowReports, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }

  
  getSuppliersCacheFlowReports(supplierId:number,reportDate:string): Observable<{data:any[],totalBalanceDue:number}> {
    const params = new HttpParams().set('supplierId', supplierId).set('reportsFullDate', reportDate)
    return this.http.get<{data:any[],totalBalanceDue:number}>(this.apiUrlGetSupplierCacheFlowReports, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );

  }
}
