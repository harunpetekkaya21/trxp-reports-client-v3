import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FileService } from '../../../../../core/services/api/file.service';
import { FileListDTO } from '../../../../../core/models/file/file-list/FileListDTO';
import { FileStatus } from '../juniper-excel/juniper-excel.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cache-flow-excel',
  standalone: true,
  imports: [CommonModule,FormsModule,TableModule,FileUploadModule,AccordionModule,ProgressBarModule,ProgressSpinnerModule,ToastModule],
  providers: [MessageService],
  templateUrl: './cache-flow-excel.component.html',
  styleUrl: './cache-flow-excel.component.scss'
})
export class CacheFlowExcelComponent {
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
        this.loading = true;

        // Backend'e tüm veriyi gönder
        this.fileService.uploadJuniperExcelData(fileName, data).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Excel data uploaded successfully.'
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Upload failed: ${err.message}`
            });
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      })
      .catch((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to read Excel file: ${error.message}`
        });
        this.loading = false;
      });
  }



  private readExcel(file: File): Promise<any[]> {
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
