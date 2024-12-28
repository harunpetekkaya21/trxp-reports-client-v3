import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { FileService } from '../../../../../core/services/api/file.service';
import { FileListDTO } from '../../../../../core/models/file/file-list/FileListDTO';
import { AccordionModule } from 'primeng/accordion';
import * as XLSX from 'xlsx';

export interface FileList {
  fileName: string,
  created: string
}

export interface FileStatus {
  file: File;
  status: 'Pending' | 'Completed';
}

@Component({
  selector: 'app-juniper-excel',
  standalone: true,
  imports: [AccordionModule,FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, HttpClientModule, CommonModule, FormsModule, TableModule, TagModule,ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './juniper-excel.component.html',
  styleUrl: './juniper-excel.component.scss'
})
export class JuniperExcelComponent {
loading: boolean = false;
  fileList: FileListDTO[] = [];
  files: FileStatus[] = [];
  uploadProgress: number = 0;
  processedData: any[] = []; // İşlenmiş Excel verisi
  maxFileSize: number = 5 * 1024 * 1024; // Maksimum dosya boyutu (5 MB)

  chunkIndex: number = 0; // O anki chunk
  totalChunks: number = 0; // Toplam chunk sayısı
  sentDataCount: number = 0; // Gönderilen toplam veri

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.loadUploadedFiles();
  }


  onTemplatedUpload(): void {
    if (!this.files || this.files.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No files selected.'
      });
      return;
    }

    const file = this.files[0].file;
    const fileName = this.generateUniqueFileName(file.name);

    this.loading = true;

    this.readExcel(file)
      .then((data) => {
        if (data.length > 1000) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Verileriniz parça parça yükleniyor, lütfen bekleyiniz...'
          });
                 
        setTimeout(() => {
          this.loading = true; 
          this.uploadInChunks(fileName, data,true);
        }, 0); 
          //this.uploadInChunks(fileName, data,true);
        } else {
          this.uploadToApi(fileName, data);
        }
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to process the Excel file: ${error.message}`
        });
      }).finally(() => {
        this.loading = false; 
      });
  }

  uploadInChunks(fileName: string, data: any[], isFirstChunk: boolean): void {
    const chunkSize = 1000; // Her chunk'ta gönderilecek veri miktarı
    this.totalChunks = Math.ceil(data.length / chunkSize); // Toplam chunk sayısını hesapla
    this.chunkIndex = 0; // İlk chunk'ı başlat
    this.sentDataCount = 0; // Gönderilen veri miktarını sıfırla
  
    const uploadChunk = (chunk: any[], isFirst: boolean) => {
      this.loading = true; // Spinner'ı aç
      this.fileService.uploadJuniperExcelData(fileName,isFirst, chunk).subscribe({
        next: () => {
          this.chunkIndex++; // Gönderilen chunk sayısını artır
          this.sentDataCount += chunk.length; // Gönderilen veri sayısını artır

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Parça ${this.chunkIndex}/${this.totalChunks} başarıyla yüklendi.`
          });
  
          if (this.chunkIndex < this.totalChunks) {
            const nextChunk = data.slice(this.chunkIndex * chunkSize, (this.chunkIndex + 1) * chunkSize);
            uploadChunk(nextChunk,false); // Bir sonraki chunk'ı gönder
          } else {
            this.loading = false; // Spinner'ı kapat
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Tüm veriler başarıyla yüklendi!'
            });
          }
        },
        error: (error) => {
          this.loading = false; // Spinner'ı kapat
          console.error(`Parça ${this.chunkIndex + 1} yüklenemedi:`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Parça ${this.chunkIndex + 1} yüklenemedi.`
          });
        }
      });
    };
  
    const firstChunk = data.slice(0, chunkSize);
    uploadChunk(firstChunk,isFirstChunk);// İlk chunk için isFirstChunk=true
  }


  readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // İlk sayfa
          const sheet = workbook.Sheets[sheetName];

          // Tüm verileri JSON olarak al (header:1 ile ilk satır başlık kabul edilir)
          const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // İlk satır başlıklar
          let headers = rawData[0] as string[];
          // Başlıklardaki sağ ve sol boşlukları temizle
          headers = headers.map(h => h?.trim());

          //console.log("Headers read from Excel:", headers);

          const requiredColumns = [
            "Booking code", "Date", "No. of nights", "Start date", "End date",
            "Supplier name", "Description", "Area name", "Sales Price",
            "Sales currency", "Cost price", "Net Cost price", "Cost currency",
            "Nationality", "Status by booking element", "No. of Rooms", "Agency", "Pax number"
          ];

          // Eksik kolon kontrolü
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            console.error("Missing columns:", missingColumns);
            reject(new Error(`Missing required columns: ${missingColumns.join(", ")}`));
            return;
          }

          // Boş satırları filtrele (başlık hariç)
          const filteredData = rawData.slice(1).filter((row: any[]) => {
            // En az bir hücre dolu mu?
            return row.some(value => value !== null && value !== undefined && value !== "");
          });

          // Verileri dönüştür
          const formattedData = filteredData.map((row: any[]) => {
            const rowData: any = {};

            requiredColumns.forEach((col) => {
              const index = headers.indexOf(col);
              const value = row[index];

             // Tarih kolonlarını dönüştür
             if (["Date", "Start date", "End date"].includes(col)) {
              rowData[col] = value ? this.convertExcelDate(value) : null;
            }
            // Sayısal kolonlar için dönüştür
            else if (["Sales Price", "Cost price", "Net Cost price"].includes(col)) {
              rowData[col] = value ? parseFloat(value) : 0;
            }
            // Diğer kolonlar
            else {
              rowData[col] = value ?? null;
            }
            });

            return rowData;
          });

          resolve(formattedData); // Formatlanmış veriyi döndür
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }



  uploadToApi(fileName: string, data: any[]): void {
    this.fileService.uploadJuniperExcelData(fileName,true, data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tüm veriler başarıyla yüklendi.'
        });
        this.loading = false; // Spinner durdur
      },
      error: (error) => {
      
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
        this.loading = false; // Spinner durdur
      }
    });
  }


  convertExcelDate(excelSerialDate: number): Date {
    // Excel'in başlangıç tarihi: 1 Ocak 1900
    const excelEpoch = new Date(Date.UTC(1900, 0, 1)); // UTC zaman diliminde 1 Ocak 1900
    const days = Math.floor(excelSerialDate) - 2; // Excel tarihlerinde 1900 yılı için kayma (leap year bug)
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Günlük milisaniye
    const fractionalDay = excelSerialDate % 1; // Günün kesirli kısmı
    const millisecondsForFractionalDay = fractionalDay * millisecondsPerDay;

    return new Date(excelEpoch.getTime() + days * millisecondsPerDay + millisecondsForFractionalDay);
  }


  

  loadUploadedFiles(): void {
    this.fileService.getAllFiles("Created","OK",true,0,5).subscribe({
      next: (response) => {
        this.fileList = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  choose(event: any, callback: Function): void {
    callback();
  }

  onSelectedFiles(event: any): void {
    this.files = event.currentFiles.map((file: File) => ({
      file,
      status: 'Pending',
    }));
  }


  formatSize(bytes: number): string {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onRemoveTemplatingFile(event: any, file: FileStatus, removeFileCallback: any, index: number): void {
    removeFileCallback(event, index);
    this.files.splice(index, 1);
  }

  private generateUniqueFileName(fileName: string): string {
    // Dosya uzantısını kaldır
    const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    
    // Rastgele kısa bir GUID oluştur ve ekle
    const shortGuid = Math.random().toString(36).substring(2, 8); // 6 karakterli GUID
    
    return `${fileNameWithoutExtension}-${shortGuid}`;
  }

}
