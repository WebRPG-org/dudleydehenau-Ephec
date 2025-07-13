import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassementService {

  private apiUrl = 'http://localhost:3000/classement';

  constructor(private http: HttpClient) { }

  getClassment(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scoreboard`);
  }
}