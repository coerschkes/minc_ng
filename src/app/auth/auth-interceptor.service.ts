import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.principalSubject.pipe(
      take(1),
      exhaustMap((principal) => {
        if (!principal || !principal.token) {
          return next.handle(req);
        } else {
          const modifiedReq = req.clone({
            params: req.params.set('auth', principal.token),
          });
          return next.handle(modifiedReq);
        }
      })
    );
  }
}
