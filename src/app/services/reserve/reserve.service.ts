import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Reserve } from '../../models/reserve';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
private jsonUrl:string = "http://localhost:3000/reserves";
  constructor(private http: HttpClient) { }
  
  getReserves():Observable<Reserve[]>{
    return this.http.get<Reserve[]>(this.jsonUrl);
  }
  getReserve(id: string): Observable<Reserve> {
    return this.http.get<Reserve>(`${this.jsonUrl}/${id}`);
  }
  addReserve(reserve: Reserve): Observable<Reserve> {
      const reserveCleaned = { ...reserve };
  delete (reserveCleaned as any).id;
    return this.http.post<Reserve>(this.jsonUrl, reserve);
  }
    deleteReserve(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }
    updateReserve(r: Reserve): Observable<Reserve> {
    return this.http.put<Reserve>(`${this.jsonUrl}/${r.id}`, r);
  }
}
