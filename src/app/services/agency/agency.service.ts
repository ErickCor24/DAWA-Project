import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agency } from '../../models/agency';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private dataUrl = '/assets/json/data.json';

  constructor(private http: HttpClient) { }

  getAgencies(): Observable<Agency[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.Agencys as Agency[])
    );
  }
}
