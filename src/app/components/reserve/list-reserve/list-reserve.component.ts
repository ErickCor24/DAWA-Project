import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/clients/client.model';
import { Vehicle } from '../../../models/Vehicle';
import { Agency } from '../../../models/agency';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";
import { CommonModule } from '@angular/common';
import { ClientSessionService } from '../../../services/clients/client-session.service';
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

@Component({
  standalone:true,
  selector: 'app-list-reserve',
  imports: [ButtonComponent, CommonModule, FormsModule, MatTableModule, MatSelectModule,MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatFormFieldModule,],
  templateUrl: './list-reserve.component.html',
  styleUrl: './list-reserve.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ListReserveComponent implements OnInit {
   allReserves: Reserve[] = [];
  reserves: Reserve[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  agencies: Agency[] = [];
 displayedColumns = ['vehicle','agency','pickupDate','dropoffDate','price','status','actions'];



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
    
      this.allReserves = r.filter(x => x.idClient === client.id);
    });

   this.reserveService.getReserves().subscribe(r => {
  this.allReserves = r.filter(x => x.idClient === client.id);

  this.allReserves.forEach(res => {
    this.vehicleService.getVehicle(res.idVehicle)
      .subscribe(veh => {
        res['vehicleName'] = `${veh.brand} ${veh.model}`;
      });
  });
});
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

  getVehicleNsiame(id: string): string {
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

  const today = new Date();
  
  today.setHours(0, 0, 0, 0);

  const pickup = new Date(r.pickupDate);
  pickup.setHours(0, 0, 0, 0);

  return pickup > today;
}

deleteReserve(resId: string, vehId: string): void {
  console.log('deleteReserve llamado', { resId, vehId });

  this.dialogService.openDialog(
    'Eliminar reserva',
    '¿Seguro quieres eliminar esta reserva?',
    () => {
      console.log('>> Usuario confirmó eliminar');

      // Obtener el vehículo aunque esté isAvailable=false
      this.vehicleService.getVehicle(vehId).pipe(
        switchMap(veh => {
          console.log('>> Vehículo obtenido vía servicio:', veh);

          const updatedVeh = { ...veh, isAvailable: true };
          console.log('>> Vehículo a actualizar:', updatedVeh);

          return this.vehicleService.updateVehicle(updatedVeh);
        }),

        //Una vez restaurado el vehículo, borrar la reserva
        switchMap(() => {
          console.log('>> Vehículo restaurado, procedo a borrar la reserva');
          return this.reserveService.deleteReserve(resId);
        })
      ).subscribe({
        next: () => {
          console.log('>> Reserva borrada con éxito, actualizo lista local');
          this.allReserves = this.allReserves.filter(r => r.id !== resId);
        },
        error: err => console.error('!! Error en flujo de borrado:', err)
      });
    }
  ).subscribe(confirmed => {
    console.log('<< Diálogo cerrado, confirmado =', confirmed);
  });
}
  editReserve(reserveId: string): void {
    this.router.navigate(['/reserve/update', reserveId]);
  }

  goToSelectVehicle(): void {
    this.router.navigate(['/vehicle/view-client-vehicles']);
  }
}