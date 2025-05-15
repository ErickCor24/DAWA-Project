import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Agency } from '../../../models/agency';
import { AgencyService } from '../../../services/agency/agency.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-agency-management',
  standalone: true,
  templateUrl: './agency-management.component.html',
  styleUrls: ['./agency-management.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AgencyManagementComponent implements OnInit {

  displayedColumns: string[] = ['idAgency', 'name', 'address', 'phone', 'email', 'workingHours', 'status'];
  dataSource = new MatTableDataSource<Agency>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private agencyService: AgencyService) { }

  
  ngOnInit(): void {
    this.getAgencies();
  }

  getAgencies(): void {
    this.agencyService.getAgencies().subscribe((data: Agency[]) => {
      this.dataSource.data = data;

      // Asigna el paginador después de que el DOM esté listo
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

