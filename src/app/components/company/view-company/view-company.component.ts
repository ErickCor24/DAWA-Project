import { ChangeDetectionStrategy, Component, Input, OnInit, signal} from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { Company } from '../../../models/company';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,  Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserCompanyService } from '../../../services/user-company/user-company.service';
import { DialogService } from '../../../services/dialog-box/dialog.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthServiceService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-view-company',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
  ],
  templateUrl: './view-company.component.html',
  styleUrl: './view-company.component.css',
})
export class ViewCompanyComponent implements OnInit {

  company!: Company;
  hide = signal(true);
  formProfile!: FormGroup;
  hidden: boolean = false;

  constructor(
    private _companyService: CompanyService,
    private _userService: UserCompanyService,
    private fb: FormBuilder,
    private router: Router,
    private _dialogService: DialogService,
    private _authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getCompanyLogged();
  }

  //get data of comoany logged and set in company variable
  getCompanyLogged = () => {
    this._companyService.getCompanyById(this._authService.getIdToken()).subscribe((data) => {
      
      if (this._companyService.isCompany(data.result)) {
        this.company = data.result;
        this.createFormObject(data.result);
      }

    });
  };

  updateCompany = (): void => {
    if (this.formProfile.valid) {
      const rawFormValue = this.formProfile.value;
      const company: Company = {
        id: 0,
        name: rawFormValue.name,
        contactPerson: rawFormValue.contactPerson,
        email: rawFormValue.email,
        phone: rawFormValue.phone.toString(),
        rucNumber: rawFormValue.ruc.toString(),
        registerDate: this.company.registerDate,
        status: true,
      };
      console.log("Object company create");
      console.log(company);
      this._companyService.updateCompany(company, this._authService.getIdToken()).subscribe(response => {
        if(response.result){
          console.log("User comoany profile has updated",response.result);
          this.router.navigate(['/home'])
        } else{
          console.log("A error has ocurred",response.result);
        }
      });
    }
  };

  deleteCompany = () => {
    this._dialogService
      .openDialog(
        'Eliminar',
        'Estas seguro que quieres eliminar',
        this.deleteObjects,
        '/company/login'
      )
      .subscribe((x) =>{
        if(x) {
          this._authService.removeAuthToken() 
          this.router.navigate(['/home'])}
        }
      );
  };

  deleteObjects = () => {
    this._companyService
      .deleteCompany(this._authService.getIdToken())
      .subscribe((x) => {
        console.log('Account company deleted');
      });
  };

  //Create form object with company attribute
  createFormObject = (object: Company): void => {
    this.formProfile = this.fb.group({
      name: [{ value: object.name, disabled: true }, [Validators.required]],
      contactPerson: [
        { value: object.contactPerson, disabled: true },
        [Validators.required],
      ],
      email: [{ value: object.email, disabled: true }, [Validators.required]],
      phone: [
        { value: object.phone, disabled: true },
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      ruc: [
        { value: object.rucNumber, disabled: true },
        [Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13)
        ],
      ],
    });
  };

  //Evento to show the password
  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  //Change to treu or false to hidden buttons
  changeStatusButtons = (): void => {
    this.hidden = !this.hidden;
  };

  enableInputs = (): void => {
    this.formProfile.get('name')?.enable();
    this.formProfile.get('contactPerson')?.enable();
    this.formProfile.get('email')?.enable();
    this.formProfile.get('phone')?.enable();
    this.formProfile.get('ruc')?.enable();
  };

  disabledInputs = (): void => {
    this.formProfile.get('name')?.disable();
    this.formProfile.get('contactPerson')?.disable();
    this.formProfile.get('email')?.disable();
    this.formProfile.get('phone')?.disable();
    this.formProfile.get('ruc')?.disable();
    this.createFormObject(this.company);
  };
}
