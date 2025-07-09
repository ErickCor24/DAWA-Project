import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Reserve } from '../../models/reserve';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {
  private apiUrl: string = 'https://localhost:7214/api/Reserve';

  constructor(private http: HttpClient) {}

  getReserves(): Observable<Reserve[]> {
    return this.http.get<Reserve[]>(this.apiUrl);
  }

  getReserve(id: number): Observable<Reserve> {
    return this.http.get<Reserve>(`${this.apiUrl}/${id}`);
  }

  addReserve(reserve: Reserve): Observable<Reserve> {
    const reserveCleaned = { ...reserve };
    delete (reserveCleaned as any).id; // prevenir conflicto si tiene un id
    return this.http.post<Reserve>(this.apiUrl, reserveCleaned);
  }

  deleteReserve(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateReserve(r: Reserve): Observable<Reserve> {
    return this.http.put<Reserve>(`${this.apiUrl}/${r.id}`, r);
  }
}
