import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../models/Vehicle';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-vehicles',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ButtonComponent,
    MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule
  ],
  templateUrl: './view-vehicles.component.html',
  styleUrl: './view-vehicles.component.css'
})
export class ViewVehiclesComponent implements OnInit{
  vehicles: Vehicle[] = [];
  formSearch!: FormGroup;

  constructor(private service: VehicleService, private router: Router, private fb:FormBuilder) { }

  idCompany!: string;

  ngOnInit(): void {
    console.log(`idCompanyLogued ${sessionStorage.getItem('idCompany')}`);
    this.idCompany = sessionStorage.getItem('idCompany') ?? '';
    if (this.idCompany) {
      this.navigateTo("vehicle/list-vehicles");
    } else {
      this.loadVehicles();
    this.formSearch = this.fb.group({
        searchBy: [''],
        inputSearch: ['']
      })

    }
    
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
}
