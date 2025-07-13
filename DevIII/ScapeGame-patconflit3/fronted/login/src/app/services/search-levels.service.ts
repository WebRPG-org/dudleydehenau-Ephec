import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private baseUrl = 'http://localhost:3000/level';

  constructor(private http: HttpClient) { }

  searchLevels(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search?term=${term}`);
  }
}