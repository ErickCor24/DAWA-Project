import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { find, map, Observable } from 'rxjs';
import { Company } from '../../models/company';
import { UserCompany } from '../../models/UserCompany';
import { CompanyDTO } from '../../models/CompanyDTO';
import { AuthServiceService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private URL_AUTHCOMPANY = 'https://localhost:7214/api/AuthCompany';
  private URL_COMPANY = 'https://localhost:7214/api/Company';

  constructor(private http: HttpClient, private _service: AuthServiceService) {}

  getCompanies = (): Observable<CompanyDTO> => {
    return this.http.get<CompanyDTO>(this.URL_COMPANY);
  };

  addCompany = (company: Company, password: string): Observable<CompanyDTO> => {
    return this.http.post<CompanyDTO>(
      `${this.URL_AUTHCOMPANY}/register/${password}`,
      company
    );
  };

  getCompanyById = (id: number): Observable<CompanyDTO> => {
    return this.http.get<CompanyDTO>(`${this.URL_COMPANY}/${id}`);
  };

  updateCompany = (company: Company, id: number): Observable<CompanyDTO> => {
    const URL = `${this.URL_COMPANY}/${id}`;
    return this.http.put<CompanyDTO>(URL, company);
  };

  deleteCompany = (id: number): Observable<void> => {
    const URL = `${this.URL_COMPANY}/${id}`;
    return this.http.delete<void>(URL);
  };

  getCompaniesByName = (input: string): Observable<CompanyDTO> => {
    return this.http.get<CompanyDTO>(`${this.URL_COMPANY}/byname?name=${input}`);
  };

  isCompany = (obj: any): obj is Company => {
    return (
      obj &&
      typeof obj === 'object' &&
      'name' in obj &&
      'contactPerson' in obj &&
      'rucNumber' in obj
    );
  };
}
