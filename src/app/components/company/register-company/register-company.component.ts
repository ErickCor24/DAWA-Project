import { Company } from './../../../models/Company';
import { UserCompany } from './../../../models/UserCompany';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-register-company',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatRadioModule, RouterLink, ButtonComponent],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCompanyComponent implements OnInit {

  companyForm!: FormGroup;
  companies: Company[] = [];
  randomCode: string;

  constructor(private _companyServ: CompanyService, private _userCompServ: UserCompanyService, private fb: FormBuilder, private router: Router) { this.randomCode = this.generateRandomString(4) }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', [Validators.required, Validators.max(999999999), Validators.min(111111111)]],
      rucNumber: ['', [Validators.required, Validators.max(9999999999999)]],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(8)]]
    });
  }

  registerCompanyAndUser(event: Event): void {
    event.preventDefault();
    const rawFormValue = this.companyForm.value;

    if (this.companyForm.valid) {
      const company: Company = this.createCompanyObject(rawFormValue, this.randomCode);
      const userCompany: UserCompany = this.createUserCompany(rawFormValue, this.randomCode);
      this.registerCompanyUser(userCompany, company);
    }
  }

  registerCompanyUser = (user: UserCompany, company: Company) => {
    this._companyServ.addCompany(company).subscribe(data => {
      console.log("Company registered successfully");
    });
    this._userCompServ.addUserCompany(user).subscribe(data => {
      console.log("Company registered successfully");
    })
    this.router.navigate(['/company/login']);
  }

  createCompanyObject = (rawFormValue: any, id: string): Company => {
    const company: Company = {
      id: id,
      name: rawFormValue.name,
      contactPerson: rawFormValue.contactPerson,
      email: rawFormValue.email,
      phone: "0" + rawFormValue.phone,
      rucNumber: rawFormValue.rucNumber,
      registerDate: new Date(),
      status: true
    }
    return company;
  }

  createUserCompany = (rawFormValue: any, id: string): UserCompany => {
    const userCompany: UserCompany = {
      id: id,
      idCompany: id,
      userName: rawFormValue.userName,
      password: rawFormValue.password
    }
    return userCompany;
  }


  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}
