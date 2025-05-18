import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agency } from '../../models/agency';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private dataUrl = '/assets/json/data.json';
  private agencies: Agency[] = [];

  constructor(private http: HttpClient) {}

  getAgencies(): Observable<Agency[]> {
    if (this.agencies.length > 0) {
      return of(this.agencies);
    } else {
      return this.http.get<any>(this.dataUrl).pipe(
        map(data => data.agencys as Agency[]),
        tap(agencies => this.agencies = agencies)
      );
    }
  }

  createAgency(agency: Agency): Observable<Agency> {
    // Simular ID autogenerado
    const newId = this.agencies.length > 0
      ? Math.max(...this.agencies.map(a => a.id)) + 1
      : 1;

    const newAgency = { ...agency, id: newId };
    this.agencies.push(newAgency);
    return of(newAgency);
  }

  updateAgency(id: number, updatedAgency: Agency): Observable<Agency> {
    const index = this.agencies.findIndex(a => a.id === id);
    if (index > -1) {
      this.agencies[index] = { ...updatedAgency, id };
      return of(this.agencies[index]);
    } else {
      return of(null as any); 
    }
  }
}

