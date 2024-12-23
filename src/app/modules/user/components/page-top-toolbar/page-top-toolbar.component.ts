import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';


@Component({
  selector: 'app-page-top-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, TooltipModule, ToolbarModule],
  
  templateUrl: './page-top-toolbar.component.html',
  styleUrl: './page-top-toolbar.component.scss'
})
export class PageTopToolbarComponent {
  providerLabel: string = 'Juniper'; // Varsayılan gösterim
  fileReportDate: Date = new Date(); // Örnek tarih
  fileReportDateTooltip = 'Rapor tarihi görüntülenemez';

  private providerMap = {
    0: 'All',
    1: 'Juniper',
    2: 'Sejour',
  };

  ngOnInit(): void {
    this.updateProviderLabel();

    // LocalStorage'daki değişiklikleri dinleyin
    window.addEventListener('storage', () => {
      this.updateProviderLabel();
    });
  }

  private updateProviderLabel(): void {
    const providerValue = Number(localStorage.getItem('provider')) || 1; // Varsayılan Juniper
    this.providerLabel = this.providerMap[providerValue] || 'Unknown';
  }
}
