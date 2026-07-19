import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../core/models/category.model';

@Service()
export class CatrgoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private http = inject(HttpClient);

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
}
