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
import { DialogService } from '../../../services/dialog-box/dialog.service';


@Component({
   standalone:true,
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
  rentalDays: number = 0;


  constructor(
    private fb: FormBuilder,
    private reserveService: ReserveService,
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService
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
    const formValue = this.reserveForm.getRawValue();
const reserveData: Reserve = {
  ...formValue,
  idClient: Number(formValue.idClient),
  idVehicle: Number(formValue.idVehicle),
  idAgencyPickup: Number(formValue.idAgencyPickup),
};

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
    },{ validators: this.dateRangeValidator });
  }

   calculatePrice(): void {
  const pickupDate = new Date(this.reserveForm.get('pickupDate')?.value);
  const dropoffDate = new Date(this.reserveForm.get('dropoffDate')?.value);
  const vehicleId = this.reserveForm.get('idVehicle')?.value;

  if (!pickupDate || !dropoffDate || dropoffDate <= pickupDate) {
    this.reserveForm.get('price')?.setValue(0);
    this.rentalDays = 0;
    return;
  }

  const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
  this.rentalDays = days;

  const selectedVehicle = this.vehicles.find(v => v.id === vehicleId);
  if (selectedVehicle) {
    const totalPrice = days * selectedVehicle.dailyPrice;
    this.reserveForm.get('price')?.setValue(totalPrice);
  }
}
onSubmit(): void {
  this.dialogService.openDialog(
    'Confirmar reserva',
    '¿Deseas guardar esta reserva?',
    () => {
      if (this.reserveForm.invalid) {
        console.warn('Formulario inválido:', this.reserveForm.errors);
        return;
      }
      const rawData = this.reserveForm.getRawValue();

     const reserveData: Reserve = {
        ...rawData,
        pickupDate: this.formatDateOnly(rawData.pickupDate),
        dropoffDate: this.formatDateOnly(rawData.dropoffDate),
      };


      this.reserveService.addReserve(reserveData).subscribe(() => {
        this.router.navigate(['reserve/list-reserve']);
      });
    }
  ).subscribe();
}
onCancel(): void {
  this.dialogService.openDialog(
    'Cancelar registro',
    '¿Estás seguro de que deseas cancelar el registro?',
    () => {},
    '/list-reserve'
  ).subscribe();
}

  goToReserveList(): void {
    this.router.navigate(['reserve/list-reserve']); // Ajusta según tu enrutamiento real
  }
 dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
  const pickup = new Date(group.get('pickupDate')?.value);
  const dropoff = new Date(group.get('dropoffDate')?.value);

  if (pickup && dropoff && dropoff <= pickup) {
    return { dateInvalid: true };
  }

  return null;
}
private formatDateOnly(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


}
