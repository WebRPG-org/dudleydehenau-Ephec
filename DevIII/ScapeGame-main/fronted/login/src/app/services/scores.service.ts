import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {
  private apiUrl = 'http://localhost:3000/scores'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  // Récupère le meilleur score pour un utilisateur et un niveau spécifiques
  getBestScore(levelId: number, userId: string): Observable<number> {
    return this.http.get<{ bestScore: number }>(`${this.apiUrl}/best/${userId}/${levelId}`).pipe(
      map(response => response.bestScore)
    );
  }

  // Met à jour le meilleur score pour un utilisateur et un niveau spécifiques
  updateBestScore(levelId: number, userId: string, score: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { levelId, userId, score });
  }

  // Soumet le score et met à jour s'il est plus petit que le précédent meilleur score
  submitScore(levelId: number, userId: string, score: number): Observable<any> {
    return this.getBestScore(levelId, userId).pipe(
      switchMap(bestScore => {
        if (score < bestScore || bestScore === 0) {
          return this.updateBestScore(levelId, userId, score);
        } else {
          return new Observable(observer => {
            observer.next({ message: 'Score not updated, it is not the best score.' });
            observer.complete();
          });
        }
      })
    );
  }
}
