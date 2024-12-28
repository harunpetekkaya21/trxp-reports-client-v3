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
import { AccordionModule } from 'primeng/accordion';

import * as XLSX from 'xlsx';
import { FileService } from '../../../../../core/services/api/file.service';
import { FileListDTO } from '../../../../../core/models/file/file-list/FileListDTO';


export interface FileList {
  name: string,
  uploadedDate: string
}

export interface FileStatus {
  file: File;
  status: 'Pending' | 'Completed';
}
@Component({
  selector: 'app-sejour-excel',
  standalone: true,
  imports: [AccordionModule, FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, HttpClientModule, CommonModule, FormsModule, TableModule, TagModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './sejour-excel.component.html',
  styleUrl: './sejour-excel.component.scss'
})
export class SejourExcelComponent {
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
        this.loading = true;

        // Backend'e tüm veriyi gönder
        this.fileService.uploadSejourExcelData(fileName, data).subscribe({
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
            "İlk Kayıt Tarihi",
            "Operatör Adı",
            "Voucher",
            "Otel Adı",
            "Giriş Tarihi",
            "Çıkış Tarihi",
            "Gün",
            "Yetişkin",
            "Çocuk",
            "Bebek",
            "Total Alış Fat.",
            "Alış Dövizi",
            "Total Satış Fat.",
            "Satış Dövizi",
            "İntern Notu"
          ];

          // Eksik kolon kontrolü
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            const errorMessage = `Eksik kolonlar: ${missingColumns.join(', ')}`;
            this.messageService.add({
              severity: 'error',
              summary: 'Eksik Kolon Hatası',
              detail: errorMessage
            });
            reject(new Error(errorMessage));
            return;
          }

          // Boş satırları filtrele (başlık hariç)
          // const filteredData = rawData.slice(1).filter((row: any[]) => {
          //   // En az bir hücre dolu mu?
          //   return row.some(value => value !== null && value !== undefined && value !== "");
          // });
          const filteredData = rawData.slice(1).filter((row: any[]) => {
            // Satırda en az bir dolu hücre varsa true döner
            return row && row.some(value => value !== null && value !== undefined && value.toString().trim() !== "");
          });

          // Verileri dönüştür
          const formattedData = filteredData.map((row: any[]) => {
            const rowData: any = {};

            requiredColumns.forEach((col) => {
              const index = headers.indexOf(col);
              const value = row[index];

              // Tarih kolonları
              if (["İlk Kayıt Tarihi", "Giriş Tarihi", "Çıkış Tarihi"].includes(col)) {
                rowData[col] = value ? this.convertExcelDate(value) : null;
              }
              // Sayısal kolonlar
              else if (["Gün", "Yetişkin", "Çocuk", "Bebek", "Total Alış Fat.", "Total Satış Fat."].includes(col)) {
                rowData[col] = (value !== null && value !== undefined && value !== "") ? parseFloat(value) : 0;
              } else {
                // Diğer kolonlar
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

  loadUploadedFiles(): void {
    this.fileService.getAllFiles().subscribe({
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

  convertExcelDate(excelSerialDate: number): Date {
    try {
      const excelEpoch = new Date(Date.UTC(1900, 0, 1));
      const days = Math.floor(excelSerialDate) - 2; // Excel 1900 bug'ı
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const fractionalDay = excelSerialDate % 1; // Kesirli gün kısmı
      const millisecondsForFractionalDay = fractionalDay * millisecondsPerDay;

      return new Date(excelEpoch.getTime() + days * millisecondsPerDay + millisecondsForFractionalDay);
    } catch (error) {
      console.error('Tarih dönüşüm hatası:', error);
      return null;
    }
  }


}
