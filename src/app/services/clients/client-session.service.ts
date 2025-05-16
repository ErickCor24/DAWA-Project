import { Injectable } from '@angular/core';
import { Client } from '../../models/clients/client.model';

@Injectable({ providedIn: 'root' })
export class ClientSessionService {
  private readonly key = 'clientSession';

  /** Guarda el cliente actual en sessionStorage */
  setClient(client: Client): void {
    sessionStorage.setItem(this.key, JSON.stringify(client));
  }

  /** devuelve el cliente desde sessionStorage*/
  getClient(): Client | null {
    const data = sessionStorage.getItem(this.key);
    try {
      return data ? JSON.parse(data) as Client : null;
    } catch (e) {
      this.clear();
      return null;
    }
  }

  /** Elimina al cliente de sessionStorage */
  clear(): void {
    sessionStorage.removeItem(this.key);
  }

  /** Verifica si hay sesión iniciada con cliente activo */
  isLoggedIn(): boolean {
    const client = this.getClient();
    return !!client && client.status === true;
  }

  /** cliente esta inactivo (status = false) */
  isClientInactive(): boolean {
    const client = this.getClient();
    return !!client && client.status === false;
  }

  /** Verifica si hay cualquier sesion guardada, activa o no */
  hasAnyClient(): boolean {
    return this.getClient() !== null;
  }
}
