import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { ButtonComponent } from "../../shared/button/button.component";
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-create-vehicle',
  imports: [MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatCardModule, MatButtonModule, ButtonComponent],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.css'
})
export class CreateVehicleComponent implements OnInit {

  private authService = inject(AuthServiceService);

  formGroup!: FormGroup;
  nextYear = new Date().getFullYear() + 1;

  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      model: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear() + 1)]],
      plateNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{4}$/)]],
      transmission: ['', Validators.required],
      color: ['', [Validators.required, Validators.minLength(3)]],
      seats: ['', [Validators.required, Validators.min(2)]],
      fueType: ['', [Validators.required, Validators.minLength(3)]],
      poster: [''],
      pricePerDay: ['', [Validators.required, Validators.min(1)]]
    });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    } else {
      const vehicleData = {
      ...this.formGroup.value,
      CompanyId: this.authService.getIdToken(), // Asegúrate que este valor sea correcto
      isAvailable: true,
      status: true
    };
    this.service.createVehicle(vehicleData, vehicleData.CompanyId).subscribe({
      next: (vehicle) => {
        console.log('Vehículo creado:', vehicle);
        this.router.navigate(['/vehicle/view-company-vehicles']);
      },
      error: (err) => {
        console.error('Error al crear vehículo:', err);
      }
    });
    }
  }

  navigateTo(toComponent: string): void {
    this.router.navigate([`/${toComponent}`]);
  }
}




