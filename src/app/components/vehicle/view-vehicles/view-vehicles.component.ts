import { Component } from '@angular/core';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-view-vehicles',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ButtonComponent],
  templateUrl: './view-vehicles.component.html',
  styleUrl: './view-vehicles.component.css'
})
export class ViewVehiclesComponent {
  vehicles: Vehicle[] = [];

  constructor(private service: VehicleService, private router:  Router){}

  ngOnInit(): void {
    this.getVehicles();
  }

  getVehicles(): void{
    this.service.getVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles = data;
    });
  }

  navigateToListVehiclesByCompany(): void{
    this.router.navigate(['/vehicle/list-vehicles'])
  }
}
