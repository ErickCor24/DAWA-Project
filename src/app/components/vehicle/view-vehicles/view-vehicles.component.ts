import { Component } from '@angular/core';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-vehicles',
  imports: [ MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './view-vehicles.component.html',
  styleUrl: './view-vehicles.component.css'
})
export class ViewVehiclesComponent {
  vehicles: Vehicle[] = [];

  constructor(private service: VehicleService, private router:  Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.getVehicles();
  }

  getVehicles(): void{
    this.service.getVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles = data;
    });
  }

  navigateToCreateVehicle(): void{
    this.router.navigate(['/vehicle/create-vehicle']);
  }
}
