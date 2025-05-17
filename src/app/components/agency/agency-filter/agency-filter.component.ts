import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agency-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agency-filter.component.html',
  styleUrls: ['./agency-filter.component.css'],
})
export class AgencyFilterComponent {
  filterTerm: string = '';

  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  onFilterChange(): void {
    this.filterChange.emit(this.filterTerm);
  }
}

