import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vehicle } from '../../models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private URL_VEHICLE: string = 'https://localhost:7214/api/Vehicle';

  constructor(private http: HttpClient) { }

  getVehicles(idCompany?: number): Observable<Vehicle[]> {
    if (idCompany !== undefined && idCompany !== null) {
      return this.http.get<Vehicle[]>(`${this.URL_VEHICLE}/by-company/${idCompany}`).pipe(
        map((vehicles) => vehicles.filter(vehicle => vehicle.status === true))
      );
    } else {
      return this.http.get<Vehicle[]>(this.URL_VEHICLE).pipe(
        map((vehicles) => vehicles.filter(vehicle => vehicle.isAvailable === true))
      );
    }
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.URL_VEHICLE}/by-id/${id}`);
  }

  getVehicleByField(field: string, dataInput: string) {
  console.log("getserivce");
  console.log(field, dataInput);
  return this.http.get<Vehicle[]>(`${this.URL_VEHICLE}/by-field/${field}/${dataInput}`).pipe(
    map((vehicles) => {
      console.log('Vehículos recibidos:', vehicles);
      return vehicles.filter((vehicle) => {
        const value = (vehicle as any)[field];
        return dataInput
          ? value && String(value).toLowerCase().includes(dataInput.toLowerCase()) && vehicle.status
          : vehicle.isAvailable;
      });
    })
  );
}

  createVehicle(vehicle: Vehicle, idCompany: number): Observable<Vehicle> {
    vehicle.isAvailable = true;
    vehicle.status = true;
    vehicle.companyId = idCompany;
    return this.http.post<Vehicle>(this.URL_VEHICLE, vehicle);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.URL_VEHICLE}/${vehicle.id}`, vehicle);
  }

  deleteVehicle(vehicle: Vehicle): Observable<void> {
    return this.http.put<void>(`${this.URL_VEHICLE}/delete/${vehicle.id}`, vehicle);
  }

}
