import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { Reserve } from '../../models/reserve';
@Injectable({
  providedIn: 'root'
})
export class ReserveService {
private jsonUrl:string = "http://localhost:3000/reserves";
  constructor(private http: HttpClient) { }
  
  getReserve():Observable<Reserve[]>{
    return this.http.get<Reserve[]>(this.jsonUrl);
  }
  addReserve(reserve: Reserve): Observable<Reserve> {
      const reserveCleaned = { ...reserve };
  delete (reserveCleaned as any).id;
    return this.http.post<Reserve>(this.jsonUrl, reserve);
  }
}
