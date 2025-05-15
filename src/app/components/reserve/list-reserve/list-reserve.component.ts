import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { Reserve } from '../../../models/reserve';
import { Client } from '../../../models/client';
import { Vehicle } from '../../../models/vehicle';
import { Agency } from '../../../models/agency';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-list-reserve',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './list-reserve.component.html',
  styleUrl: './list-reserve.component.css'
})
export class ListReserveComponent implements OnInit {
  reserves: Reserve[] = [];
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  agencys: Agency[] = [];

  constructor(
    private reserveService: ReserveService,
    private http: HttpClient,
    private dialogService: DialogService,
    private router: Router
  ) {}

   ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.reserveService.getReserve().subscribe(data => this.reserves = data);
    this.http.get<Client[]>('http://localhost:3000/clients').subscribe(data => this.clients = data);
    this.http.get<Vehicle[]>('http://localhost:3000/vehicles').subscribe(data => this.vehicles = data);
    this.http.get<Agency[]>('http://localhost:3000/agencys').subscribe(data => this.agencys = data);
  }

getClientName(idClient: string): string {
  return this.clients.find(client => client.id === idClient)?.fullName || 'Desconocido';
}

getVehicleName(idVehicle: string): string {
  return this.vehicles.find(vehicle => vehicle.id === idVehicle)?.model || 'Desconocido';
}

getAgencyName(idAgency: string): string {
  return this.agencys.find(agency => agency.id === idAgency)?.name || 'Desconocido';
}


  deleteReserve(id: string): void {
    this.dialogService.openDialog(
      '¿Estás seguro?',
      'Esta acción eliminará la reserva permanentemente.',
      () => {
        this.reserveService.deleteReserve(id).subscribe(() => {
          this.reserves = this.reserves.filter(r => r.id !== id);
        });
      }
    ).subscribe();
  }

  goToRegister(): void {
    this.router.navigate(['/reserve/register-reserve']);
  }
}