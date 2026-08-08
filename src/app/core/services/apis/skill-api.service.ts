import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SkillApiSevice {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/skills`;

  // Example method to get skills
  getSkills(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
