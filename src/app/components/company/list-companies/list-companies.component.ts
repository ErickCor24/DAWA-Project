import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Company } from '../../../models/Company';
import { CompanyService } from '../../../services/company/company.service';
import { CommonModule } from '@angular/common';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-list-companies',
  imports: [MatIconModule, CommonModule, MatFormField, MatLabel, MatInput],
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.css'
})
export class ListCompaniesComponent implements OnInit {

  companies: Company[] = [];

  constructor(private _companyService: CompanyService) { }


  ngOnInit(): void {
    this.getAllCompanies();
  }


  searchNameCompany = (serachInput: HTMLInputElement) =>{
    if(serachInput.value){
      this.getAllCompaniesByInput(serachInput.value);
    } else {
      this.getAllCompanies();
    }
  }

  getAllCompanies = () => {
    this._companyService.getCompanies().subscribe(data => {
      this.companies = data;
    })
  }

  getAllCompaniesByInput = (input: string) => {
    this._companyService.getCompaniesByName(input).subscribe( data => {
      this.companies = data;
    })
  }
}
