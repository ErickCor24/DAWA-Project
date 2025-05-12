import { Company } from './../../../models/Company';
import { UserCompany } from './../../../models/UserCompany';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { MatRadioModule } from '@angular/material/radio';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-company',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatRadioModule, RouterLink],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCompanyComponent implements OnInit {

  companyForm!: FormGroup;
  companies: Company[] = [];

  constructor(private _companyServ: CompanyService, private _userCompServ: UserCompanyService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      email: [''],
      phone: [''],
      rucNumber: [''],
      userName: [''],
      password: ['']
    });
    this.screenAllData();
  }

  registerCompanyAndUser(event: Event): void {
    event.preventDefault();
    const rawFormValue = this.companyForm.value;
    let id: number = this.companies.length + 1;

    if (this.companyForm.valid) {
      const company: Company = this.createCompanyObject(rawFormValue, id);
      const userCompany: UserCompany = this.createUserCompany(rawFormValue, id);

      this.registerCompanyUser(userCompany, company);
      this.screenAllData();
    }
  }

  screenAllData(): void {
    this._companyServ.getCompanies().subscribe(data => {
      console.log(data);
      this.companies = data;
    })
    this._userCompServ.getUserCompanies().subscribe(data => {
      console.log(data);
    })
  }

  registerCompanyUser = (user: UserCompany, company: Company) => {
    this._companyServ.addCompany(company).subscribe(data => {
      alert("Company registered successfully");
    });
    this._userCompServ.addUserCompany(user).subscribe(data => {
      alert("User Company registered done");
    })
  }

  createCompanyObject = (rawFormValue: any, id: number): Company => {
    const company: Company = {
      idCompany: id,
      name: rawFormValue.name,
      contactPerson: rawFormValue.contactPerson,
      email: rawFormValue.email,
      phone: rawFormValue.phone,
      rucNumber: rawFormValue.rucNumber,
      registerDate: new Date(),
      status: true
    }
    return company;
  }

  createUserCompany = (rawFormValue: any, id: number): UserCompany => {
    const userCompany: UserCompany = {
      idUserCompany: id,
      idCompany: id,
      userName: rawFormValue.userName,
      password: rawFormValue.password
    }
    return userCompany;
  }

}
