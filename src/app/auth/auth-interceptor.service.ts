import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthStateService } from './auth-state.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authState: AuthStateService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authState.principalSubject.pipe(
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
