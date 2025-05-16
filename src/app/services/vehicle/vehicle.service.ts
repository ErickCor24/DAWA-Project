import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../../models/vehicle';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private url = 'http://localhost:3000/vehicles';

  constructor(private http: HttpClient) {}

  // Obtener un vehículo por id
  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.url}/${id}`);
  }

  // Actualizar un vehículo (p. ej. disponibilidad)
  updateVehicle(id: string, patch: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.url}/${id}`, patch);
  }
}