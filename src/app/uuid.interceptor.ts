import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {getToken, getUUID} from './utils'; // Assuming getToken() and getUUID() are defined in utils

@Injectable()
export class UUIDInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable((observer: Observer<HttpEvent<any>>) => {
      const clonedRequest = request.clone({
        setHeaders: {'uuid': getUUID(), 'token': getToken()}
      });
      next.handle(clonedRequest).subscribe(
        {
          next: (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              const resp: any = event.body;
              if (!event.ok || resp.status !== 200) {
                alert(resp.message); // Handle error message display (consider a more appropriate UI mechanism)
              }
            }
            observer.next(event);
          },
          error: (error: HttpErrorResponse) => {
            if (error.error.message) {
              alert(error.error.message);
            } else {
              alert(error.message)
            }
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          }
        });
    })
  }
}
