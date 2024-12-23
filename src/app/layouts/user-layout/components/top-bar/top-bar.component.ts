import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { UserLayoutService } from '../../services/user.layout.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    standalone: true,
    imports: [NgClass,NgIf,AsyncPipe,FormsModule,DropdownModule],
    
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.scss',
    providers: [MessageService]
})
export class TopBarComponent implements OnInit {

    loggedIn$: Observable<boolean>;
    
    items: MenuItem[] | undefined;

    providers = [
        { label: 'All', value: 0 },
        { label: 'Juniper', value: 1 },
        { label: 'Sejour', value: 2 }
      ];

      private readonly DEFAULT_PROVIDER = 1; // Varsayılan Juniper
      private readonly PROVIDER_KEY = 'Provider';
      selectedProvider: number;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: UserLayoutService, private router: Router,private localStorageService: LocalStorageService,private authService: AuthService) 
    { 

        this.loggedIn$ = this.authService.loggedIn$;
    // localStorage kontrolü ve provider okuma
    const storedProvider = this.localStorageService.getItem('Provider');
    this.selectedProvider = storedProvider ? Number(storedProvider) : 1;



    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    ngOnInit() {
        this.ensureDefaultProvider();

        // <!-- without sublink -->
        // {
        //     label: 'Programmatic',
        //     icon: 'pi pi-link',
        //     command: () => {
        //         this.router.navigate(['/installation']);
        //     }
        // },
        // <!-- without sublink -->
        this.items = [

            {
                label: 'Facilities',
                icon: 'pi pi-building',
                items: [
                    {
                        label: 'Facility List',
                        icon: 'pi pi-list',
                        route: 'facility/facility-list'

                    },
                    {
                        label: 'Create Facility',
                        icon: 'pi pi-plus-circle',
                        route: 'facility/facility-create'


                    },



                ]
            },
            {
                label: 'Rooms',
                icon: 'pi pi-image',
                items: [
                    {
                        label: 'Room List',
                        icon: 'pi pi-list',
                        route: 'room/room-list'

                    },
                    {
                        label: 'Create Room ',
                        icon: 'pi pi-plus-circle',
                        route: 'room/room-create'

                    },

                ]
            },
            // {
            //     label: 'Contracts',
            //     icon: 'pi pi-file-edit',
            //     items: [
            //         {
            //             label: 'Contract List',
            //             icon: 'pi pi-list',

            //         },
            //         {
            //             label: 'Create Contract ',
            //             icon: 'pi pi-plus-circle',

            //         },

            //     ]
            // },

            {
                label: 'Menu 1',
                icon: 'pi pi-home'
            },
            {
                label: 'Menu 2',
                icon: 'pi pi-home',
                route: '/home'
            },

        ];
    }

    onProviderChange(event: any): void {
        const selectedValue = event.value;
    
        // Provider'ı kaydet
        this.localStorageService.setItem('Provider', selectedValue.toString());
        console.log(`Provider değişti: ${selectedValue}`);
      }

      private ensureDefaultProvider(): void {
        try {
          const storedProvider = localStorage.getItem(this.PROVIDER_KEY);
    
          if (!storedProvider) {
            // Varsayılan olarak Juniper'ı (1) ayarla
            localStorage.setItem(this.PROVIDER_KEY, this.DEFAULT_PROVIDER.toString());
            //console.log(`Varsayılan provider ayarlandı: ${this.DEFAULT_PROVIDER}`);
          }
        } catch (error) {
          console.error('localStorage kullanilamiyor:', error);
          alert('localStorage kullanilamiyor:')
        }
      }
}


// {
//     label: 'Contact',
//     icon: 'pi pi-envelope',
//     badge: '3'
// }

// {
//     label: 'Projects',
//     icon: 'pi pi-search',
//     items: [
//         {
//             label: 'Core',
//             icon: 'pi pi-bolt',
//             shortcut: '⌘+S'
//         },
//         {
//             label: 'Blocks',
//             icon: 'pi pi-server',
//             shortcut: '⌘+B'
//         },
//         {
//             label: 'UI Kit',
//             icon: 'pi pi-pencil',
//             shortcut: '⌘+U'
//         },
//         {
//             separator: true
//         },
//         {
//             label: 'Templates',
//             icon: 'pi pi-palette',
//             items: [
//                 {
//                     label: 'Apollo',
//                     icon: 'pi pi-palette',
//                     badge: '2'
//                 },
//                 {
//                     label: 'Ultima',
//                     icon: 'pi pi-palette',
//                     badge: '3'
//                 }
//             ]
//         }
//     ]
// },