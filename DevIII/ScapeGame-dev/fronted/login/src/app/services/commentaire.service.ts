import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {User} from "../models/User";
import {Commentaire} from "../models/Commentaire";
import  {Observable} from "rxjs";
import {catchError} from "rxjs/operators";



@Injectable({
  providedIn: 'root',
})
export class CommentaireService {
  private url = "http://localhost:3000/commentaire";
  levelId! : number;

  httpOptions: {headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
   };

  constructor(private http:HttpClient, private errorHandlerService : ErrorHandlerService) {}

    fetchAll(levelId : number): Observable<Commentaire[]>{
      const url = `${this.url}/${levelId}`;
      return this.http
      .get<Commentaire[]>(url, {responseType : "json"})
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire[]>("fetchAll", []))
      );
  }
  createComment(formData:Partial<Commentaire>, userId: User["userId"],levelId : number):Observable<Commentaire>{
    return this.http
      .post<Commentaire>(this.url, {commentaryText: formData.commentaryText, userId: userId,levelId:levelId}, this.httpOptions)
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire>("createComment"))
      );
  }

  deleteCommentaire(commentaireId: Commentaire["userId"]):Observable<{}>{
    const url = `${this.url}/${commentaireId}`;
    return this.http
      .delete<Commentaire>(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire>("deleteCommentaire"))
      );
  }

}
