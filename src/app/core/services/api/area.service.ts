
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { ErrorModel } from '../../models/errors/ErrorModel';
import { catchError, Observable, throwError } from 'rxjs';
import { GroupByAreaDtoResponse } from '../../models/area/GroupByAreaDtoResponse';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AreaService {

  //private readonly baseUrl = 'https://localhost:7201/api/areas';
  private readonly baseUrl = environment.apiUrl;
    constructor(private http:HttpClient) { }
  
    // ReservationDate'e göre gruplama yapan API
  
    getReservationsGroupedByArea(
      orderBy: string = 'TotalSalesPrice',
      status: string = 'Ok',
      descending: boolean = true,
      page: number = 0,
      pageSize: number = 10,
      
    ): Observable<GroupByAreaDtoResponse> {
      const params = new HttpParams()
        .set('orderBy', orderBy)
        .set('descending', descending.toString())
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('status', status);
  
      return this.http.get<GroupByAreaDtoResponse>(`${this.baseUrl}/areas/sales-report`, { params }).pipe(
        catchError((error: HttpErrorResponse) => {
          const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
          return throwError(() => parsedError);
        })
      );
    }
}
