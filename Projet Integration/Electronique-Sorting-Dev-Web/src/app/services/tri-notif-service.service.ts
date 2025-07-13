import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriNotifServiceService {

  private cheminFichier = 'assets/data/notif.json';

  constructor(private http: HttpClient) {}

  getEtatTri(): Observable<{ triEnCours: boolean }> {
    return this.http.get<{ triEnCours: boolean }>(this.cheminFichier);
  }

  getErreurTri(): Observable<{ triErreur: boolean }> {
    return this.http.get<{ triErreur: boolean }>(this.cheminFichier);
  }
}
