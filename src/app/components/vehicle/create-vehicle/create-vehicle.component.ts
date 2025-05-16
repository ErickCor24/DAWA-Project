import { Component, OnInit } from '@angular/core';
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
export class CreateVehicleComponent implements OnInit{

  formGroup!: FormGroup;
  nextYear = new Date().getFullYear() + 1;
  //agencies: Agency[] = [];


  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    //serviceAgency to obtain the agencies by company
    this.formGroup = this.fb.group({
      model: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear() + 1)]],
      plateNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{4}$/)]],
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
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      return;
    } else{
      this.service.createVehicle(this.formGroup.value, sessionStorage.getItem('idCompany')!).subscribe((createVehicle) => {
      this.router.navigate(['/vehicle/view'])
    })
    }
  }

  navigateTo(toComponent: string): void {
    this.router.navigate([`/${toComponent}`]);
  }
}




