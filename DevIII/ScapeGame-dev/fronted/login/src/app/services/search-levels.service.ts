import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private baseUrl = 'http://localhost:3000/level';
  private niveauxSubject = new BehaviorSubject<any[]>([]);
  filteredGames: any[] = [];

  constructor(private http: HttpClient) { }

  searchLevels(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search?term=${term}`);
  }

  getLevelData(): Observable<any[]> {
   return this.niveauxSubject.asObservable();
  }

  updateLevelData(niveaux: any[]): void {
    this.niveauxSubject.next(niveaux);
  }

  updateFilteredGames(games: any[]): void {
    this.filteredGames = games;
  }

}