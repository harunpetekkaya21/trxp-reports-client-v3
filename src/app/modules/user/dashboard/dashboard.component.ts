import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { ReservationService } from '../../../core/services/api/reservation.service';
import { ReservationSummaryDto } from '../../../core/models/reservation-summary/ReservationSummaryDto';
import { ReservationSummaryResponse } from '../../../core/models/reservation-summary/ReservationSummaryResponse';
import { MonthlyReportsRESPONSE } from '../../../core/models/monthly-report/MonthlyReportsRESPONSE';
import { MonthlyReportsDTO } from '../../../core/models/monthly-report/MonthlyReportsDTO';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SkeletonModule,TagModule,ChipModule,BadgeModule,ChartModule,VirtualScrollerModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Özeti göstermek için veriler
  totalReservations: number = 0;
  totalSalesPrice: number = 0;
  totalNetCostPrice: number = 0;


  


 monthlySales: MonthlyReportsDTO[] = [];


  // Pie Chart Data
  reservationPieData: any;
  pieOptions: any;

  // Bar Chart Data
  barData: any;
  barOptions: any;
  constructor(private reservationService:ReservationService) {}

  ngOnInit(): void {
    this.loadReservationSummary();
  
    this.loadMonthlySales();
  }

   // Özet verileri yükle
   loadReservationSummary() {
   

     this.reservationService.getReservationsSummary().subscribe({
          next: (response: ReservationSummaryResponse) => {
            this.totalReservations = response.data.totalReservations;
            this.totalSalesPrice = response.data.totalSalesPrice;
            this.totalNetCostPrice = response.data.totalNetCostPrice;

            this.prepareSummeryCharts();
           // this.loadingService.setLoading(false);
          },
          error: (error) => {
            // this.messageService.add({
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: error.message || 'Failed to load reservations.',
            // });
            // this.loadingService.setLoading(false);
          },
        });
  }

  // Aylık Satış Verilerini Hazırla
  loadMonthlySales() {
    this.reservationService.getAManthlyReservations().subscribe({
      next: (response: MonthlyReportsRESPONSE) => {
       
       this.monthlySales=response.data;
        
        this.prepareMonthlySalesChart();
       // this.loadingService.setLoading(false);
      },
      error: (error) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.message || 'Failed to load reservations.',
        // });
        // this.loadingService.setLoading(false);
      },
    });
  }

  
  prepareSummeryCharts() {
    this.reservationPieData = {
      labels: ['Toplam Rezervasyonlar', 'Sales Price', 'Net Cost Price'],
      datasets: [
        {
          data: [this.totalReservations, this.totalSalesPrice, this.totalNetCostPrice],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'], // Colors
        },
      ],
    };
    this.pieOptions = {
      plugins: {
        legend: {
          position: 'top',
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Aspect Ratio korunur
      aspectRatio:1,
    };


  }

  prepareMonthlySalesChart(){
    
 const labels = this.monthlySales.map((item) => item.month);
    const salesData = this.monthlySales.map((item) => item.totalSalesPrice);
    const costData = this.monthlySales.map((item) => item.totalNetCostPrice);
    const resData = this.monthlySales.map((item) => item.totalReservations);

    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Sales Price',
          backgroundColor: '#42A5F5',
          data: salesData,
        },
        {
          label: 'Net Cost Price',
          backgroundColor: '#FFA726',
          data: costData,
        },
        {
          label: 'Reservations',
          backgroundColor: '#FFA726',
          data: resData,
        },
      ],
    };
  

    this.barOptions = {
      plugins: {
        legend: {
          position: 'top',
        },
      },
      responsive: true,
    };
  }
}
