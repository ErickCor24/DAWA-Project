import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-company-vehicles',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    ButtonComponent, MatTableModule, MatPaginatorModule, MatInputModule],
  templateUrl: './view-company-vehicles.component.html',
  styleUrl: './view-company-vehicles.component.css'
})
export class ViewCompanyVehiclesComponent implements OnInit {

  private authService = inject(AuthServiceService);

  formSearch!: FormGroup;
  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  idCompany!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private service: VehicleService,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  this.idCompany = this.authService.getIdToken();
  console.log(`idCompanyLoguedInt ${this.idCompany}`);
  if (!isNaN(this.idCompany) && this.idCompany !== -1) {
    this.loadVehicles(this.idCompany);
  } else {
    this.navigateTo("/company/login");
  }
  this.formSearch = this.fb.group({
    searchBy: ['', Validators.required],
    inputSearch: ['', Validators.required]
  });
}

  loadVehicles(idCompany: number): void {
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
    console.log(field,dataInput);
    if (field && dataInput) {
      this.service.getVehicleByField(field, dataInput).subscribe((data: Vehicle[]) => {
        this.dataSource.data = data.filter(vehicle => vehicle.companyId === this.idCompany);
      });
    } else {
      this.loadVehicles(this.idCompany);
    }
  }

  updateVehicle(vehicle: Vehicle): void {
    if (vehicle && typeof vehicle.id === 'number') {
      this.router.navigate(['/vehicle/update', vehicle.id]);
      console.log(`VEHICULO ID: ${vehicle.id}`);
    } else {
      this.navigateTo('/not-found');
    }
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.dialogService.openDialog("Eliminar vehículo", "¿Estás seguro de eliminar este vehículo?",
      () => this.deleteVehicleObject(vehicle)
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.deleteVehicleObject(vehicle);
      }
    });
  }

  deleteVehicleObject(vehicle: Vehicle): void {
    this.service.deleteVehicle(vehicle).subscribe(() => {
      this.loadVehicles(this.idCompany);
      console.log("Vehículo eliminado");
    });
  }
}
