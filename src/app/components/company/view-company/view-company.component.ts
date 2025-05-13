import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { Company } from '../../../models/Company';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-company',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './view-company.component.html',
  styleUrl: './view-company.component.css',
})
export class ViewCompanyComponent implements OnInit {

  token = sessionStorage.getItem('idCompany');
  company!: Company;
  hide = signal(true);
  formProfile!: FormGroup;
  hidden: boolean = false;

  constructor(private _companyService: CompanyService, private fb: FormBuilder, private router: Router) { }


  ngOnInit(): void {
    this.getCompanyLogged();
  }

  //get data of comoany logged and set in company variable
  getCompanyLogged = () => {
    if (typeof this.token === 'string') {
      this._companyService.getCompanyById(this.token.toString()).subscribe(data => {
        if (typeof data !== 'number') {
          this.company = data;
          this.createFormObject(data);
        }
      })
    }
  }

  updateCompany = (): void => {
    const rawFormValue = this.formProfile.value;
    const company: Company = {
      id: this.token!.toString(),
      name: rawFormValue.name,
      contactPerson: rawFormValue.contactPerson,
      email: rawFormValue.email,
      phone: rawFormValue.phone,
      rucNumber: rawFormValue.ruc,
      registerDate: this.company.registerDate,
      status: true
    }
    console.log(company);
    this._companyService.updateCompany(company, this.token!).subscribe(
      {
        next: (data) => console.log('Update:', data),
        error: (err) => console.error('Error tryng update:', err)
      }
    );
  }


  //Create form object with company attribute
  createFormObject = (object: Company): void => {
    this.formProfile = this.fb.group({
      name: [{ value: object.name, disabled: true }],
      contactPerson: [{ value: object.contactPerson, disabled: true }],
      email: [{ value: object.email, disabled: true }],
      phone: [{ value: object.phone, disabled: true }, [Validators.required, Validators.maxLength(10)]],
      ruc: [{ value: object.rucNumber, disabled: true }, [Validators.required, Validators.minLength(13)]]
    })
  }

  //Evento to show the password
  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  //Change to treu or false to hidden buttons
  changeStatusButtons = (): void => {
    this.hidden = !this.hidden;
  }

  enableInputs = (): void => {
    this.formProfile.get('name')?.enable();
    this.formProfile.get('contactPerson')?.enable();
    this.formProfile.get('email')?.enable();
    this.formProfile.get('phone')?.enable();
    this.formProfile.get('ruc')?.enable();
  }

  disabledInputs = (): void => {
    this.formProfile.get('name')?.disable();
    this.formProfile.get('contactPerson')?.disable();
    this.formProfile.get('email')?.disable();
    this.formProfile.get('phone')?.disable();
    this.formProfile.get('ruc')?.disable();
    this.createFormObject(this.company);
  }
}
