import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgencyRoutes } from './agency.routes';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Importa el componente como standalone
import { AgencyManagementComponent } from './agency-management/agency-management.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AgencyRoutes),
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AgencyModule { }

