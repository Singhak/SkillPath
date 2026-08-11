import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Country {
  name: string;
  iso2: string;
  id?: number;
  [key: string]: any;
}

export interface State {
  name: string;
  iso2: string;
  id?: number;
  [key: string]: any;
}

export interface City {
  name: string;
  id?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class LocationApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/location`;

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries?fields=name,iso2`);
  }

  getStatesByCountry(countryCode: string): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/countries/${countryCode}/states?fields=name,iso2`);
  }

  getCitiesByState(countryCode: string, stateCode: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/countries/${countryCode}/states/${stateCode}/cities?fields=name`);
  }

  getCitiesByCountry(countryCode: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/countries/${countryCode}/cities?fields=name`);
  }
}
