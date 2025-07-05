import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCompany } from '../../models/UserCompany';
import { UserCredentials } from '../../models/UserCredentials';
import { Observable } from 'rxjs';
import { ReponseDTO } from '../../models/ResponseDTO';



@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private http: HttpClient) {}

  API_COMPANY_URL: string = 'https://localhost:7214/api/Authcompany/login';
  API_USER_URL: string = 'API0';

  loginUserCompany = (_email: string, _password: string): Observable<ReponseDTO> => {

    const user: UserCredentials  = {
      email: _email,
      password: _password
    }
    return this.http.post<ReponseDTO>(this.API_COMPANY_URL, user);
  };

/*   loginUserClient = (user: UserCompany): Observable<ReponseDTO> => {
    return null;
  }; */

  isAuthenticated = (): boolean => {
    return this.getAuthToken() != '';
  }

  setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  getAuthToken = (): string => {
    return localStorage.getItem('token') || '';
  };

  removeAuthToken = () => {
    localStorage.removeItem('token');
  };

  //JWT
  getIdToken = () => {
    const token:string = this.getAuthToken();
    if(!token) return null;
    const decode = this.decodeToken(token);
    return decode?.id || null;
  }

  getRole(): string | null {
    const token:string = this.getAuthToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  private decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };
}
