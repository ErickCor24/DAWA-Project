import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { Vehicle } from '../../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-update-vehicle',
  imports: [MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatCardModule, MatButtonModule, MatCheckboxModule, ButtonComponent],
  templateUrl: './update-vehicle.component.html',
  styleUrl: './update-vehicle.component.css'
})
export class UpdateVehicleComponent implements OnInit {

  formGroup!: FormGroup<any>;
  id!: string;
  currentVehicle!: Vehicle;

  constructor(private service: VehicleService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(3)]],
      plateNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{4}$/)]],
      transmission: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear() + 1)]],
      fueType: ['', [Validators.required, Validators.minLength(3)]],
      color: ['', [Validators.required, Validators.minLength(3)]],
      seats: ['', [Validators.required, Validators.min(2)]],
      poster: [''],
      pricePerDay: ['', [Validators.required, Validators.min(1)]],
      isAvailable: [false]
    });

    this.route.paramMap.subscribe(params => {

      this.id = this.route.snapshot.paramMap.get('id')!;
      if (this.id) {
        this.service.getVehicle(Number(this.id)).subscribe((data: Vehicle) => {
          this.currentVehicle = data;
          this.formGroup.setValue({
            brand: this.currentVehicle.brand,
            type: this.currentVehicle.type,
            model: this.currentVehicle.model,
            plateNumber: this.currentVehicle.plateNumber,
            transmission: this.currentVehicle.transmission,
            year: this.currentVehicle.year,
            fueType: this.currentVehicle.fueType,
            color: this.currentVehicle.color,
            seats: this.currentVehicle.seats,
            poster: this.currentVehicle.poster,
            pricePerDay: this.currentVehicle.pricePerDay,
            isAvailable: this.currentVehicle.isAvailable
          });
        });
      }
    });
  }

  navigateToListVehiclesByCompany(): void {
    this.router.navigate(['/vehicle/view-company-vehicles']);
  }

  submit(): void {
    const updatedVehicle: Vehicle = {
      ...this.currentVehicle,
      ...this.formGroup.value
    };
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    } else {
      this.service.updateVehicle(updatedVehicle).subscribe(() => {
        this.navigateToListVehiclesByCompany();
      });
    }
  }
}
