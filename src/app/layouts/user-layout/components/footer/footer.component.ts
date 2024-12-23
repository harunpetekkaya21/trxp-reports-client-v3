import { Component } from '@angular/core';

import { UserLayoutService } from '../../services/user.layout.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(public layoutService: UserLayoutService) { }
}
