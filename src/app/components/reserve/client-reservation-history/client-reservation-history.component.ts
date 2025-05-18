import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';

import { ReserveService } from '../../../services/reserve/reserve.service';
import { ClientSessionService } from '../../../services/clients/client-session.service';


import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/clients/client.model';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-client-reservation-history',
  standalone: true,
  templateUrl: './client-reservation-history.component.html',
  styleUrls: ['./client-reservation-history.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ]
})
export class ClientReservationHistoryComponent implements OnInit {
  client!: Client;
  clientReserves: Reserve[] = [];
  displayedColumns: string[] = ['vehicle', 'pickup', 'dropoff', 'price', 'status'];

  constructor(
    private reserveService: ReserveService,
    private sessionService: ClientSessionService,
    private router: Router,
    private vehicleService: VehicleService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedClient = this.sessionService.getClient();
    if (!storedClient) {
      console.warn('Cliente no logueado o inválido');
      return;
    }

    this.client = storedClient;

    this.reserveService.getReserves().subscribe({
      next: (reserves: Reserve[]) => {
        this.clientReserves = reserves.filter(
          r => r.idClient === String(this.client.id)
        );

        // Obtener el nombre del vehículo por cada reserva
        this.clientReserves.forEach(res => {
          this.vehicleService.getVehicle(String(res.idVehicle)).subscribe({
            next: veh => {
              res.vehicleName = `${veh.brand} ${veh.model}`;
              this.cdRef.detectChanges(); 
            },
            error: err => {
              console.warn(`Vehículo no encontrado para ID ${res.idVehicle}`, err);
              res.vehicleName = 'Desconocido';
              this.cdRef.detectChanges();
            }
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      }
    });
  }

  /** Botón para volver al perfil */
  goBackToProfile(): void {
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/client/profile']);
    } else {
      this.router.navigate(['/client/login']);
    }
  }
}
