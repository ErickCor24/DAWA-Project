import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/clients/client.model';
import { Vehicle } from '../../../models/Vehicle';
import { Agency } from '../../../models/agency';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { switchMap } from 'rxjs/operators';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthServiceService } from '../../../services/auth/auth-service.service'; // ✅ CAMBIO: reemplaza ClientSessionService
import { ClientService } from '../../../services/clients/client.service';         // ✅ CAMBIO: para obtener cliente desde backend

@Component({
  standalone: true,
  selector: 'app-list-reserve',
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  templateUrl: './list-reserve.component.html',
  styleUrl: './list-reserve.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ListReserveComponent implements OnInit {
  allReserves: Reserve[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  agencies: Agency[] = [];
  displayedColumns = [
    'vehicle',
    'agency',
    'pickupDate',
    'dropoffDate',
    'price',
    'status',
    'actions'
  ];
  filter: 'all' | 'active' | 'done' = 'all';

  constructor(
    private reserveService: ReserveService,
    private http: HttpClient,
    private dialogService: DialogService,
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthServiceService,    // CAMBIO: se usa JWT para acceder al cliente
    private clientService: ClientService        // CAMBIO: cliente se valida desde API
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getIdToken(); //  CAMBIO: obtener ID del cliente desde el token
    if (!clientId) {
      this.authService.removeAuthToken();           // CAMBIO: limpiar token si no existe
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getClientById(clientId).subscribe({ // CAMBIO: validar cliente vía backend
      next: client => {
        if (!client || !client.status) {
          this.authService.removeAuthToken();
          this.router.navigate(['/client/login']);
          return;
        }

        this.reserveService.getReserves().subscribe(r => {
          this.allReserves = r.filter(x => x.idClient === client.id); //  CAMBIO: comparación directa entre números

          this.allReserves.forEach(res => {
            this.vehicleService.getVehicle(Number(res.idVehicle)).subscribe(veh => {
              res['vehicleName'] = `${veh.brand} ${veh.model}`;
            });
          });
        });

        this.http.get<Agency[]>('http://localhost:3000/agencys') //debes cambiar a el endppoint que le corresponde
          .subscribe(a => this.agencies = a);
      },
      error: () => {
        this.authService.removeAuthToken();
        this.router.navigate(['/client/login']);
      }
    });
  }

  get filteredReserves(): Reserve[] {
    if (this.filter === 'active') return this.allReserves.filter(r => r.status);
    if (this.filter === 'done') return this.allReserves.filter(r => !r.status);
    return this.allReserves;
  }

  onFilterChange(value: 'all' | 'active' | 'done') {
    this.filter = value;
  }

  getVehicleName(id: string): string {
    const v = this.vehicles.find(x => x.id === Number(id));
    return v ? `${v.brand} ${v.model}` : 'Desconocido';
  }

  getAgencyName(id: number): string {
    const a = this.agencies.find(x => x.id === id);
    return a ? a.name : 'Desconocido';
  }

  getStatusLabel(r: Reserve): string {
    return r.status ? 'Activo' : 'Realizado';
  }

  canModify(r: Reserve): boolean {
    if (!r.status) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pickup = new Date(r.pickupDate);
    pickup.setHours(0, 0, 0, 0);

    return pickup > today;
  }

  deleteReserve(resId: string, vehId: number): void {
    this.dialogService.openDialog(
      'Eliminar reserva',
      '¿Seguro quieres eliminar esta reserva?',
      () => {
        this.vehicleService.getVehicle(vehId).pipe(
          switchMap(veh => {
            const updatedVeh = { ...veh, isAvailable: true };
            return this.vehicleService.updateVehicle(updatedVeh);
          }),
          switchMap(() => this.reserveService.deleteReserve(resId))
        ).subscribe({
          next: () => {
            this.allReserves = this.allReserves.filter(r => r.id !== resId);
          },
          error: err => console.error('Error en eliminación:', err)
        });
      }
    ).subscribe();
  }

  editReserve(reserveId: string): void {
    this.router.navigate(['/reserve/update', reserveId]);
  }

  goToSelectVehicle(): void {
    this.router.navigate(['/vehicle/view-client-vehicles']);
  }
}
