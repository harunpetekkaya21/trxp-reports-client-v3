import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, NgModule } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgStyle,NgFor,NgIf,SkeletonModule,TagModule,ChipModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  constructor(){

  }
  ngOnInit(): void {
  
  }
}
