import { Component, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from '../../../models/Vehicle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DialogService } from '../../../services/dialog-box/dialog.service';

@Component({
  selector: 'app-view-vehicles',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ButtonComponent,
    MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatPaginator,
  ],
  templateUrl: './view-vehicles.component.html',
  styleUrl: './view-vehicles.component.css'
})
export class ViewVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  formSearch!: FormGroup;

  displayedColumns: string[] = ['poster', 'brand', 'model', 'year', 'plateNumber', 'color', 'type', 'transmission', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>();

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

  idCompany!: string;
  idClient!: string;

  ngOnInit(): void {
    console.log(`idCompanyLogued ${sessionStorage.getItem('idCompany')}`);
    this.idCompany = sessionStorage.getItem('idCompany') ?? '';
    //this.idClient = '1'; //para probar con cliente
    if (this.idCompany != null &&
      typeof this.idCompany === 'string' &&
      this.idCompany != '') {
      this.loadVehicles(this.idCompany);
    } else if (this.idClient != null &&
      typeof this.idClient === 'string' &&
      this.idClient != '') {
      this.loadVehicles();
    } else {
      this.navigateTo("/company/login")
    }
    this.formSearch = this.fb.group({
      searchBy: ['', Validators.required],
      inputSearch: ['', Validators.required]
    })
  }

  loadVehicles(idCompany?: string): void {
    if (idCompany) {
      this.service.getVehicles(idCompany).subscribe((data: Vehicle[]) => {
        this.dataSource.data = data;
      })
    } else {
      this.service.getVehicles().subscribe((data: Vehicle[]) => {
        this.vehicles = data;
      });
    }
  }

  navigateTo(toComponent: string): void {
    this.router.navigate([`/${toComponent}`]);
  }

  searchVehicle(): void {
    const field = this.formSearch.get('searchBy')?.value;
    const dataInput = this.formSearch.get('inputSearch')?.value;
    if (field && dataInput) {
      this.service.getVehicleByField(field, dataInput).subscribe((data: Vehicle[]) => {
        if (this.idCompany != null && this.idCompany != '') {
          this.dataSource.data = data;
        } else {
          this.vehicles = data;
        }
      });
    } else {
      if (this.idCompany != null && this.idCompany != '') {
        this.loadVehicles(this.idCompany);
      } else {
        this.loadVehicles();
      }
    }
  }

  updateVehicle(vehicle: Vehicle): void {
    if (vehicle && typeof vehicle.id === 'string') {
      this.router.navigate(['/vehicle/update', vehicle.id]);
      console.log(`VEHICULO ID: ${vehicle.id}`);
    } else {
      console.error('Vehicle ID is undefined.');
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
