import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { ClientService } from './client.service';
import { UserClient } from '../../models/clients/user-client.model';
import { Client } from '../../models/clients/client.model';

@Injectable({ providedIn: 'root' })
export class AuthClientService {
  private userClientUrl = 'http://localhost:3000/userClients';

  constructor(
    private http: HttpClient,
    private clientService: ClientService
  ) {}

  loginAndFetchClient(userName: string, password: string): Observable<Client> {
    const params = `?userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`;
    return this.http.get<UserClient[]>(`${this.userClientUrl}${params}`).pipe(
      switchMap(users => {
        if (!users.length) {
          return throwError(() => new Error('Credenciales inválidas'));
        }
        const user = users[0];
        return this.clientService.getClientById(user.id).pipe(
          map(client => {
            if (!client.status) {
              throw new Error('Este usuario está inactivo o dado de baja.');
            }
            return client;
          })
        );
      })
    );
  }
}
