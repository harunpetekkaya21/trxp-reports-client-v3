import { Component, OnInit } from '@angular/core';

import { MenuItemComponent } from './menu-item/menu-item.component';
import { NgFor, NgIf } from '@angular/common';
import { UserLayoutService } from '../../services/user.layout.service';


@Component({
    standalone: true,
    imports: [MenuItemComponent,NgIf,NgFor],
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: UserLayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [''] }
                ]
            },

            // {
            //     label: '',
            //     icon: '',
            //     items: [

            //         {
            //             label: 'Reports',
            //             icon: 'pi  pi-calendar',
            //             items: [
            //                 {
            //                     label: 'Rate Check',
            //                     icon: 'pi pi-calendar',
            //                     items: [

            //                         {
            //                             label: 'Winter',
            //                             icon: 'pi pi-book',
            //                             routerLink: ['/facility/facility-create']
            //                         },
            //                         {
            //                             label: 'Summer',
            //                             icon: 'pi pi-book',
            //                             routerLink: ['/facility/facility-create']
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Sales',
            //                     icon: 'pi pi-calendar',
            //                     items: [

            //                         {
            //                             label: 'Winter',
            //                             icon: 'pi pi-book',
            //                             routerLink: ['/facility/facility-create']
            //                         },
            //                         {
            //                             label: 'Summer',
            //                             icon: 'pi pi-book',
            //                             routerLink: ['/facility/facility-create']
            //                         }
            //                     ]
            //                 },

            //             ]
            //         },

            //     ]
            // },
            {
                label: 'Reports',
                icon: '',
                items: [

                    {
                        label: 'Reservations',
                        icon: '',
                        items: [
                           
                            {
                                label: 'Daily ',
                                icon: '',
                                routerLink: ['reports/reservations/daily']
                            },
                            {
                                label: 'Reservation Dates ',
                                icon: '',
                                routerLink: ['reports/reservations/reservation-date']
                            },
                            {
                                label: 'Agencies',
                                icon: '',
                                routerLink: ['reports/reservations/agency']
                            },
                            {
                                label: 'Areas',
                                icon: '',
                                routerLink: ['reports/reservations/area']
                            },
                            {
                                label: 'Hotels',
                                icon: '',
                                routerLink: ['reports/reservations/hotel']
                            },
    
                            {
                                label: 'Suppliers',
                                icon: '',
                                routerLink: ['reports/reservations/supplier']
                            },
                           
                            {
                                label: 'Nationalities',
                                icon: '',
                                routerLink: ['reports/reservations/nationality']
                            }
                            

                        ]
                    },

                ]
            },
            {
                label: 'Files',
                icon: '',
                items: [

                    {
                        label: 'Uploads',
                        icon: 'pi pi-file-import',
                        items: [
                            {
                                label: 'Upload Juniper Reservation Excel',
                                icon: 'pi pi-file-excel',
                                routerLink: ['uploads/juniper-excel']
                            },
                            {
                                label: 'Upload Sejour Reservation Excel',
                                icon: 'pi pi-file-excel',
                                routerLink: ['uploads/sejour-excel']
                            }
                            

                        ]
                    },
                    

                ]
            },

            //   {
            //     label: '',
            //     icon: '',
            //     items: [

            //         {
            //             label: 'Rooms',
            //             icon: 'pi pi-fw pi-image',
            //             items: [
            //                 {
            //                     label: 'Room List',
            //                     icon: 'pi pi-fw pi-list',
            //                     routerLink: ['/room/room-list']
            //                 },
            //                 {
            //                     label: 'Create New Room',
            //                     icon: 'pi pi-fw pi-plus-circle',
            //                     routerLink: ['/room/room-create']
            //                 },

            //             ]
            //         },

            //     ]
            // },

            // {
            //     label: '',
            //     icon: '',
            //     items: [

            //         {
            //             label: 'Contracts',
            //             icon: 'pi pi-fw pi-file-edit',
            //             items: [
            //                 {
            //                     label: 'Contract List',
            //                     icon: 'pi pi-fw pi-list',
            //                     routerLink: ['/contract/contract-create']
            //                 },
            //                 {
            //                     label: 'Create New Contract',
            //                     icon: 'pi pi-fw pi-plus-circle',
            //                     routerLink: ['/contract/contract-list']
            //                 },

            //             ]
            //         },

            //     ]
            // },

        ];
    }
}
