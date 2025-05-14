import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { Company } from '../../../models/Company';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { DialogService } from '../../../services/dialog-box/dialog.service';

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


  constructor(private _companyService: CompanyService, private _userService: UserCompanyService, private fb: FormBuilder, private router: Router, private _dialogService: DialogService) { }


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
    if (this.formProfile.valid) {
      const rawFormValue = this.formProfile.value;
      const company: Company = {
        id: this.token!.toString(),
        name: rawFormValue.name,
        contactPerson: rawFormValue.contactPerson,
        email: rawFormValue.email,
        phone: "0" + rawFormValue.phone,
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
  }

  deleteCompany = () => {
    this._dialogService.openDialog("Eliminar", "Estas seguro que quieres eliminar", this.deleteObjects, "/company/login").subscribe(x => x === true ? sessionStorage.removeItem('idCompany') : false)
  }


  deleteObjects = () => {
    this._companyService.deleteCompany(this.token!.toString()).subscribe(x => {
      console.log("Account company deleted");
    });
    this._userService.deleteUserCompany(this.token!.toString()).subscribe(x => {
      console.log("Account company deleted");
    });
  }

  //Create form object with company attribute
  createFormObject = (object: Company): void => {
    this.formProfile = this.fb.group({
      name: [{ value: object.name, disabled: true }, [Validators.required]],
      contactPerson: [{ value: object.contactPerson, disabled: true }, [Validators.required]],
      email: [{ value: object.email, disabled: true }, [Validators.required]],
      phone: [{ value: object.phone, disabled: true }, [Validators.required, Validators.max(999999999), Validators.min(100000000)]],
      ruc: [{ value: object.rucNumber, disabled: true }, [Validators.required, Validators.max(9999999999999)]]
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
