import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FileService } from '../../../../../core/services/api/file.service';
import { FileListDTO } from '../../../../../core/models/file/file-list/FileListDTO';
import { FileStatus } from '../juniper-excel/juniper-excel.component';
import * as XLSX from 'xlsx';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-cache-flow-excel',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, FileUploadModule, AccordionModule, ProgressBarModule, ProgressSpinnerModule, ToastModule, RadioButtonModule],
  providers: [MessageService],
  templateUrl: './cache-flow-excel.component.html',
  styleUrl: './cache-flow-excel.component.scss'
})
export class CacheFlowExcelComponent {
  @ViewChild('fileUpload') fileUpload: FileUpload | undefined; // PrimeNG FileUpload bileşenine erişim
  fileList: any[] = [];
  files: any[] = [];

  selectedFile: File | null = null; // Seçilen dosyayı saklamak için
  cacheFlowType!: string;
  // Desteklenen sütunlar
  requiredColumns = ['Booking Code', 'Description', 'Booking Date', 'Travel Start', 'Travel End', 'Balance due'];

  constructor(
    private messageService: MessageService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.loadUploadedFiles();
  }



  // Dosya seçme işlemi
  onFileSelect(event: any): void {
    this.selectedFile = event.files[0]; // Seçilen dosyayı sakla
    console.log('Dosya seçildi:', this.selectedFile?.name);
  }

  // Dosya yükleme işlemi
  onUpload(event: any): void {
    if (!this.selectedFile) {
      alert('Lütfen bir dosya seçin.');
      return;
    }

    let fileName = this.selectedFile.name;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const customerSupplier = excelData[0]?.[0] || 'Unknown';
        const reportStartDate = this.excelDateToJSDate(excelData[1]?.[0]) || 'Unknown';
        const reportEndDate = this.excelDateToJSDate(excelData[2]?.[0]) || 'Unknown';
        const tableHeaders = excelData[3];
        const tableData = excelData.slice(4);

        const records = tableData.map(row => {
          const record: any = {};
          tableHeaders.forEach((header: string, index: number) => {
            if (header === 'Booking Date' || header === 'Travel Start' || header === 'Travel End') {
              record[header] = this.excelDateToJSDate(row[index]) || null;
            } else if (header === 'Balance due') {
              record[header] = row[index] ? parseFloat(row[index]) : 0;
            } else {
              record[header] = row[index] || null;
            }
          });
          return record;
        });

        const payload = {
          customerSupplier,
          reportStartDate,
          reportEndDate,
          records
        };

        ///console.log('Payload hazırlanıyor:', payload);

        // FileService ile yükleme işlemi

        if (this.cacheFlowType == "Customer") {
          this.fileService.uploadCacheFlowCustomerExcelData(fileName, payload).subscribe({
            next: (res) => {
              alert('Dosya basariyla yuklendi!');
              this.onClear(); // Yükleme tamamlandığında dosyaları temizle
            },
            error: (err) => { alert('Dosya yuklenirken hata olustu: ' + err.message); this.onClear(); }

          });
        }
        if (this.cacheFlowType == "Supplier") {
          this.fileService.uploadCacheFlowSupplierExcelData(fileName, payload).subscribe({
            next: (res) => {
              alert('Dosya basariyla yuklendi!');
              this.onClear(); // Yükleme tamamlandığında dosyaları temizle
            },
            error: (err) => { alert('Dosya yuklenirken hata olustu: ' + err.message); this.onClear(); }
          });
        }


      } catch (error) {
        alert('Dosya işlenirken bir hata oluştu.');
        this.onClear();
        console.error(error);
      }
    };

    reader.readAsArrayBuffer(this.selectedFile); // Seçilen dosyayı okuyarak yüklemeye başla
  }

  // Excel tarihini Date formatına dönüştür
  excelDateToJSDate(excelDate: any): string | null {
    if (!excelDate) return null;
  
    // Eğer tarih bir sayıysa (Excel Serial Date)
    if (!isNaN(excelDate)) {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      return date.toISOString(); // ISO 8601 formatında döner
    }
  
    // Eğer tarih string ise (örneğin "31/01/2025")
    if (typeof excelDate === 'string') {
      const parts = excelDate.split('/'); // Tarihi parçala
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript'te ay 0'dan başlar
        const year = parseInt(parts[2], 10);
  
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }
  
    // Eğer tarih geçerli değilse
    console.error('Invalid date format:', excelDate);
    return null;
  }
  
  

  // Seçilen dosyaları temizleme
  onClear(): void {
    if (this.fileUpload) {
      this.fileUpload.clear(); // Dosya listesini temizle
    }
    this.selectedFile = null; // Seçili dosyayı da temizle
    console.log('Seçilen dosyalar temizlendi.');
  }

  loadUploadedFiles(): void {
    this.fileService.getCacheFlowFiles().subscribe({
      next: (response) => {
        console.log(response);

        this.fileList = response;

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
