import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DialogService } from '../../../services/dialog-box/dialog.service';

@Component({
  selector: 'app-list-vehicles',
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatButtonModule, MatFormFieldModule, MatSelectModule,
    ReactiveFormsModule, MatInputModule, ButtonComponent],
  templateUrl: './list-vehicles.component.html',
  styleUrl: './list-vehicles.component.css'
})
export class ListVehiclesComponent implements OnInit{

  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  formSearch!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private service: VehicleService, private fb: FormBuilder, private router: Router, private dialogService: DialogService) { }

  idCompany!: string;


  ngOnInit(): void {
    console.log(`idCompanyLogued ${sessionStorage.getItem('idCompany')}`);
    this.idCompany = sessionStorage.getItem('idCompany') ?? '';
    if (this.idCompany != null &&
      typeof this.idCompany === 'string' &&
      this.idCompany != '') {
      this.loadVehicles(this.idCompany);
      this.formSearch = this.fb.group({
        searchBy: [''],
        inputSearch: ['']
      })
    } else {
      this.navigateTo("company/login");
    }

  }

  loadVehicles(idCompany: string): void {
    this.service.getVehicles(idCompany).subscribe((data: Vehicle[]) => {
      this.dataSource.data = data;
    })
  }

  navigateTo(toComponent: string): void {
    this.router.navigate([`/${toComponent}`]);
  }

  searchVehicle(): void {
    const field = this.formSearch.get('searchBy')?.value;
    const dataInput = this.formSearch.get('inputSearch')?.value;
    if (field && dataInput) {
      this.service.getVehicleByField(field, dataInput).subscribe((data: Vehicle[]) => {
        this.dataSource.data = data;
      });
    } else {
      this.loadVehicles(this.idCompany);
    }
  }

  updateVehicle(vehicle: Vehicle): void {
    console.log('Selected vehicle for update:', vehicle);
    if (vehicle && typeof vehicle.id === 'string') {
      this.router.navigate(['/vehicle/update', vehicle.id]);
      console.log(`VEHICULO ID: ${vehicle.id}`)
    } else {
      console.error('Vehicle ID is undefined.');
    }
  }


  deleteVehicle(vehicle: Vehicle): void {
  this.dialogService.openDialog("Eliminar vehículo","¿Estás seguro de eliminar este vehículo?",
    () => this.deleteVehicleObject(vehicle)
  ).subscribe((confirmed) => {
    if (confirmed) {
      this.deleteVehicleObject(vehicle);
    }
  });
}

deleteVehicleObject(vehicle: Vehicle): void {
  this.service.deleteVehicle(vehicle).subscribe(() => {
    console.log("Vehículo eliminado");
  });
}
}
