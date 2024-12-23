import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';


import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { LoadingService } from '../../../../../core/services/loading.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { GroupByNationalityDto } from '../../../../../core/models/nationality/GroupByNationalityDto';
import { NationalityService } from '../../../../../core/services/api/nationality.service';
import { GroupByNationalityResponse } from '../../../../../core/models/nationality/GroupByNationalityResponse';
import { FileService } from '../../../../../core/services/api/file.service';
import { PageTopToolbarComponent } from '../../../components/page-top-toolbar/page-top-toolbar.component';


@Component({
  selector: 'app-nationality',
  standalone: true,
  imports: [
      NgIf,
      CommonModule,
      ToastModule,
      ToolbarModule,
      TooltipModule,
      SkeletonModule,
      TableModule,
      ButtonModule,
      PaginatorModule,
      CalendarModule,
      ChartModule,
      PageTopToolbarComponent],
  templateUrl: './nationality.component.html',
  styleUrl: './nationality.component.scss',
  providers: [MessageService], // MessageService Toast için gerekli
})
export class NationalityComponent {
  skeletonBars = Array(8);//chart icin

  totalRecords: number = 0;
  first: number = 0;
  rows: number = 5;//tablodaki gosterilecek satir sayisi

  reservations: GroupByNationalityDto[] = [];

  chartData: any; // Grafik verisi
  chartOptions: any; // Grafik seçenekleri

  fileReportDate: Date | undefined;

  constructor(
    private nationalityService: NationalityService,
    private messageService: MessageService,
    public loadingService: LoadingService,
    private fileService:FileService
  ) { }



  ngOnInit(): void {
    this.initChart();

    this.loadInitialReservations();
  }
  initChart(): void {
    this.chartData = {
      labels: [], // Area isimleri
      datasets: [

        {
          label: 'Total Sales Price',
          backgroundColor: '#f29f05',
          data: [], // Toplam satış fiyatı
        },
        {
          label: 'Total Net Cost Price',
          backgroundColor: '#AB4459',
          data: [], // Toplam rezervasyonlar
        },

        {
          label: 'Total Nights',
          backgroundColor: '#1B1833',
          data: [],
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'top',
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Oranı serbest bırak
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


  loadInitialReservations() {
    this.loadingService.setLoading(true);


    this.nationalityService.getReservationsGroupedByNationality("TotalSalesPrice", "Ok", true, 0, 5).subscribe({
      next: (response: GroupByNationalityResponse) => {
        this.reservations = response.data;
        this.totalRecords = response.totalCount;
        this.updateChartData(response.data);
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load reservations.',
        });
        this.loadingService.setLoading(false);
      },
    });

  }

  loadReservations(event: TableLazyLoadEvent): void {

    this.loadingService.setLoading(true);
    const page = event.first! / event.rows!;
    const size = event.rows!;


    this.nationalityService.getReservationsGroupedByNationality("TotalSalesPrice", "Ok", true, page, size).subscribe({
      next: (response: GroupByNationalityResponse) => {
        this.reservations = response.data;
        this.totalRecords = response.totalCount;
        this.updateChartData(response.data);
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load reservations.',
        });
        this.loadingService.setLoading(false);
      },
    });
  }


  updateChartData(data: GroupByNationalityDto[]): void {
    this.chartData.labels = data.map((d) => d.nationalityName );
    this.chartData.datasets[0].data = data.map((d) => d.totalSalesPrice);
    this.chartData.datasets[1].data = data.map((d) => d.totalNetCostPrice);
    this.chartData.datasets[2].data = data.map((d) => d.totalNumberOfNights);
  }



}
