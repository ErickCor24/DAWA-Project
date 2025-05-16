import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Client } from '../../models/clients/client.model';
import { UserClient } from '../../models/clients/user-client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private clientUrl = 'http://localhost:3000/clients';
  private userClientUrl = 'http://localhost:3000/userClients';

  constructor(private http: HttpClient) {}

  /** Obtener todos los clientes (para verificar existencia, duplicados, etc.) */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.clientUrl);
  }

  /** Crear un nuevo cliente */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientUrl, client);
  }

  /** Crear un nuevo usuario asociado al cliente */
  createUserClient(user: UserClient): Observable<UserClient> {
    return this.http.post<UserClient>(this.userClientUrl, user);
  }

  /** Obtener cliente por ID – versión segura usando toda la coleccion */
  getClientById(id: number): Observable<Client> {
    return this.getAllClients().pipe(
      map(clients => {
        const found = clients.find(c => c.id === id);
        if (!found) throw new Error(`Cliente con ID ${id} no encontrado`);
        return found;
      })
    );
  }

  /** actualizar datos del cliente - en arreglo (debo reiniciar jsonserc para que permita eliminar) */
  updateClient(id: number, updatedData: Client): Observable<Client> {
    return this.http.put(`${this.clientUrl}/${id}`, updatedData).pipe(
      switchMap(() => this.getAllClients()),
      map(clients => {
        const found = clients.find(c => c.id === id);
        if (!found) throw new Error(`Cliente con ID ${id} no encontrado después de editar`);
        return found;
      })
    );
  }

  /** eliminar cliente - en arreglo (debo reiniciar jsonserv para que permita eliminar) */
  deleteClientLogically(id: number): Observable<Client> {
    return this.http.patch(`${this.clientUrl}/${id}`, { status: false }).pipe(
      switchMap(() => this.getAllClients()),
      map(clients => {
        const found = clients.find(c => c.id === id);
        if (!found) throw new Error(`Cliente con ID ${id} no encontrado después de eliminar`);
        return found;
      })
    );
  }
}
