import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { find, map, Observable } from 'rxjs';
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

  getCompanyById = (id: string): Observable<Company | number> => {
    return this.http.get<Company[]>(this.URL_COMPANY).pipe(
      map((companies: Company[]) => {
        const match = companies.find(x => x.id === id)
        return match ? match : -1;
      })
    )
  }

  updateCompany = (company: Company, id: string): Observable<Company> => {
    const URL = `${this.URL_COMPANY}/${id}`;
    return this.http.put<Company>(URL, company);
  }


}
