import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../services/agency/agency.service';
import { Agency } from '../../../models/agency';
import { AgencyListComponent } from '../agency-list/agency-list.component';
import { AgencyFormComponent } from '../agency-form/agency-form.component';
import { AgencyFilterComponent } from '../agency-filter/agency-filter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agency-management',
  standalone: true,
  imports: [
    CommonModule,
    AgencyListComponent,
    AgencyFormComponent,
    AgencyFilterComponent
  ],
  templateUrl: './agency-management.component.html',
  styleUrls: ['./agency-management.component.css']
})
export class AgencyManagementComponent implements OnInit {
  agencies: Agency[] = [];
  filteredAgencies: Agency[] = [];
  selectedAgency: Agency | null = null;

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    this.agencyService.getAgencies().subscribe((data) => {
      this.agencies = data;
      this.filteredAgencies = [...this.agencies];
    });
  }

  onFilterChange(term: string): void {
    const lowerTerm = term.toLowerCase();
    this.filteredAgencies = this.agencies.filter(agency =>
      agency.name.toLowerCase().includes(lowerTerm) ||
      agency.address.toLowerCase().includes(lowerTerm) ||
      agency.email.toLowerCase().includes(lowerTerm)
    );
  }

  onSaveAgency(agency: Agency): void {
    if (this.selectedAgency) {
      // Edición
      const index = this.agencies.findIndex(a => a === this.selectedAgency);
      if (index !== -1) {
        this.agencies[index] = { ...this.selectedAgency, ...agency };
      }
    } else {
      // Nuevo
      this.agencies.push(agency);
    }
    this.filteredAgencies = [...this.agencies];
    this.selectedAgency = null;
  }

  onEditAgency(agency: Agency): void {
    this.selectedAgency = { ...agency };
  }

  onDeleteAgency(agency: Agency): void {
    this.agencies = this.agencies.filter(a => a !== agency);
    this.filteredAgencies = [...this.agencies];
    if (this.selectedAgency === agency) {
      this.selectedAgency = null;
    }
  }
}
