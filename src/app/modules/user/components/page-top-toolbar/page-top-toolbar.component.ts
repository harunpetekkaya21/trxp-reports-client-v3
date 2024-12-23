import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { FileService } from '../../../../core/services/api/file.service';


@Component({
  selector: 'app-page-top-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, TooltipModule, ToolbarModule],
  
  templateUrl: './page-top-toolbar.component.html',
  styleUrl: './page-top-toolbar.component.scss'
})
export class PageTopToolbarComponent {
  providerLabel: string = 'Juniper'; // Varsayılan gösterim
  JuniperFileReportDate: Date; // Örnek tarih
  SejourFileReportDate: Date; // Örnek tarih
  fileReportDateTooltip = 'Rapor tarihi görüntülenemez';

  private providerMap = {
    0: 'All',
    1: 'Juniper',
    2: 'Sejour',
  };

  /**
   *
   */
  constructor(private fileService: FileService) {
    
    
  }

  ngOnInit(): void {
    this.updateProviderLabel();

    this.getJuniperLastFileDate();
    this.getSejourLastFileDate();
    // LocalStorage'daki değişiklikleri dinleyin
    window.addEventListener('storage', () => {
      this.updateProviderLabel();
    });
  }

  getJuniperLastFileDate() {
    this.fileService.getJuniperLastFile().subscribe({
      next: (response) => {

        this.JuniperFileReportDate = this.formatDate(response.data.created);
        
      },
      error: (error) => {

      }
    })
  }

  getSejourLastFileDate() {
    this.fileService.getSejourLastFile().subscribe({
      next: (response) => {

        this.SejourFileReportDate = this.formatDate(response.data.created);
        
      },
      error: (error) => {

      }
    })
  }

  formatDate(dateString: string): Date {
    const date = new Date(dateString);
    const day = date.getDate(); // Gün
    const month = date.getMonth(); // Ay (0 tabanlı)
    const year = date.getFullYear(); // Yıl
    const hours=date.getHours();
    const minute = date.getMinutes();
    //return `${day}.${month}.${year}`;
    return new Date(year, month, day,hours,minute);
  }

  private updateProviderLabel(): void {
    const providerValue = Number(localStorage.getItem('Provider')); 
    this.providerLabel = this.providerMap[providerValue] || 'Unknown';
  }
}
