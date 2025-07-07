import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AuthServiceService } from '../../../services/auth/auth-service.service';

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
    RouterLink
  ],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent {
  loginForm: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthServiceService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const email = formValue.userName.trim();
      const password = formValue.password.trim();

      this.authService.loginUserClient(email, password).subscribe(response => {
        if (response.isSucces) {
          this.authService.setAuthToken(response.token);
          console.log('Token guardado para cliente:\n' + this.authService.getAuthToken());

          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });

          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Usuario o contraseña incorrectos', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
