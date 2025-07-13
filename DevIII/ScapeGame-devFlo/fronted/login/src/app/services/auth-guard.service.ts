import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService : AuthService, private routeur : Router ) { }

  canActivate(): Observable<boolean>{
      if(!this.authService.isUserLoggedIn$.value){
        this.routeur.navigate(["/login"]);
      }
      return this.authService.isUserLoggedIn$;
    }
}
