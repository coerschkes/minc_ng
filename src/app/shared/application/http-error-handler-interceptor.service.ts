import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthErrorHandler } from 'src/app/auth/auth-error-handler';
import { ApiErrorHandler } from './api/api-error-handler';

@Injectable()
export class HttpErrorHandlerInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://api.guildwars2.com/v2/')) {
      return next.handle(req).pipe(catchError(ApiErrorHandler.handleError));
    } else if (
      req.url.startsWith('https://identitytoolkit.googleapis.com/v1/')
    ) {
      return next.handle(req).pipe(catchError(AuthErrorHandler.handleError));
    } else {
      return next.handle(req);
    }
  }
}
