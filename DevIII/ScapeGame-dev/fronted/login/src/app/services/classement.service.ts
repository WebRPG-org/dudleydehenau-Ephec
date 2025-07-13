import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassementService {


  private apiUrl = 'http://localhost:3000/classement';

  constructor(private http: HttpClient) { }

  // Récupère le classement de tous les scores pour un niveau spécifique
  getClassement(levelId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${levelId}`).pipe(
      map(response => response)
    );
  }
}