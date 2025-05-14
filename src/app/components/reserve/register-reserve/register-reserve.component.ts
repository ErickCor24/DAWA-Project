import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Reserve } from '../../../models/reserve';
import { Router } from '@angular/router';
import { Client } from '../../../models/client';
import { Vehicle } from '../../../models/vehicle';
import { Agency } from '../../../models/agency';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-register-reserve',
  imports: [MatSelectModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, NgFor, NgIf, CommonModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatDatepickerModule, ButtonComponent],
  templateUrl: './register-reserve.component.html',
  styleUrl: './register-reserve.component.css'
})
export class RegisterReserveComponent implements OnInit {
  reserveForm!: FormGroup;
  
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  agencys:  Agency[] = [];

  /*idClient!: number;
  idVehicle!: number;
  clientName: string = '';
  vehicleName: string = '';
  vehiclePricePerDay: number = 0;
  calculatedPrice: number = 0;*/


  constructor(
    private fb: FormBuilder,
    private reserveService: ReserveService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
     this.http.get<Client[]>('http://localhost:3000/clients').subscribe(data => this.clients = data);
    this.http.get<Agency[]>('http://localhost:3000/agencys').subscribe(data => this.agencys = data);
    this.http.get<Vehicle[]>('http://localhost:3000/vehicles').subscribe(data => {
      this.vehicles = data;
    });

    // Escucha cambios para cálculo automático
    this.reserveForm.get('pickupDate')?.valueChanges.subscribe(() => this.calculatePrice());
    this.reserveForm.get('dropoffDate')?.valueChanges.subscribe(() => this.calculatePrice());
    this.reserveForm.get('idVehicle')?.valueChanges.subscribe(() => this.calculatePrice());
    //this.loadData();
  }

  initForm(): void {
    this.reserveForm = this.fb.group({
      idClient: ['', Validators.required],
      idVehicle: ['', Validators.required],
      idAgencyPickup: ['', Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
       price: [{ value: 0, disabled: true }, Validators.required],
      status: [true]
    });
  }

   calculatePrice(): void {
    const pickupDate = new Date(this.reserveForm.get('pickupDate')?.value);
    const dropoffDate = new Date(this.reserveForm.get('dropoffDate')?.value);
    const vehicleId = this.reserveForm.get('idVehicle')?.value;

    if (!pickupDate || !dropoffDate || !vehicleId || dropoffDate <= pickupDate) {
      this.reserveForm.get('price')?.setValue(0);
      return;
    }
    const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    const selectedVehicle = this.vehicles.find(v => v.id === vehicleId);

    if (selectedVehicle) {
      const totalPrice = days * selectedVehicle.dailyPrice;
      this.reserveForm.get('price')?.setValue(totalPrice);
    }
  }
  onSubmit(): void {
    if (this.reserveForm.invalid) return;

    const reserveData: Reserve = {
      ...this.reserveForm.getRawValue(), // Incluye el campo 'price' aunque esté deshabilitado
    };

    this.reserveService.addReserve(reserveData).subscribe(() => {
      this.router.navigate(['/list-reserve']); // Ajusta a tu ruta
    });
  }

  goToReserveList(): void {
    this.router.navigate(['/list-reserve']); // Ajusta según tu enrutamiento real
  }
 
}
