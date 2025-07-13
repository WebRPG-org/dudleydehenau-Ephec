import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {User} from "../models/User";
import {Commentaire} from "../models/Commentaire";
import  {Observable} from "rxjs";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private url = "http://localhost:3000/commentaire";

  httpOptions: {headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
   };

  constructor(private http:HttpClient, private errorHandlerService : ErrorHandlerService) {}
    fetchAll(): Observable<Commentaire[]>{
      return this.http
      .get<Commentaire[]>(this.url, {responseType : "json"})
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire[]>("fetchAll", []))
      );
  }
  createComment(formData:Partial<Commentaire>, userId: User["id"]):Observable<Commentaire>{
    return this.http
      .post<Commentaire>(this.url, {commentaire: formData.commentaire, userId: userId}, this.httpOptions)
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire>("createComment"))
      );
  }

  deleteCommentaire(commentaireId: Commentaire["id"]):Observable<{}>{
    const url = `${this.url}/${commentaireId}`;
    return this.http
      .delete<Commentaire>(url, this.httpOptions)
      .pipe(
        catchError(this.errorHandlerService.handleError<Commentaire>("deleteCommentaire"))
      );
  }

}
