import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../shared/button/button.component';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { ClientService } from '../../../services/clients/client.service';
import { ClientSessionService } from '../../../services/clients/client-session.service';

@Component({
  selector: 'app-client-account-delete',
  standalone: true,
  templateUrl: './client-account-delete.component.html',
  styleUrls: ['./client-account-delete.component.css'],
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonComponent]
})
export class ClientAccountDeleteComponent {
  private router = inject(Router);
  private clientService = inject(ClientService);
  private dialogService = inject(DialogService);
  private session = inject(ClientSessionService);

  onDelete(): void {
    const sessionClient = this.session.getClient();

    if (!sessionClient || !sessionClient.id) {
      this.dialogService.openDialog('Error', 'No se pudo obtener la sesión del cliente.', () => {}).subscribe();
      return;
    }

    this.clientService.getAllClients().subscribe(clients => {
      const found = clients.find(c => c.id === sessionClient.id);

      if (!found) {
        this.dialogService.openDialog('Error', 'El cliente no existe en el servidor.', () => {}).subscribe();
        return;
      }

      this.dialogService.openDialog(
        'Eliminar cuenta',
        '¿Estas seguro de que deseas eliminar tu cuenta?',
        () => {
          this.clientService.deleteClientLogically(found.id).subscribe({
            next: (updatedClient) => {
              if (updatedClient.status === false) {
                this.session.clear();
                this.dialogService.openDialog(
                  'Cuenta eliminada',
                  'Tu cuenta ha sido desactivada correctamente.',
                  () => {},
                  '/client/login'
                ).subscribe();
              } else {
                this.dialogService.openDialog(
                  'Error',
                  'La cuenta no se desactivo correctamente.',
                  () => {}
                ).subscribe();
              }
            },
            error: () => {
              this.dialogService.openDialog(
                'Error',
                'No se pudo eliminar la cuenta.',
                () => {}
              ).subscribe();
            }
          });
        }
      ).subscribe();
    });
  }
}
