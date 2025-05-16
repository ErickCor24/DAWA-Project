import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/clients/client.model';
import { Vehicle } from '../../../models/vehicle';
import { Agency } from '../../../models/agency';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";
import { CommonModule } from '@angular/common';
import { ClientSessionService } from '../../../services/clients/client-session.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone:true,
  selector: 'app-list-reserve',
  imports: [ButtonComponent, CommonModule, FormsModule, MatTableModule, MatSelectModule,MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatFormFieldModule,],
  templateUrl: './list-reserve.component.html',
  styleUrl: './list-reserve.component.css'
})
export class ListReserveComponent implements OnInit {
   allReserves: Reserve[] = [];
  reserves: Reserve[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  agencies: Agency[] = [];
  displayedColumns: string[] = ['vehicle', 'agency', 'start', 'end', 'price', 'status', 'actions'];


  constructor(
    private reserveService: ReserveService,
    private http: HttpClient,
    private dialogService: DialogService,
    private router: Router,
    private session : ClientSessionService,
    private vehicleService : VehicleService,
  ) {}
  filter: 'all' | 'active' | 'done' = 'all';
   ngOnInit(): void {
    
   const client = this.session.getClient()!;
    this.reserveService.getReserves().subscribe(r => {
      // 1) Solo reservas de este cliente
      this.allReserves = r.filter(x => x.idClient === client.id);
    });

     this.http.get<Vehicle[]>('http://localhost:3000/vehicles')
      .subscribe(v => this.vehicles = v);
    this.http.get<Agency[]>('http://localhost:3000/agencys')
      .subscribe(a => this.agencies = a);
  }
 
  get filteredReserves(): Reserve[] {
    if (this.filter === 'active') {
      return this.allReserves.filter(r => r.status);
    }
    if (this.filter === 'done') {
      return this.allReserves.filter(r => !r.status);
    }
    return this.allReserves;
  }

  onFilterChange(value: 'all' | 'active' | 'done') {
    this.filter = value;
  }

  getVehicleName(id: string): string {
    const v = this.vehicles.find(x => x.id === id);
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
    const end = new Date(r.dropoffDate);
    return end >= new Date();
  }

   deleteReserve(resId: string, vehId: string): void {
    this.dialogService.openDialog(
      'Eliminar reserva',
      '¿Seguro quieres eliminar esta reserva?',
      () => {
        this.reserveService.deleteReserve(resId).subscribe(() => {
          // 1) Restaurar disponibilidad del vehículo
          this.vehicleService.updateVehicle(vehId, { isAvailable: true }).subscribe(() => {
            this.allReserves = this.allReserves.filter(r => r.id !== resId);
          });
        });
      }
    ).subscribe();
  }

  editReserve(reserveId: string): void {
    // asume ruta '/reserve/update/:id'
    this.router.navigate(['/reserve/update', reserveId]);
  }

  goToRegister(): void {
    this.router.navigate(['/reserve/register-reserve']);
  }
}