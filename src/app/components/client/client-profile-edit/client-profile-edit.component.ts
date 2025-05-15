import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { ClientService } from '../../../services/clients/client.service';
import { ClientSessionService } from '../../../services/clients/client-session.service';
import { Client } from '../../../models/clients/client.model';

@Component({
  selector: 'app-client-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ButtonComponent
  ],
  templateUrl: './client-profile-edit.component.html',
  styleUrls: ['./client-profile-edit.component.css']
})
export class ClientProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private session = inject(ClientSessionService);
  private dialogService = inject(DialogService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  client: Client | null = null;
  loading = signal(false);

  ngOnInit(): void {
    const sessionClient = this.session.getClient();

    if (!sessionClient || !sessionClient.id) {
      this.router.navigate(['/client/login']);
      return;
    }

    this.clientService.getAllClients().subscribe(clients => {
      const found = clients.find(c => c.id === sessionClient.id);

      if (!found || !found.status) {
        this.session.clear();
        this.router.navigate(['/client/login']);
        return;
      }

      this.client = found;

      this.form = this.fb.group({
        fullName: [found.fullName, [Validators.required, Validators.minLength(3)]],
        phone: [found.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        address: [found.address, Validators.required],
        nationality: [found.nationality, Validators.required]
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.client) return;

    this.dialogService
      .openDialog(
        '¿Confirmar cambios?',
        '¿Estás seguro de guardar los cambios en tu perfil?',
        () => this.updateClient()
      )
      .subscribe();
  }

  private updateClient(): void {
    if (!this.client || !this.client.id) {
      this.dialogService.openDialog('Error', 'No se encontró el identificador del cliente.', () => {}).subscribe();
      return;
    }

    this.loading.set(true);

    const updatedClient: Client = {
      ...this.client,
      ...this.form.value
    };

    this.clientService.updateClient(this.client.id, updatedClient).subscribe({
      next: (response) => {
        this.session.setClient(response);
        this.snackBar.open('Perfil actualizado correctamente.', '', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/client/profile']);
      },
      error: () => {
        this.dialogService.openDialog('Error', 'No se pudo actualizar el perfil.', () => {}).subscribe();
      },
      complete: () => this.loading.set(false)
    });
  }

  goBack(): void {
    this.router.navigate(['/client/profile']);
  }
}
