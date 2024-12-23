import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { ErrorModel } from '../../models/errors/ErrorModel';
import { catchError, Observable, throwError } from 'rxjs';
import { GroupByNationalityResponse } from '../../models/nationality/GroupByNationalityResponse';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NationalityService {

private readonly baseUrl = environment.apiUrl;
     constructor(private http:HttpClient) { }
   
    
   
     getReservationsGroupedByNationality(
       orderBy: string = 'TotalSalesPrice',
       status: string = 'Ok',
       descending: boolean = true,
       page: number = 0,
       pageSize: number = 10,
       
     ): Observable<GroupByNationalityResponse> {
       const params = new HttpParams()
         .set('orderBy', orderBy)
         .set('descending', descending.toString())
         .set('page', page.toString())
         .set('pageSize', pageSize.toString())
         .set('status', status);
   
       return this.http.get<GroupByNationalityResponse>(`${this.baseUrl}/nationalities/sales-report`, { params }).pipe(
         catchError((error: HttpErrorResponse) => {
           const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
           return throwError(() => parsedError);
         })
       );
     }
}
