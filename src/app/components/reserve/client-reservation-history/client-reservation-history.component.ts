import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';

import { ReserveService } from '../../../services/reserve/reserve.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service'; // ✅ CAMBIO: reemplazo del ClientSessionService
import { ClientService } from '../../../services/clients/client.service';        // ✅ CAMBIO: obtener cliente por ID desde backend
import { VehicleService } from '../../../services/vehicle/vehicle.service';

import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/clients/client.model';

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
    private authService: AuthServiceService,     // CAMBIO: accede al token JWT
    private clientService: ClientService,        // CAMBIO: consulta al backend
    private router: Router,
    private vehicleService: VehicleService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getIdToken(); // CAMBIO: obtiene ID desde el token
    if (!clientId) {
      this.authService.removeAuthToken();           // CAMBIO: limpia token si no es válido
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getClientById(clientId).subscribe({ // CAMBIO: obtiene datos del cliente desde API
      next: (storedClient: Client) => {
        if (!storedClient || !storedClient.status) {
          this.authService.removeAuthToken();
          this.router.navigate(['/client/login']);
          return;
        }

        this.client = storedClient;

        this.reserveService.getReserves().subscribe({
          next: (reserves: Reserve[]) => {
            this.clientReserves = reserves.filter(
              r => r.idClient === storedClient.id // CAMBIO: comparación directa entre number y number , Cambie el Modelo de IdClient a tipo number
            );

            this.clientReserves.forEach(res => {
              this.vehicleService.getVehicle(Number(res.idVehicle)).subscribe({
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
          error: err => {
            console.error('Error al cargar reservas:', err);
          }
        });
      },
      error: () => {
        this.authService.removeAuthToken();
        this.router.navigate(['/client/login']);
      }
    });
  }

  goBackToProfile(): void {
    this.router.navigate(['/client/profile']);
  }
}
