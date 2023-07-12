import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, exhaustMap, take } from 'rxjs';
import { principalSelector } from '../store/auth/auth.selector';
import { Principal } from './principal.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<{ principal: Principal }>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(principalSelector).pipe(
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
