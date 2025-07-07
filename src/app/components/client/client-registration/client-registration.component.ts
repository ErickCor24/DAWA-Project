import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule,provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { Client } from '../../../models/clients/client.model';
import { ClientService } from '../../../services/clients/client.service';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.css']
})
export class ClientRegistrationComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hide = signal(true);
  loading = false;

  registrationForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]
    ],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    ci: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    birthDate: ['', Validators.required],
    nationality: ['', Validators.required]
  });

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const form = this.registrationForm.value;
    const formattedDate = new Date(form.birthDate).toISOString().split('T')[0];

    const client: Client = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      ci: form.ci,
      address: form.address,
      birthDate: formattedDate,
      nationality: form.nationality,
      status: true,
    }

    this.clientService
      .createClient(client)
      .pipe(
        catchError(error => {
          this.loading = false;

          let errorMessage = 'Error al registrar el cliente.';

          if (error.status === 400) {
            if (error.error?.message?.includes('email')) {
              errorMessage =
                'Ya existe un cliente con este correo electrónico.';
            } else {
              errorMessage =
                'Datos inválidos. Por favor verifica la información.';
            }
          } else if (error.status === 409) {
            errorMessage =
              'Ya existe un cliente con este correo o cédula.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.showError(errorMessage);
          return of(null);
        })
      )
      .subscribe({
        next: (createdClient: Client | null) => {
          if (createdClient) {
            this.registrationForm.reset();
            this.loading = false;

            this.snackBar.open('Registro exitoso. ¡Bienvenido!', '', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });

            this.router.navigate(['/client/login']);
          }
        }
      });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }
}
