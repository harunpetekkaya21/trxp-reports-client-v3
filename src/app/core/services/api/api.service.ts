import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private setHeaders(customHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (customHeaders) {
      Object.keys(customHeaders).forEach((key) => {
        headers = headers.set(key, customHeaders[key]);
      });
    }

    return headers;
  }

  get<T>(url: string, params?: { [key: string]: string | number }, headers?: { [key: string]: string }): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    const httpHeaders = this.setHeaders(headers);

    return this.http
      .get<T>(url, { params: httpParams, headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    const httpHeaders = this.setHeaders(headers);

    return this.http
      .post<T>(url, body, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    const httpHeaders = this.setHeaders(headers);

    return this.http
      .put<T>(url, body, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, headers?: { [key: string]: string }): Observable<T> {
    const httpHeaders = this.setHeaders(headers);

    return this.http
      .delete<T>(url, { headers: httpHeaders })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
