import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Agency } from '../../../models/agency';

@Component({
  selector: 'app-agency-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agency-form.component.html',
  styleUrls: ['./agency-form.component.css'],
})
export class AgencyFormComponent implements OnChanges {
  @Input() agency: Agency | null = null;
  @Output() saveAgency = new EventEmitter<Agency>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      address: [''],
      phone: [''],
      email: [''],
      workingHours: [''],
      status: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['agency'] && this.agency) {
      this.form.patchValue(this.agency);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.saveAgency.emit(this.form.value);
    }
  }
}
