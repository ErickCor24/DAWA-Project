import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-vehicles',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatButtonModule],
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.css'
})
export class ListVehiclesComponent {

  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.service.getVehicles(1).subscribe((data: Vehicle[]) => {
      this.dataSource.data = data;
    })
  }

  navigateToCreateVehicle(): void {
    this.router.navigate(['/vehicle/create-vehicle']);
  }

  updateVehicle(vehicle: Vehicle): void {
  console.log('Selected vehicle for update:', vehicle);
  if (vehicle && typeof vehicle.id === 'string') {
    this.router.navigate(['/vehicle/update-vehicle', vehicle.id]);
    console.log(`VEHICULO ID: ${vehicle.id}`)
  } else {
    console.error('Vehicle ID is undefined. Cannot navigate.');
  }
}


  deleteVehicle(): void {

  }
}
