import { UserCompany } from './../../../models/UserCompany';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterLink } from '@angular/router';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../shared/button/button.component";
import { AuthServiceService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-login-user-company',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatRadioModule, RouterLink, CommonModule, ButtonComponent],
  templateUrl: './login-user-company.component.html',
  styleUrl: './login-user-company.component.css'
})
export class LoginUserCompanyComponent implements OnInit {

  companyLoginForm!: FormGroup;
  messageLogin: string = " ";

  constructor(private fb: FormBuilder, private _userService: UserCompanyService, private router: Router, private _authService: AuthServiceService) { }

  ngOnInit(): void {
    this.companyLoginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['']
      }
    )
  }

  submitLogin = () => {

    if (this.companyLoginForm.valid) {
      const rawFormValue = this.companyLoginForm.value;
      this._authService.loginUserCompany(rawFormValue.email.trim(), rawFormValue.password.trim())
      .subscribe(response => {

        if(response.isSucces){
          this._authService.setAuthToken(response.token);
          console.log('Test in login componente: \n' + this._authService.getAuthToken());
        }

      });
    }
  }
}
