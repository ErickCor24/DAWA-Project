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

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.dataUrl);
  }

  getVehiclesByCompany(idCompany: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.dataUrl).pipe(
      map((vehicles) =>
        vehicles.filter((vehicle) =>
          (vehicle.idCompany === idCompany)
        )
      )
    );
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle>{
    return this.http.post<Vehicle>(this.dataUrl, vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle>{
    return this.http.put<Vehicle>(`${this.dataUrl}/${vehicle.idVehicle}}`, vehicle)
  }

  deleteVehicle(vehicle: Vehicle): Observable<void>{
    return this.http.delete<void>(`${this.dataUrl}/${vehicle.idVehicle}}`)
  }

}
