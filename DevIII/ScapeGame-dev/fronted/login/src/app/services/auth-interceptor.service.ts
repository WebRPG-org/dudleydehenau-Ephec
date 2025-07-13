import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpInterceptorFn,
    HttpHandlerFn
} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService {

}

export const authInterceptorService : HttpInterceptorFn =(req: HttpRequest<any>, next:HttpHandlerFn): Observable<HttpEvent<any>> => {

    const token = localStorage.getItem("token");
    if(token){
      const cloneRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      });
      return next(cloneRequest);
    }else{
      return next(req);
    }
  };
