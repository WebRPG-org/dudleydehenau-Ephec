import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private baseUrl = 'http://localhost:3000/score';

  constructor(private http: HttpClient) { }

  
  addScore(levelId: number, userId: number, scoreBTime: number): Observable<any> {
    const body = { levelId, userId, scoreBTime };
    return this.http.post<any>(`${this.baseUrl}/scores`, body);
  }
}
