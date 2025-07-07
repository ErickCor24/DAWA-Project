import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { ClientService } from '../../../services/clients/client.service';

import { Vehicle } from '../../../models/Vehicle';
import { Agency } from '../../../models/agency';
import { Reserve } from '../../../models/reserve';
import { ButtonComponent } from '../../shared/button/button.component';
import { HttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-update-reserve',
  templateUrl: './update-reserve.component.html',
  styleUrls: ['./update-reserve.component.css'],
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    ButtonComponent
  ],
  providers: [provideNativeDateAdapter()]
})
export class UpdateReserveComponent implements OnInit {
  reserveForm!: FormGroup;
  vehicles: Vehicle[] = [];
  agencies: Agency[] = [];
  rentalDays = 0;
  selectedClientName = '';
  selectedVehicleName = '';
  fechaMin: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private reserveService: ReserveService,
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private authService: AuthServiceService, // ← CAMBIO: reemplazo de ClientSessionService
    private clientService: ClientService      // ← CAMBIO: para obtener el cliente desde el backend
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getIdToken(); // ← CAMBIO: obtener ID desde el token
    if (!clientId) {
      this.authService.removeAuthToken();           // ← CAMBIO: limpiar token si es inválido
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getClientById(clientId).subscribe({
      next: client => {
        if (!client || !client.status) {
          this.authService.removeAuthToken();       // ← CAMBIO: validación del cliente desde backend
          this.router.navigate(['/client/login']);
          return;
        }

        this.selectedClientName = client.fullName;

        this.reserveForm = this.fb.group({
          idClient:       [client.id, Validators.required],
          idVehicle:      ['', Validators.required],
          idAgencyPickup: ['', Validators.required],
          pickupDate:     ['', Validators.required],
          dropoffDate:    ['', Validators.required],
          price:          [{ value: 0, disabled: true }, Validators.required],
          status:         [true]
        }, { validators: this.dateRangeValidator });

        this.vehicleService.getVehicles().subscribe(vList => {
          this.vehicles = vList;

          const reserveId = this.route.snapshot.paramMap.get('id')!;
          this.reserveService.getReserve(reserveId).subscribe({
            next: r => {
              if (!r || r.idClient !== client.id) {
                this.router.navigate(['/not-found']);
                return;
              }

              this.reserveForm.patchValue({
                idVehicle:      r.idVehicle,
                idAgencyPickup: r.idAgencyPickup,
                pickupDate:     this.parseDateString(r.pickupDate),
                dropoffDate:    this.parseDateString(r.dropoffDate),
                status:         r.status
              });

              this.vehicleService.getVehicle(r.idVehicle).subscribe(veh => {
                this.selectedVehicleName = `${veh.brand} ${veh.model}`;
                if (!this.vehicles.some(v => v.id === veh.id)) {
                  this.vehicles.unshift(veh);
                }
                this.calculatePrice();
              });
            },
            error: () => {
              this.router.navigate(['/not-found']);
            }
          });

          this.reserveForm.get('pickupDate')!.valueChanges
            .subscribe(() => this.calculatePrice());
          this.reserveForm.get('dropoffDate')!.valueChanges
            .subscribe(() => this.calculatePrice());
        });

        this.http.get<Agency[]>('http://localhost:3000/agencys')
          .subscribe(list => this.agencies = list);
      },
      error: () => {
        this.authService.removeAuthToken();
        this.router.navigate(['/client/login']);
      }
    });
  }

  calculatePrice(): void {
    const p   = new Date(this.reserveForm.get('pickupDate')!.value);
    const d   = new Date(this.reserveForm.get('dropoffDate')!.value);
    const vid = this.reserveForm.get('idVehicle')!.value as string;

    if (!vid || isNaN(p.getTime()) || isNaN(d.getTime()) || d <= p) {
      this.reserveForm.get('price')!.setValue(0);
      this.rentalDays = 0;
      return;
    }

    const days = Math.ceil((d.getTime() - p.getTime()) / (1000 * 60 * 60 * 24));
    this.rentalDays = days;

    const veh = this.vehicles.find(v => v.id === vid);
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
    const updated: Reserve = {
      id:             this.route.snapshot.paramMap.get('id')!,
      idClient:       raw.idClient,
      idVehicle:      raw.idVehicle,
      idAgencyPickup: raw.idAgencyPickup,
      pickupDate:     this.formatDateOnly(raw.pickupDate),
      dropoffDate:    this.formatDateOnly(raw.dropoffDate),
      price:          raw.price,
      status:         raw.status
    };

    this.dialogService.openDialog(
      'Confirmar cambios',
      '¿Deseas guardar los cambios de esta reserva?',
      () => {
        this.reserveService.updateReserve(updated).subscribe(() => {
          this.router.navigate(['/reserve/list']);
        });
      }
    ).subscribe();
  }

  onCancel(): void {
    this.router.navigate(['/reserve/list']);
  }

  private dateRangeValidator(group: FormGroup) {
    const p = new Date(group.get('pickupDate')!.value);
    const d = new Date(group.get('dropoffDate')!.value);
    return (p && d && d <= p) ? { dateInvalid: true } : null;
  }

  private formatDateOnly(date: Date | string) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(s => +s);
    return new Date(year, month - 1, day);
  }
}
