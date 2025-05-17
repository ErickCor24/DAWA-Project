import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Vehicle } from '../../../models/Vehicle';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-company-vehicles',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule,
    ButtonComponent, MatTableModule, MatPaginatorModule, MatInputModule
  ],
  templateUrl: './view-company-vehicles.component.html',
  styleUrl: './view-company-vehicles.component.css'
})
export class ViewCompanyVehiclesComponent implements OnInit{

  formSearch!: FormGroup;
  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

  idCompany!: string;

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
    console.log(`idCompanyLogued ${sessionStorage.getItem('idCompany')}`);
    this.idCompany = sessionStorage.getItem('idCompany') ?? '';
    if (this.idCompany != null &&
      typeof this.idCompany === 'string' &&
      this.idCompany != '') {
      this.loadVehicles(this.idCompany);
    } else {
      this.navigateTo("/company/login");
    }
    this.formSearch = this.fb.group({
      searchBy: ['', Validators.required],
      inputSearch: ['', Validators.required]
    });
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
    if (vehicle && typeof vehicle.id === 'string') {
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
      console.log("Vehículo eliminado");
    });
  }
}
