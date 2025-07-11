import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Reserve } from '../../../models/reserve';
import { Vehicle } from '../../../models/Vehicle';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service'; //  CAMBIO
import { ClientService } from '../../../services/clients/client.service';         //  CAMBIO
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-register-reserve',
  standalone: true,
  imports: [
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    ButtonComponent
  ],
  templateUrl: './register-reserve.component.html',
  styleUrl: './register-reserve.component.css',
  providers: [provideNativeDateAdapter()]
})
export class RegisterReserveComponent implements OnInit {
  reserveForm!: FormGroup;
  vehicles: Vehicle[] = [];
  selectedClientName = '';
  selectedVehicleName = '';
  rentalDays = 0;
  fechaMin: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private reserveService: ReserveService,
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService,
    private authService: AuthServiceService,      // CAMBIO
    private clientService: ClientService,         // CAMBIO
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getIdToken(); // CAMBIO
    if (!clientId) {
      this.authService.removeAuthToken();           //  CAMBIO
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getClientById(clientId).subscribe({ // CAMBIO
      next: client => {
        if (!client || !client.status) {
          this.authService.removeAuthToken();       //  CAMBIO
          this.router.navigate(['/client/login']);
          return;
        }

        this.selectedClientName = client.fullName;

        this.reserveForm = this.fb.group(
          {
            clientId: [client.id, Validators.required],
            vehicleId: ['', Validators.required],
            pickupDate: ['', Validators.required],
            dropoffDate: ['', Validators.required],
            price: [0, Validators.required] ,
            status: [true]
          },
          { validators: this.dateRangeValidator }
        );

        this.vehicleService.getVehicles().subscribe(list => {
          this.vehicles = list;

          const sel = sessionStorage.getItem('selectedVehicleId');
            if (sel) {
             this.reserveForm.patchValue({ vehicleId: sel });

          const veh = this.vehicles.find(v => v.id === Number(sel));
            if (veh) {
              this.selectedVehicleName = `${veh.brand} ${veh.model}`;
              this.calculatePrice(); // ← 💡 esto soluciona todo
            }
          }

          this.reserveForm
            .get('pickupDate')!
            .valueChanges.subscribe(() => this.calculatePrice());
          this.reserveForm
            .get('dropoffDate')!
            .valueChanges.subscribe(() => this.calculatePrice());
        });
      },
      error: () => {
        this.authService.removeAuthToken();         // CAMBIO
        this.router.navigate(['/client/login']);
      }
    });
  }

  calculatePrice(): void {
    const p = new Date(this.reserveForm.get('pickupDate')!.value);
    const d = new Date(this.reserveForm.get('dropoffDate')!.value);
    const vid = this.reserveForm.get('vehicleId')!.value as string;

    if (!vid || isNaN(p.getTime()) || isNaN(d.getTime()) || d <= p) {
      this.reserveForm.get('price')!.setValue(0);
      this.rentalDays = 0;
      return;
    }

    const days = Math.ceil(
      (d.getTime() - p.getTime()) / (1000 * 60 * 60 * 24)
    );
    this.rentalDays = days;

    const veh = this.vehicles.find(v => v.id === Number(vid));
    if (veh) {
      this.reserveForm.get('price')!.setValue(days * veh.pricePerDay);
    }
  }

  onSubmit(): void {
    if (this.reserveForm.invalid) {
      this.reserveForm.markAllAsTouched();
      return;
    }

    const raw = this.reserveForm.getRawValue();
    const newRes: Reserve = {
      clientId: raw.clientId,
      vehicleId: raw.vehicleId,
      pickupDate: this.formatDateOnly(raw.pickupDate),
      dropoffDate: this.formatDateOnly(raw.dropoffDate),
      price: raw.price,
      status: raw.status
    };


    this.reserveService.getReserves().subscribe(existing => {
      const conflict = existing.some(
        r =>
          r.vehicleId === newRes.vehicleId &&
          r.status &&
          !(
            newRes.dropoffDate <= r.pickupDate ||
            newRes.pickupDate >= r.dropoffDate
          )
      );
      if (conflict) {
        alert('Este vehículo ya está reservado en ese rango de fechas.');
        return;
      }

      this.dialogService
        .openDialog(
          'Confirmar reserva',
          '¿Deseas guardar esta reserva?',
          () => {
            this.reserveService.addReserve(newRes).subscribe(res => {
              const veh = this.vehicles.find(v => v.id === Number(newRes.vehicleId));
              if (!veh) return;

              const updatedVeh: Vehicle = {
                ...veh,
                isAvailable: false
              };
              this.vehicleService
                .updateVehicle(updatedVeh)
                .subscribe(() => this.router.navigate(['/reserve/list']));
            });
          }
        )
        .subscribe();
    });
  }

  onCancel(): void {
    this.dialogService
      .openDialog(
        'Cancelar registro',
        '¿Estás seguro de que deseas cancelar?',
        () => this.router.navigate(['/vehicle/view-client-vehicles'])
      )
      .subscribe();
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const p = new Date(group.get('pickupDate')!.value);
    const d = new Date(group.get('dropoffDate')!.value);
    return p && d && d <= p ? { dateInvalid: true } : null;
  }

  private formatDateOnly(date: Date | string): string {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
