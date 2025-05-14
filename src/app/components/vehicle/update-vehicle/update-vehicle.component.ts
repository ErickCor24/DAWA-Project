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
    // Inicializa el formulario con los campos vacíos o valores por defecto
    this.formGroup = this.fb.group({
      idAgency: [''],
      brand: [''],
      type: [''],
      model: [''],
      plateNumber: [''],
      transmission: [''],
      year: [''],
      fuelType: [''],
      color: [''],
      seats: [''],
      poster: [''],
      pricePerDay: [''],
      isAvailable: [false]
    });

    this.route.paramMap.subscribe(params => {

      this.id = this.route.snapshot.paramMap.get('id')!;
      if (this.id) {
        this.service.getVehicle(this.id).subscribe((data: Vehicle) => {
          this.currentVehicle = data;
          this.formGroup.setValue({
            idAgency: this.currentVehicle.idAgency,
            brand: this.currentVehicle.brand,
            type: this.currentVehicle.type,
            model: this.currentVehicle.model,
            plateNumber: this.currentVehicle.plateNumber,
            transmission: this.currentVehicle.transmission,
            year: this.currentVehicle.year,
            fuelType: this.currentVehicle.fuelType,
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
    this.router.navigate(['/vehicle/list-vehicles']);
  }

  submit(): void {
    const updatedVehicle: Vehicle = {
      ...this.currentVehicle,
      ...this.formGroup.value
    };
    this.service.updateVehicle(updatedVehicle).subscribe(() => {
      alert("Updated alert");
      this.navigateToListVehiclesByCompany();
    });
  }
}
