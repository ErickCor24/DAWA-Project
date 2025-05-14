import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-list-vehicles',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatButtonModule, MatFormFieldModule, MatSelectModule,
    ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.css'
})
export class ListVehiclesComponent {

  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  formSearch!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.formSearch = this.fb.group({
      searchBy: [''],
      inputSearch: ['']
    })
  }

  loadVehicles(): void {
    this.service.getVehicles("1").subscribe((data: Vehicle[]) => {
      this.dataSource.data = data;
    })
  }

  navigateToCreateVehicle(): void {
    this.router.navigate(['/vehicle/create-vehicle']);
  }

  searchVehicle(): void {
    const field = this.formSearch.get('searchBy')?.value;
    const dataInput = this.formSearch.get('inputSearch')?.value;
    if (field && dataInput) {
      this.service.getVehicleByField(field, dataInput).subscribe((data: Vehicle[]) => {
        this.dataSource.data = data;
      });
    } else {
      this.loadVehicles();
    }
  }

  updateVehicle(vehicle: Vehicle): void {
    console.log('Selected vehicle for update:', vehicle);
    if (vehicle && typeof vehicle.id === 'string') {
      this.router.navigate(['/vehicle/update-vehicle', vehicle.id]);
      console.log(`VEHICULO ID: ${vehicle.id}`)
    } else {
      console.error('Vehicle ID is undefined.');
    }
  }


  deleteVehicle(): void {

  }
}
