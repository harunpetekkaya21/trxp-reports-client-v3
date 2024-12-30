import { Component } from '@angular/core';
import { PageTopToolbarComponent } from '../../../components/page-top-toolbar/page-top-toolbar.component';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DailyByDateReservationDto } from '../../../../../core/models/reservation-daily/DailyByDateReservationDto';
import { DailyByDateReservationResponse } from '../../../../../core/models/reservation-daily/DailyByDateReservationResponse';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [PageTopToolbarComponent,ChartModule,CalendarModule,FormsModule,CommonModule,ToastModule,TableModule],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.scss',
  providers: [MessageService]
})

export class DailyComponent {
  selectedDate: Date | null = null;
  reservations: DailyByDateReservationDto;

  chartData: any; // Grafik verisi
  chartOptions: any; // Grafik seçenekleri

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initChart();
  }

  onDateSelect(): void {
    if (!this.selectedDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a date.',
      });
      return;
    }

    const formattedDate = this.selectedDate.getFullYear() + '-' +
    String(this.selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(this.selectedDate.getDate()).padStart(2, '0');

    console.log('Formatted Date:', formattedDate);

 this.reservationService.getDailyReservations(formattedDate).subscribe({
      next: (response: DailyByDateReservationResponse) => {
        this.reservations = response.data;

        if (response.data.totalNetCostPrice==0 && response.data.totalSalesPrice==0 && response.data.totalReservations==0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Reservations',
            detail: `No reservations found for ${formattedDate}.`,
          });
          
        }
        //console.log(response.data);
        
        // this.totalRecords = response.totalCount;
        this.updateChartData(response.data);
        // this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Reservation Not Found.',
        });
        //this.loadingService.setLoading(false);
      },
    });

    // this.reservationService.getDailyReservations(formattedDate).subscribe({
    //   next: (response: any[]) => {
    //     if (!response || response.length === 0) {
    //       this.reservations = [];
    //       this.messageService.add({
    //         severity: 'info',
    //         summary: 'No Reservations',
    //         detail: `No reservations found for ${formattedDate}.`,
    //       });
    //     } else {
    //       this.reservations = response;
    //       console.log(response);
          
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Reservations Found',
    //         detail: `${response.length} reservations found for ${formattedDate}.`,
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     this.reservations = [];
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'An error occurred while fetching reservations.',
    //     });
    //     console.error('API Error:', err);
    //   },
    // });
  }

  updateChartData(data: DailyByDateReservationDto): void {
    if (!data) {
      console.error('Data is null or undefined:', data);
      this.chartData = null;
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Data',
        detail: 'The received data is not valid.',
      });
      return;
    }
  
    // Grafik için X ekseni etiketleri ve veri setlerini ayarla
    this.chartData = {
      labels: ['Reservation Count', 'Total Sales Price', 'Total Net Cost Price'], // X ekseni etiketleri
      datasets: [
        {
          label: 'Daily Summary', // Seri etiketi
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'], // Çubuk renkleri
          data: [
            data.totalReservations, // Rezervasyon sayısı
            data.totalSalesPrice,   // Toplam satış fiyatı
            data.totalNetCostPrice, // Toplam maliyet fiyatı
          ],
        },
      ],
    };
  }
  
  
  
  initChart(): void {
    this.chartData = {
      labels: ['Reservation Count', 'Total Sales Price', 'Total Net Cost Price'], // X ekseni etiketleri
      datasets: [
        {
          label: 'Daily Summary',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'], // Çubuk renkleri
          data: [0, 0, 0], // Başlangıç değerleri
        },
      ],
    };
  
    this.chartOptions = {
      plugins: {
        legend: {
          display: true, // Legend gösterilsin
          position: 'top',
          labels: {
            color: '#495057',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          beginAtZero: true, // Y ekseni sıfırdan başlasın
          
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }
  
  

}
