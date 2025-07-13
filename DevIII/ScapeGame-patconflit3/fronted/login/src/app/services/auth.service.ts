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
  userId!: User["userId"];

   httpOptions: {headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
   };
  constructor(private http: HttpClient, private errorHandlerService:ErrorHandlerService, private router: Router ) {};

  signup(user: Omit<User, "userId">): Observable<User>{
    return this.http.post<User>(`${this.url}/signup`, user,this.httpOptions).pipe(first(), catchError(this.errorHandlerService.handleError<User>("signup")));
  }

  login(email: Pick<User, "email">, userPassword: Pick<User,"userPassword">): Observable<{token: string; userId: Pick<User, "userId">}>{
    return this.http.post(`${this.url}/login`, {email, userPassword},this.httpOptions)
      .pipe(
        first(),
        tap((tokenOject: any) => {
          this.userId = tokenOject.userId;
          this.isUserLoggedIn$.next(true);
          localStorage.setItem("token", tokenOject.token);
          this.router.navigate([".."]);
        }),
        catchError(this.errorHandlerService.handleError<{
          token :string; userId: Pick<User, "userId">
        }>("login")));
  }
}
