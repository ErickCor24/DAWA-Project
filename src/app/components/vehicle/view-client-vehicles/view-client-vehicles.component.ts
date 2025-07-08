import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatCardModule } from '@angular/material/card';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service';

import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-client-vehicles',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    ButtonComponent, MatCardModule, MatInputModule],
  templateUrl: './view-client-vehicles.component.html',
  styleUrl: './view-client-vehicles.component.css'
})
export class ViewClientVehiclesComponent implements OnInit {

  private authService = inject(AuthServiceService);

  formSearch!: FormGroup;
  vehicles: Vehicle[] = [];

  idClient!: number;

  constructor(
    private service: VehicleService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem('selectedVehicleId');
    console.log(`idClientLogued ${this.authService.getIdToken()}`);
    this.idClient = this.authService.getIdToken();
    if (!isNaN(this.idClient) && this.idClient !== -1) {
      this.loadVehicles();
    } else {
      this.navigateTo("/client/login")
    }
    this.formSearch = this.fb.group({
      searchBy: ['', Validators.required],
      inputSearch: ['', Validators.required]
    })
  }

  loadVehicles(): void {
    this.service.getVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles = data;
    });
  }

  navigateTo(toComponent: string): void {
    this.router.navigate([`/${toComponent}`]);
  }

  searchVehicle(): void {
    const field = this.formSearch.get('searchBy')?.value;
    const dataInput = this.formSearch.get('inputSearch')?.value;
    if (field && dataInput) {
      this.service.getVehicleByField(field, dataInput).subscribe((data: Vehicle[]) => {
        this.vehicles = data;
      });
    } else {
      this.loadVehicles();
    }
  }
  
  goToReserve(vehicleId: number): void {
    sessionStorage.setItem('selectedVehicleId', vehicleId.toString());
    this.router.navigate(
      ['/reserve/register'],
      { queryParams: { vehicleId } }
    );
  }

}
