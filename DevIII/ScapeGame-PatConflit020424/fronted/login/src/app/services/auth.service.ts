import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {first,catchError} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: Pick<User, "id">

   httpOptions: {headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
   };
  constructor(private http: HttpClient, private errorHandlerService:ErrorHandlerService, private router: Router ) {};

  signup(user: Omit<User, "id">): Observable<User>{
    return this.http.post<User>(`${this.url}/signup`, user,this.httpOptions).pipe(first(), catchError(this.errorHandlerService.handleError<User>("signup")));
  }

  login(email: Pick<User, "email">, secret: Pick<User,"secret">): Observable<{token: string; userId: Pick<User, "id">}>{
    return this.http.post(`${this.url}/login`, {email, secret},this.httpOptions)
      .pipe(
        first(),
        tap((tokenOject: any) => {
          this.userId = tokenOject.userId;
          this.isUserLoggedIn$.next(true);
          
          this.router.navigate([".."]);
        }),
        catchError(this.errorHandlerService.handleError<{
          token :string; userId: Pick<User, "id">
        }>("login")));
  }
}
