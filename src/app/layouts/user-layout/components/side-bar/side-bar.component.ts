import { Component, ElementRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { UserLayoutService } from '../../services/user.layout.service';

@Component({
  standalone: true,
  imports: [
    MenuComponent
  ],
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  constructor(public layoutService: UserLayoutService, public el: ElementRef) { }
}
