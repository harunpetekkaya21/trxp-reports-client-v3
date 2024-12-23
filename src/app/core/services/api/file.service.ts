import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FileSingleRESPONSE } from '../../models/file/FileSingleRESPONSE';
import { catchError, Observable, throwError } from 'rxjs';
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
    pageSize: number = 5,
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
  uploadSejourExcelData(fileName: string, isFirstChunk: boolean, data: any[]): Observable<any> {
    //console.log(data);

    const headers = { 'Content-Type': 'application/json' };
    const params = new HttpParams().set('fileName', fileName).set('isFirstChunk', isFirstChunk.toString());
    const url = `${this.apiUrlUploadSejourExcelData}`;

    return this.http.post(url, data, { headers, params });
  }

  uploadJuniperExcelData(fileName: string, isFirstChunk: boolean, data: any[]): Observable<any> {
    //console.log(data);

    const headers = { 'Content-Type': 'application/json' };
    const params = new HttpParams().set('fileName', fileName).set('isFirstChunk', isFirstChunk.toString());
    const url = `${this.apiUrlUploadJuniperExcelData}`;

    return this.http.post(url, data, { headers, params });
  }


  // uploadJuniperExcelData(data: any[]): Observable<any> {
  //   console.log(data);

  //   const headers = { 'Content-Type': 'application/json' };
  //   const url = `${this.apiUrlUploadJuniperExcelData}`; 
  //   return this.http.post(url, data,{headers});

  // }


}
