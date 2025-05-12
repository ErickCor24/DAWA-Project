import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-vehicle',
  imports: [MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, MatSelectModule, MatCardModule, MatButtonModule
  ],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.css'
})
export class CreateVehicleComponent {

  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      model: ['', Validators.required],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      year: ['', Validators.required],
      plateNumber: ['', Validators.required],
      transmission: ['', Validators.required],
      color: ['', Validators.required],
      seats: ['', Validators.required],
      fuelType: ['', Validators.required],
      idAgency: ['', Validators.required]
    });
  }
}




