import { UserCompany } from './../../../models/UserCompany';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterLink } from '@angular/router';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-user-company',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatRadioModule, RouterLink, CommonModule],
  templateUrl: './login-user-company.component.html',
  styleUrl: './login-user-company.component.css'
})
export class LoginUserCompanyComponent implements OnInit {

  companyLoginForm!: FormGroup;
  messageLogin: string = " ";

  constructor(private fb: FormBuilder, private _userService: UserCompanyService, private router: Router) { }

  ngOnInit(): void {
    this.companyLoginForm = this.fb.group(
      {
        userName: [''],
        password: ['']
      }
    )
  }

  submitLogin = (event: Event) => {
    let result: boolean = true;
    const rawFormValue = this.companyLoginForm.value;
    this._userService.loginSystem(rawFormValue.userName.trim(), rawFormValue.password.trim()).subscribe(x => {
      console.log(x);
      if(!this._userService.createSessionUser(x)) {
        result = false;
        this.messageLogin = "Usuario no encontrado";
        console.log("no encontrado");
      } else this.router.navigate(['/home']);
    });
  }
}
