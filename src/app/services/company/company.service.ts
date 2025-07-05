import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { find, map, Observable } from 'rxjs';
import { Company } from '../../models/company';
import { UserCompany } from '../../models/UserCompany';
import { CompanyDTO } from '../../models/CompanyDTO';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private URL_AUTHCOMPANY = "https://localhost:7214/api/AuthCompany";
  private URL_COMPANY = "https://localhost:7214/api/Company";

  constructor(private http: HttpClient) { }

  getCompanies = (): Observable<CompanyDTO> => {
    return this.http.get<CompanyDTO>(this.URL_COMPANY);
  }

  addCompany = (company: Company, password: string): Observable<CompanyDTO> => {
    return this.http.post<CompanyDTO>(`${this.URL_AUTHCOMPANY}/register/${password}`, company);
  }

  getCompanyById = (id: string): Observable<Company | number> => {
    return this.http.get<Company[]>(this.URL_COMPANY).pipe(
      map((companies: Company[]) => {
        const match = companies.find(x => x.id?.toString() === id) //FIX THAT
        return match ? match : -1;
      })
    )
  }

  updateCompany = (company: Company, id: string): Observable<Company> => {
    const URL = `${this.URL_COMPANY}/${id}`;
    return this.http.put<Company>(URL, company);
  }

  deleteCompany = (id: string): Observable<void> => {
    const URL = `${this.URL_COMPANY}/${id}`;
    return this.http.delete<void>(URL);
  }

  getCompaniesByName = (input: string): Observable<Company[]> => {
    return this.http.get<Company[]>(this.URL_COMPANY).pipe(
      map(companies =>
        companies.filter(company => input ? company.name.toLowerCase().includes(input.toLowerCase()) : true)
      )
    )
  }

}
