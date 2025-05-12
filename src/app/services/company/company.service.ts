import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../../models/Company';
import { UserCompany } from '../../models/UserCompany';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private URL_COMPANY = "http://localhost:3000/companys";

  constructor(private http: HttpClient) { }

  getCompanies = (): Observable<Company[]> => {
    return this.http.get<Company[]>(this.URL_COMPANY);
  }

  addCompany = (company: Company): Observable<Company> => {
    return this.http.post<Company>(this.URL_COMPANY, company);
  }


}
