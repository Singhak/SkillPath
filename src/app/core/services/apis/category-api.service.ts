import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CatrgoryApiService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly http = inject(HttpClient);

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
}
