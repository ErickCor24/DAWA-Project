import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

import { ClientService } from '../../../services/clients/client.service';
import { Client } from '../../../models/clients/client.model';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-client-search',
  standalone: true,
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    ButtonComponent
  ]
})
export class ClientSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  displayedColumns: string[] = ['id', 'fullName', 'email', 'ci', 'status'];
  dataSource: Client[] = [];
  filteredData: Client[] = [];

  searchForm = this.fb.group({
    query: ['']
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe(clients => {
      this.dataSource = clients;
      this.filteredData = clients;
    });
  }

  onSearch(): void {
    const term = (this.searchForm.get('query')?.value || '').trim().toLowerCase();

    this.filteredData = this.dataSource.filter(client =>
      client.fullName.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.ci.toLowerCase().includes(term)
    );
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}

