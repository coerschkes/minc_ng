import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class ApiErrorHandler {
  static handleError(errorRes: HttpErrorResponse) {
    switch (errorRes.status) {
      case 401:
        return throwError(() => 'API-Key is invalid!');
      case 403:
        return throwError(
          () => 'API-Key does not have the necessary permissions!'
        );
      case 404:
        return throwError(() => 'Endpoint does not exist!');
      case 503:
        return throwError(() => 'Endpoint is disabled!');
      default:
        return throwError(() => 'An unknown error occurred!');
    }
  }
}
