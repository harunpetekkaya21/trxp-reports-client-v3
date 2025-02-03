import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { FileSingleRESPONSE } from '../../models/file/FileSingleRESPONSE';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { FileListRESPONSE } from '../../models/file/file-list/FileListRESPONSE';
import { environment } from '../../../../environments/environment';
import { ErrorHandler } from '../../helpers/ErrorHandler';
import { ErrorModel } from '../../models/errors/ErrorModel';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = environment.apiUrl;
  private apiUrlJuniperGetLastFile = `${this.baseUrl}/files/getJuniperLastFile`;
  private apiUrlSejourGetLastFile = `${this.baseUrl}/files/getSejourLasFile`;
  private apiUrlAllFiles = `${this.baseUrl}/files/get-all-files`;

  private apiUrlUploadJuniperExcelData = `${this.baseUrl}/JuniperUploads/upload-juniper-excel-data`;
  private apiUrlUploadSejourExcelData = `${this.baseUrl}/SejourUploads/upload-sejour-excel-data`;
  private apiUrlUploadCacheFlowExcelData = `${this.baseUrl}/AccountUploads/upload-cache-flow-data`;

  constructor(private http: HttpClient) { }


  getJuniperLastFile(): Observable<FileSingleRESPONSE> {
    return this.http.get<FileSingleRESPONSE>(this.apiUrlJuniperGetLastFile);
  }

  getSejourLastFile(): Observable<FileSingleRESPONSE> {
    return this.http.get<FileSingleRESPONSE>(this.apiUrlSejourGetLastFile);
  }


  getAllFiles(
    orderBy: string = 'Created',
    status: string = 'OK',
    descending: boolean = true,
    page: number = 0,
    pageSize: number = 2,
  ): Observable<FileListRESPONSE> {
    const params = new HttpParams()
      .set('orderBy', orderBy)
      .set('descending', descending.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('status', status);
    return this.http.get<FileListRESPONSE>(this.apiUrlAllFiles, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const parsedError: ErrorModel = ErrorHandler.parseHttpError(error);
        return throwError(() => parsedError);
      })
    );
  }


  // uploadJuniperFile(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrlUploadJuniperFile}`, formData);
  // }
  uploadSejourExcelData(fileName: string, data: any[]): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrlUploadSejourExcelData}`;

    return this.http.post(url, data, { headers, params }).pipe(
        timeout(2700000),//45 dk timeout
        catchError((error) => {
            if (error.name === 'TimeoutError') {
                console.error('API isteği zaman asimina uğradı.');
                return throwError(() => new Error('Zaman asimi: Sunucu yanit vermiyor.'));
            } else {
                console.error('API isteği hatasi:', error);
                return throwError(() => error);
            }
        })
    );
}

  uploadJuniperExcelData(fileName: string, data: any[]): Observable<any> {
    //console.log(data);

  
    const params = new HttpParams().set('fileName', fileName);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrlUploadJuniperExcelData}`;

    return this.http.post(url, data, { headers, params }).pipe(
      timeout(2700000),//45 dk timeout
      catchError((error) => {
          if (error.name === 'TimeoutError') {
              console.error('API isteği zaman asimina uğradı.');
              return throwError(() => new Error('Zaman asimi: Sunucu yanit vermiyor.'));
          } else {
              console.error('API isteği hatasi:', error);
              return throwError(() => error);
          }
      })
  );
  }

  uploadCacheFlowExcelData(fileName: string, data: any[]): Observable<any>{
    const params = new HttpParams().set('fileName', fileName);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrlUploadCacheFlowExcelData}`;

    return this.http.post(url, data, { headers, params }).pipe(
      timeout(2700000),//45 dk timeout
      catchError((error) => {
          if (error.name === 'TimeoutError') {
              console.error('API isteği zaman asimina uğradı.');
              return throwError(() => new Error('Zaman asimi: Sunucu yanit vermiyor.'));
          } else {
              console.error('API isteği hatasi:', error);
              return throwError(() => error);
          }
      })
  );
  }


  // uploadJuniperExcelData(data: any[]): Observable<any> {
  //   console.log(data);

  //   const headers = { 'Content-Type': 'application/json' };
  //   const url = `${this.apiUrlUploadJuniperExcelData}`; 
  //   return this.http.post(url, data,{headers});

  // }


}
