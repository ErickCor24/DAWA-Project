import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgencyRoutes } from './agency.routes';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Componentes standalone
import { AgencyManagementComponent } from './agency-management/agency-management.component';
import { AgencyFormComponent } from './agency-form/agency-form.component';
import { AgencyListComponent } from './agency-list/agency-list.component';
import { AgencyFilterComponent } from './agency-filter/agency-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AgencyRoutes),
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

    // Importa componentes standalone 
    AgencyManagementComponent,
    AgencyFormComponent,
    AgencyListComponent,
    AgencyFilterComponent,
  ]
})
export class AgencyModule {}