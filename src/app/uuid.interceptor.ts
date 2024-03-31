import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getToken, getUUID } from "./utils";

@Injectable()
export class UuidInterceptor implements HttpInterceptor {


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let req = request.clone({
      setHeaders: { 'uuid': getUUID(), 'token': getToken() }
    })

    return next.handle(req);
  }

}
