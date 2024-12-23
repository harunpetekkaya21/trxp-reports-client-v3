import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GroupByReservationDateResponse } from '../../models/reservation-date/GroupByReservationDateResponse';
import { ErrorModel } from '../../models/errors/ErrorModel';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { environment } from '../../../../environments/environment';
import { MonthlyReportsRESPONSE } from '../../models/monthly-report/MonthlyReportsRESPONSE';
import { ReservationSummaryResponse } from '../../models/reservation-summary/ReservationSummaryResponse';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl  = environment.apiUrl;
  constructor(private http:HttpClient) { }

  getReservationsSummary(
  ): Observable<ReservationSummaryResponse> {
  

    return this.http.get<ReservationSummaryResponse>(`${this.baseUrl}/Reservations/reservation-summary`);
  }

  getAManthlyReservations(
  ): Observable<MonthlyReportsRESPONSE> {
    return this.http.get<MonthlyReportsRESPONSE>(`${this.baseUrl}/reservations/monthly-report`);
  }

  getReservationsGroupedByDate(
    orderBy: string = 'ReservationDate',
    status: string = 'Ok',
    descending: boolean = true,
    page: number = 0,
    pageSize: number = 10,
    
  ): Observable<GroupByReservationDateResponse> {
    const params = new HttpParams()
      .set('orderBy', orderBy)
      .set('descending', descending.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('status', status);

    return this.http.get<GroupByReservationDateResponse>(`${this.baseUrl}/reservations/grouped-by-date`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );
  }
}





