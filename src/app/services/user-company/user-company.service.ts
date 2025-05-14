import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCompany } from '../../models/UserCompany';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCompanyService {

  private URL_USER_COMPANY = "http://localhost:3000/userCompanys";

  constructor(private http: HttpClient) { }

  getUserCompanies = (): Observable<UserCompany[]> => {
    return this.http.get<UserCompany[]>(this.URL_USER_COMPANY);
  }


  addUserCompany = (user: UserCompany): Observable<UserCompany> => {
    return this.http.post<UserCompany>(this.URL_USER_COMPANY, user);
  }

  loginSystem = (username: string, password: string): Observable<UserCompany | number> => {
    return this.http.get<UserCompany[]>(this.URL_USER_COMPANY).pipe(
      map(users => {
        const match = users.find(x => x.userName === username && x.password === password);
        return match ? match : -1;
      })
    );
  }

  createSessionUser = (result: UserCompany | number): boolean => {
    if (typeof result !== 'number') {
      sessionStorage.setItem("idCompany", result.idCompany.toString());
      return true;
    } else return false;
  }

  deleteUserCompany = (id: string): Observable<void> => {
    const URL = `${this.URL_USER_COMPANY}/${id}`;
    return this.http.delete<void>(URL);
  }
}
