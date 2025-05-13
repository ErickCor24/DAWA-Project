import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vehicle } from '../../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private dataUrl: string = 'http://localhost:3000/vehicle';

  constructor(private http: HttpClient) { }

  getVehicles(idCompany?: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.dataUrl).pipe(
      map((vehicles) =>
        (idCompany ? vehicles.filter(vehicle => vehicle.idCompany === idCompany) : 
                  vehicles.filter(vehicle => vehicle.isAvailable === true))
      )
    );
  }

  getVehicle(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.dataUrl}/${id}`);
  }
  
  createVehicle(vehicle: Vehicle, idCompany: number): Observable<Vehicle> {
    vehicle.isAvailable = true;
    vehicle.status = 1;
    vehicle.idCompany = idCompany;
    return this.http.post<Vehicle>(this.dataUrl, vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.dataUrl}/${vehicle.id}`, vehicle);
  }

  deleteVehicle(vehicle: Vehicle): Observable<void> {
    return this.http.delete<void>(`${this.dataUrl}/${vehicle.id}`);
  }

}
