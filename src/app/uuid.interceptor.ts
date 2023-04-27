import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class UuidInterceptor implements HttpInterceptor {

  constructor() {
  }

  getUUID() {
    let uuid: any;
    // 在一些浏览器中，localStorage是不可用的，比如隐身模式，因此需要try catch
    try {
      uuid = localStorage.getItem('uuid');
      if (uuid == null) {
        uuid = this.generateUUID();
        // @ts-ignore
        localStorage.setItem('uuid', uuid);
      }
    } catch (e) {
      uuid = this.generateUUID();
    }
    return uuid;
  }

  getToken(): string {
    try {
      let token = localStorage.getItem('token');
      if (token == null) {
        return '';
      }
      return token;
    } catch (e) {
      return '';
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let req = request.clone({
      setHeaders: {
        'uuid': this.getUUID(),
        'token': this.getToken()
      }
    })

    return next.handle(req);
  }

  private generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}
