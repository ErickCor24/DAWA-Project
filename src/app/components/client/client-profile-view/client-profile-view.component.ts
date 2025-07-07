import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

import { ClientAccountDeleteComponent } from '../client-account-delete/client-account-delete.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ClientService } from '../../../services/clients/client.service';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { Client } from '../../../models/clients/client.model';

@Component({
  selector: 'app-client-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    ClientAccountDeleteComponent,
    ButtonComponent
  ],
  templateUrl: './client-profile-view.component.html',
  styleUrls: ['./client-profile-view.component.css']
})
export class ClientProfileViewComponent implements OnInit {
  private router = inject(Router);
  private clientService = inject(ClientService);
  private authService = inject(AuthServiceService);

  client: Client | null = null;

  ngOnInit(): void {
    const clientId = this.authService.getIdToken();

    if (!clientId) {
      this.authService.removeAuthToken();
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getClientById(clientId).subscribe({
      next: (clientData) => {
        if (!clientData || !clientData.status) {
          this.authService.removeAuthToken();
          this.router.navigate(['/client/login']);
        } else {
          this.client = clientData;
        }
      },
      error: () => {
        this.authService.removeAuthToken();
        this.router.navigate(['/client/login']);
      }
    });
  }

  goToEdit(): void {
    this.router.navigate(['/client/edit-profile']);
  }

  logout(): void {
    this.authService.removeAuthToken();
    this.router.navigate(['/client/login']);
  }

  goToReservationHistory(): void {
    this.router.navigate(['/reserve/client-history']);
  }
}
