import {Company} from '../../../models/company'
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

  constructor(private _companyServ: CompanyService, private _userCompServ: UserCompanyService, private fb: FormBuilder, private router: Router) { }

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
      const company: Company = this.createCompanyObject(rawFormValue);
      console.log(company);
      this.registerCompanyUser(company, rawFormValue.password);
    }
  }

  registerCompanyUser = (company: Company, password: string) => {
    this._companyServ.addCompany(company, password).subscribe(data => {
      console.log("Company registered successfully");
      console.log(data.isSucces);
      if(data.isSucces) this.router.navigate(["/home"])
    });
  }

  createCompanyObject = (rawFormValue: any): Company => {
    const company: Company = {
      id: 0,
      name: rawFormValue.name,
      contactPerson: rawFormValue.contactPerson,
      email: rawFormValue.email,
      phone: "0" + rawFormValue.phone,
      rucNumber: rawFormValue.rucNumber.toString(),
      registerDate: new Date(),
      status: true
    }
    return company;
  }
}
