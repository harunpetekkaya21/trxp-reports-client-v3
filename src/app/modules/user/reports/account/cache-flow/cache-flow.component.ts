import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Supplier, SupplierService } from '../../../../../core/services/api/supplier.service';
import { Customer, CustomerService } from '../../../../../core/services/api/customer.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { CacheFlowService, CacheFlowSupplierReportDatesDto } from '../../../../../core/services/api/cache-flow.service';


@Component({
  selector: 'app-cache-flow',
  standalone: true,
  imports: [DropdownModule, CommonModule, FieldsetModule, TableModule, RadioButtonModule, FormsModule, ButtonModule, ChipModule, TagModule],
  templateUrl: './cache-flow.component.html',
  styleUrl: './cache-flow.component.scss'
})
export class CacheFlowComponent implements OnInit {


  supplierList: any[] = [];
  selectedSupplier: any;

  customerList: any[] = [];
  selectedCustomer: any ;


  selectedCacheFlowType: string | null = "Customer";

  supplierDateList: CacheFlowSupplierReportDatesDto[] = [];
  selectedSupplierDate: CacheFlowSupplierReportDatesDto;


  customerDateList: CacheFlowSupplierReportDatesDto[] = [];
  selectedCustomerDate: CacheFlowSupplierReportDatesDto;

  sayi: number = 42;
  totalCustomer: any;
  totalSupplier: any;



  suppliersCacheFlowReports: any[] = [];
  customersCacheFlowReports: any[] = [];

  totalSupplierBalanceDue: any;

  totalCustomerBalanceDue: any;



  constructor(private cacheFlowService: CacheFlowService, private customerService: CustomerService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {

    this.loadSuppliers();
    this.loadCustomers();
    this.loadSupplierDates();
    this.loadCustomerDates();

    

  }

  loadSuppliers(): void {
    this.cacheFlowService.getSuppliers().subscribe({
      next: (result) => {
        this.supplierList = result.data;
        this.totalSupplier = result.totalCount;
        console.log(result.data);

      },
      error: (err) => console.error('Error loading supplierList:', err)
    });
  }

  loadCustomers(): void {
    this.cacheFlowService.getCustomers().subscribe({
      next: (result) => {
        this.customerList = result.data;
        this.totalCustomer = result.totalCount;
        console.log();

      },
      error: (err) => console.error('Error loading customerList:', err)
    });
  }

  loadSupplierDates() {
    this.cacheFlowService.getSupplierDates().subscribe({
      next: (result) => {
        this.supplierDateList = result
        console.log(this.supplierDateList);

      },
      error: (err) => console.error('Error loading customerList:', err)
    });
  }

  loadCustomerDates() {
    this.cacheFlowService.getCustomerDates().subscribe({
      next: (result) => {
        this.customerDateList = result;
        console.log(this.customerDateList);

      },
      error: (err) => console.error('Error loading customerList:', err)
    });
  }

  getData() {
    console.log(this.selectedCustomerDate);
    console.log(this.selectedCacheFlowType);

    if (this.selectedCacheFlowType == "Customer") {
      this.cacheFlowService.getCustomersCacheFlowReports(this.selectedCustomer.id, this.selectedCustomerDate.reportStartEndDate).subscribe({
        next: (result) => {
          console.log(result);

          this.customersCacheFlowReports = result.data;
          this.totalCustomerBalanceDue = result.totalBalanceDue;

        },
        error: (err) => console.error('Error loading customerList:', err)
      });
    }
    if (this.selectedCacheFlowType == "Supplier") {
      this.cacheFlowService.getSuppliersCacheFlowReports(this.selectedSupplier.id, this.selectedSupplierDate.reportStartEndDate).subscribe({
        next: (result) => {
          console.log(result);

          this.suppliersCacheFlowReports = result.data;
          this.totalSupplierBalanceDue = result.totalBalanceDue;

        },
        error: (err) => console.error('Error loading customerList:', err)
      });
    }

  }

  resetSelections() {
    console.log('Reset fonksiyonu çağrıldı');
    this.selectedCacheFlowType = undefined;
    this.selectedSupplier = null;
    this.selectedCustomer = null;

    this.cd.detectChanges(); // Değişiklikleri bildiriyoruz.
  }
}
