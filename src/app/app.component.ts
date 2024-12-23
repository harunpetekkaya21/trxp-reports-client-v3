import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TRIXPO.Reports.Client';
  constructor(private primengConfig: PrimeNGConfig) {
    
    
  }

  ngOnInit(): void {
    // PrimeNG genel Türkçe yerel ayarları
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: [
        'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
      ],
      dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
      dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
      monthNames: [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ],
      monthNamesShort: [
        'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
        'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
      ],
      today: 'Bugün',
      clear: 'Temizle',
      dateFormat: 'dd.mm.yy',
      weekHeader: 'Hf',
    });
  }
}
