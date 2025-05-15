import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';


import { AuthClientService } from '../../../services/clients/auth-client.service';
import { ClientSessionService } from '../../../services/clients/client-session.service';


@Component({
  selector: 'app-client-login',
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
  
  ],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent {
  loginForm: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthClientService);
  private session = inject(ClientSessionService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const form = {
      userName: this.loginForm.value.userName.trim(),
      password: this.loginForm.value.password.trim()
    };

    this.authService.loginAndFetchClient(form.userName, form.password).pipe(
      finalize(() => this.loading = false),
      catchError(error => {
        this.snackBar.open(error.message || 'Usuario o contraseña incorrectos', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
        return of(null);
      })
    ).subscribe(client => {
      if (client) {
        this.session.setClient(client);
        this.snackBar.open('Inicio de sesion exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/client/profile']);
      }
    });
  }
}
