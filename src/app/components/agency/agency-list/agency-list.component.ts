import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agency } from '../../../models/agency';

@Component({
  selector: 'app-agency-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css']
})
export class AgencyListComponent {
  @Input() agencies: Agency[] = [];
  @Output() editAgency = new EventEmitter<Agency>();
  @Output() deleteAgency = new EventEmitter<Agency>();

  onEdit(agency: Agency) {
    this.editAgency.emit(agency);
  }

  onDelete(agency: Agency) {
    this.deleteAgency.emit(agency);
  }
}


