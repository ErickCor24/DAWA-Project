import { Component, OnInit} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../../../services/reserve/reserve.service';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { ClientSessionService } from '../../../services/clients/client-session.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

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
    CommonModule, NgFor, NgIf, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDatepickerModule, ButtonComponent
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
    private session: ClientSessionService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute
  ) {}
   ngOnInit(): void {
   //Verificar sesión
    const client = this.session.getClient();
    if (!client) {
      this.router.navigate(['/client/login']);
      return;
    }
    this.selectedClientName = client.fullName;

    // Inicializar form
    this.reserveForm = this.fb.group({
      idClient:       [ client.id,    Validators.required ],
      idVehicle:      [ '',           Validators.required ],
      idAgencyPickup: [ '',           Validators.required ],
      pickupDate:     [ '',           Validators.required ],
      dropoffDate:    [ '',           Validators.required ],
      price:          [ { value: 0, disabled: true }, Validators.required ],
      status:         [ true ]
    }, { validators: this.dateRangeValidator });

    // Cargar sólo los vehículos disponibles
    this.vehicleService.getVehicles().subscribe(vList => {
      this.vehicles = vList;

      // Cargar datos de la reserva a editar
      const id = this.route.snapshot.paramMap.get('id')!;
      this.reserveService.getReserve(id).subscribe(r => {
        this.reserveForm.patchValue({
          idVehicle:      r.idVehicle,
          idAgencyPickup: r.idAgencyPickup,
          pickupDate:     r.pickupDate,
          dropoffDate:    r.dropoffDate,
          status:         r.status
        });

        //Traer el vehículo reservado aunque esté no disponible
        this.vehicleService.getVehicle(r.idVehicle).subscribe(veh => {
          this.selectedVehicleName = `${veh.brand} ${veh.model}`;

          //  Asegurar que el reserved vehicle esté en el array para el cálculo
          if (!this.vehicles.some(v => v.id === veh.id)) {
            this.vehicles.unshift(veh);
          }

          this.calculatePrice();
        });

       
        this.reserveForm.get('pickupDate')!.valueChanges
          .subscribe(() => this.calculatePrice());
        this.reserveForm.get('dropoffDate')!.valueChanges
          .subscribe(() => this.calculatePrice());
      });
    });

    // Cargar agencias (temporal)
    this.http.get<Agency[]>('http://localhost:3000/agencys')
      .subscribe(list => this.agencies = list);
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
    const d   = new Date(date),y = d.getFullYear(),m=String(d.getMonth() + 1).padStart(2, '0'),day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}