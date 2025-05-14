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

@Component({
  selector: 'app-register-reserve',
  imports: [MatSelectModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, NgFor, NgIf, CommonModule,
     MatFormFieldModule, MatSelectModule, MatInputModule, MatDatepickerModule],
  templateUrl: './register-reserve.component.html',
  styleUrl: './register-reserve.component.css'
})
export class RegisterReserveComponent implements OnInit {
  reserveForm!: FormGroup;
   reserves: Reserve[] = [];
  /*clients: any[] = [];
  vehicles: any[] = [];
  agencys: any[] = [];

  idClient!: number;
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
    this.createForm();

    // Traer reservas actuales para calcular siguiente ID
    this.reserveService.getReserve().subscribe(data => {
      this.reserves = data;
    });
  }

  createForm(): void {
    this.reserveForm = this.fb.group({
      idReserve: [''],
      idClient: [1, Validators.required], // Cliente simulado
      idVehicle: [1, Validators.required], // Vehículo simulado
      idAgencyPickup: [1, Validators.required], // Agencia simulada
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      price: [0, Validators.required],
      status: [true]
    });
  }

  onSubmit(): void {
    if (this.reserveForm.valid) {
      const nextId = this.getNextReserveId();
      const newReserve: Reserve = {
        ...this.reserveForm.value,
        idReserve: nextId
      };

      this.reserveService.addReserve(newReserve).subscribe(() => {
        alert('Reserva registrada correctamente.');
        this.router.navigate(['/reserves']);
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  getNextReserveId(): number {
    if (this.reserves.length === 0) {
      return 1;
    }
    return Math.max(...this.reserves.map(r => r.idReserve ?? 0)) + 1;
  }
  /*  //ejemplo
      if (!this.idClient || !this.idVehicle) {
    this.idClient = 1; // ejemplo
    this.idVehicle = 1; // ejemplo
  }
    this.idClient = Number(localStorage.getItem('idClient'));
    this.idVehicle = Number(localStorage.getItem('idVehicle'));

    this.reserveForm = this.fb.group({
      idClient: [this.idClient, Validators.required],
      idVehicle: [this.idVehicle, Validators.required],
      idAgencyPickup: ['', Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      price: [0, Validators.required],
      status: [true]
    });

    this.loadSelectData();
  }

  loadSelectData(): void {
    this.http.get<any[]>('http://localhost:3000/clients').subscribe(data => {
      this.clients = data;
      const client = this.clients.find(c => c.idClient === this.idClient);
      if (client) this.clientName = client.name;
    });

    this.http.get<any[]>('http://localhost:3000/vehicles').subscribe(data => {
      this.vehicles = data;
      const vehicle = this.vehicles.find(v => v.idVehicle === this.idVehicle);
      if (vehicle) this.vehicleName = vehicle.model;
    });

    this.http.get<any[]>('http://localhost:3000/agencys').subscribe(data => {
      this.agencys = data;
    });
  }

  onSubmit() {
    if (this.reserveForm.valid) {
      this.reserveService.addReserve(this.reserveForm.value).subscribe({
        next: () => {
          alert('Reservation registered successfully!');
          this.reserveForm.reset({ status: true });
        },
        error: () => alert('Failed to register reservation.')
      });
    }
  }
  
 /*ngOnInit(): void {
    this.idClient = Number(localStorage.getItem('idClient'));
    this.idVehicle = Number(localStorage.getItem('idVehicle'));

    if (!this.idClient || !this.idVehicle) {
      alert('Error: Client or Vehicle not found.');
      return;
    }

    this.initForm();
    this.loadData();
    this.setupPriceCalculation();
    console.log('Valor de reserveForm en ngOnInit:', this.reserveForm); // Agrega esta línea

  }

  initForm(): void {
    this.reserveForm = this.fb.group({
      idClient: [this.idClient, Validators.required],
      idVehicle: [this.idVehicle, Validators.required],
      idAgencyPickup: ['', Validators.required],
      pickupDate: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      price: [0, Validators.required],
      status: [true]
    });
  }

  loadData(): void {
    // Cargar clientes
    this.http.get<any[]>('http://localhost:3000/clients').subscribe(data => {
      this.clients = data;
      const client = data.find(c => c.idClient === this.idClient);
      if (client) this.clientName = client.fullName || client.name;
    });

    // Cargar vehículos
    this.http.get<any[]>('http://localhost:3000/vehicles').subscribe(data => {
      this.vehicles = data;
      const vehicle = data.find(v => v.idVehicle === this.idVehicle);
      if (vehicle) {
        this.vehicleName = `${vehicle.brand} ${vehicle.model}`;
        this.vehiclePricePerDay = vehicle.dailyPrice || 30; // usa dailyPrice si está definido
      }
    });

    // Cargar agencias
    this.http.get<any[]>('http://localhost:3000/agencys').subscribe(data => {
      this.agencys = data;
    });
  }

  setupPriceCalculation(): void {
    this.reserveForm.get('pickupDate')?.valueChanges.subscribe(() => this.calculatePrice());
    this.reserveForm.get('dropoffDate')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  calculatePrice(): void {
    const pickup = new Date(this.reserveForm.get('pickupDate')?.value);
    const dropoff = new Date(this.reserveForm.get('dropoffDate')?.value);

    if (!isNaN(pickup.getTime()) && !isNaN(dropoff.getTime()) && dropoff > pickup) {
      const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 3600 * 24));
      this.calculatedPrice = days * this.vehiclePricePerDay;
      this.reserveForm.get('price')?.setValue(this.calculatedPrice);
    } else {
      this.calculatedPrice = 0;
      this.reserveForm.get('price')?.setValue(0);
    }
  }

  onSubmit(): void {
    if (this.reserveForm.valid) {
      this.reserveService.addReserve(this.reserveForm.value).subscribe({
        next: () => {
          alert('Reservation registered successfully!');
          this.reserveForm.reset({ status: true });
        },
        error: () => alert('Failed to register reservation.')
      });
    }
  }*/
}
