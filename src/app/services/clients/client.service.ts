import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../models/clients/client.model';
import { AuthServiceService } from '../../services/auth/auth-service.service';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = 'https://localhost:7214/api/Client';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  /* btener todos los clientes (público o admin) */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  /** Crear un nuevo cliente */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  /** Obtener cliente por ID */
  getClientById(id: string | number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  /** Actualizar datos del cliente */
  updateClient(id: string | number, updatedData: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, updatedData);
  }

  /** Eliminar cliente lógicamente */
  deleteClientLogically(id: string | number): Observable<Client> {
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, {});
  }

  /** Buscar clientes por filtros */
  searchClients(filters: {
    name?: string;
    email?: string;
    ci?: string;
    phone?: string;
    status?: boolean;
  }): Observable<Client[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Client[]>(`${this.baseUrl}/search`, { params });
  }

  /** Obtener cliente por CI */
  getClientByCi(ci: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/ci/${ci}`);
  }
  
  /** Validar si existe email */
  checkEmailExists(email: string): Observable<Client[]> {
    return this.searchClients({ email });
  }
}
