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
@Component({
  selector: 'app-cache-flow',
  standalone: true,
  imports: [DropdownModule, CommonModule,FieldsetModule,TableModule,RadioButtonModule,FormsModule,ButtonModule,ChipModule,TagModule],
  templateUrl: './cache-flow.component.html',
  styleUrl: './cache-flow.component.scss'
})
export class CacheFlowComponent implements OnInit {


  supplierList: Supplier[] = [];
  selectedSupplier: Supplier;

  customerList: Customer[] = [];
  selectedCustomer: Customer;


  selectedCacheFlowType: string | null = null;

  dateList:any[]=[];
  selectedDate:any;
   sayi: number = 42;
  totalCustomer=`Total Customer: ${this.sayi}`;
  totalSupplier=`Total Supplier: ${this.sayi}`;
  totalBalanceDue=`Total Balance Due: ${1589}`;
  


  constructor(private supplierService:SupplierService,private customerService:CustomerService,private cd: ChangeDetectorRef){}


  ngOnInit(): void {

    this.loadSuppliers();
    this.loadCustomers();
    this.loadDates();
 
  }

  loadSuppliers():void{
    this.supplierService.getSupplierS().subscribe({
      next: (data) => (this.supplierList = data),
      error: (err) => console.error('Error loading room types:', err)
    });
  }

  loadCustomers():void{
    this.customerService.getCustomers().subscribe({
      next: (data) => (this.customerList = data),
      error: (err) => console.error('Error loading room types:', err)
    });
  }

  loadDates(){
    this.dateList=[
      {date:"01.01.2025-30.01.2025"},
      {date:"01.02.2025-30.02.2025"},
      {date:"01.03.2025-30.03.2025"},
      {date:"01.04.2025-30.04.2025"},
      {date:"01.05.2025-30.05.2025"},
    
    ]
  }

  getData(){

  }

  resetSelections(){
    console.log('Reset fonksiyonu çağrıldı');
    this.selectedCacheFlowType = undefined;
    this.selectedSupplier = null;
    this.selectedCustomer = null;
    this.selectedDate = null;
    this.cd.detectChanges(); // Değişiklikleri bildiriyoruz.
  }
}
