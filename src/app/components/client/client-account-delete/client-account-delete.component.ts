import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { ButtonComponent } from "../../shared/button/button.component";
import { DialogService } from "../../../services/dialog-box/dialog.service";
import { ClientService } from "../../../services/clients/client.service";
import { AuthServiceService } from "../../../services/auth/auth-service.service";

@Component({
  selector: "app-client-account-delete",
  standalone: true,
  templateUrl: "./client-account-delete.component.html",
  styleUrls: ["./client-account-delete.component.css"],
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonComponent],
})
export class ClientAccountDeleteComponent {
  private router = inject(Router);
  private clientService = inject(ClientService);
  private dialogService = inject(DialogService);
  private authService = inject(AuthServiceService);

  onDelete(): void {
    const clientId = this.authService.getIdToken();

    if (!clientId) {
      this.dialogService
        .openDialog(
          "Error",
          "No se pudo obtener tu identidad desde el token.",
          () => {},
          "/client/login"
        )
        .subscribe();
      this.authService.removeAuthToken();
      return;
    }

    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        if (!client || !client.status) {
          this.dialogService
            .openDialog(
              "Error",
              "El cliente no existe o está inactivo.",
              () => {},
              "/client/login"
            )
            .subscribe();
          this.authService.removeAuthToken();
          return;
        }

        this.dialogService
          .openDialog(
            "Eliminar cuenta",
            "¿Estás seguro de que deseas eliminar tu cuenta?",
            () => {
              this.clientService.deleteClientLogically(client.id!).subscribe({
                next: () => {
                  this.authService.removeAuthToken();
                  this.dialogService
                    .openDialog(
                      "Cuenta eliminada",
                      "Tu cuenta ha sido desactivada correctamente.",
                      () => {},
                      "/client/login"
                    )
                    .subscribe();
                },
                error: (error) => {
                  console.error("Error al eliminar cuenta:", error);
                  let errorMessage = "No se pudo eliminar la cuenta.";

                  if (error.status === 404) {
                    errorMessage = "El cliente no fue encontrado.";
                  } else if (error.status === 400) {
                    errorMessage = "Datos inválidos para la eliminación.";
                  } else if (error.error?.message) {
                    errorMessage = error.error.message;
                  }

                  this.dialogService
                    .openDialog("Error", errorMessage, () => {})
                    .subscribe();
                },
              });
            }
          )
          .subscribe();
      },
      error: (error) => {
        console.error("Error al verificar cliente:", error);
        let errorMessage = "No se pudo verificar la existencia del cliente.";

        if (error.status === 404) {
          errorMessage = "El cliente no existe en el servidor.";
        }

        this.dialogService
          .openDialog("Error", errorMessage, () => {})
          .subscribe();
      },
    });
  }
}
