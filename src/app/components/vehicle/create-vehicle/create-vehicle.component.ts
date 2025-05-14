import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { ButtonComponent } from "../../shared/button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-vehicle',
  imports: [MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatCardModule, MatButtonModule, ButtonComponent],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.css'
})
export class CreateVehicleComponent {

  formGroup!: FormGroup;

  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      model: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear() + 1)]],
      plateNumber: ['ABC1234', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{4}$/)]],
      transmission: ['', Validators.required],
      color: ['', [Validators.required, Validators.minLength(3)]],
      seats: ['', [Validators.required, Validators.min(2)]],
      fuelType: ['', [Validators.required, Validators.minLength(3)]],
      idAgency: ['', Validators.required],
      poster: [''],
      pricePerDay: ['', [Validators.required, Validators.min(1)]]
    });
  }

  submit(): void {
    this.service.createVehicle(this.formGroup.value, "1").subscribe((createVehicle) => {
      alert("vEHICLE CREATE");
      this.router.navigate(['/vehicle/list-vehicles'])
    })

  }
}




