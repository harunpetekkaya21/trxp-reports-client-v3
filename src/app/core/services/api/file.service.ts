import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { FileSingleRESPONSE } from '../../models/file/FileSingleRESPONSE';
import { Observable } from 'rxjs';
import { FileListRESPONSE } from '../../models/file/file-list/FileListRESPONSE';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private  baseUrl = environment.apiUrl;
  private apiUrlGetLastFile = `${this.baseUrl}/files/getLastFile`; 
  private apiUrlAllFiles = `${this.baseUrl}/files/get-all-files`; 

  private apiUrlUploadJuniperExcelData = `${this.baseUrl}/JuniperUploads/upload-juniper-excel-data`; 
  private apiUrlUploadSejourExcelData = `${this.baseUrl}/SejourUploads/upload-sejour-excel-data`; 

  constructor(private http:HttpClient) { }


  getLastFile(): Observable<FileSingleRESPONSE>{
    return this.http.get<FileSingleRESPONSE>(this.apiUrlGetLastFile);
  }

  getAllFiles():Observable<FileListRESPONSE>{
    return this.http.get<FileListRESPONSE>(this.apiUrlAllFiles);
  }


  // uploadJuniperFile(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrlUploadJuniperFile}`, formData);
  // }
  uploadSejourExcelData(fileName: string,isFirstChunk: boolean,data: any[]): Observable<any>{
    console.log(data);

    const headers = { 'Content-Type': 'application/json' };
    const params = new HttpParams().set('fileName', fileName).set('isFirstChunk', isFirstChunk.toString());
    const url = `${this.apiUrlUploadSejourExcelData}`; 

    return this.http.post(url, data,{headers,params});
  }

  uploadJuniperExcelData(fileName: string,isFirstChunk: boolean,data: any[]): Observable<any>{
    //console.log(data);

    const headers = { 'Content-Type': 'application/json' };
    const params = new HttpParams().set('fileName', fileName).set('isFirstChunk', isFirstChunk.toString());
    const url = `${this.apiUrlUploadJuniperExcelData}`; 

    return this.http.post(url, data,{headers,params});
  }


  // uploadJuniperExcelData(data: any[]): Observable<any> {
  //   console.log(data);
    
  //   const headers = { 'Content-Type': 'application/json' };
  //   const url = `${this.apiUrlUploadJuniperExcelData}`; 
  //   return this.http.post(url, data,{headers});
   
  // }


}
