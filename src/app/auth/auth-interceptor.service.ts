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
import { Principal } from './model/principal.model';

@Injectable()
export class AuthParamInterceptorService implements HttpInterceptor {
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
          const modifiedReq = this.updateRequestWithToken(req, principal);
          return next.handle(modifiedReq);
        }
      })
    );
  }

  private updateRequestWithToken(
    req: HttpRequest<any>,
    principal: Principal
  ): HttpRequest<any> {
    return req.clone({
      params: req.params.set('auth', principal.token),
    });
  }
}
