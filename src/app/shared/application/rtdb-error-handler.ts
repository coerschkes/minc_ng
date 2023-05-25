import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class RtdbErrorHandler {
  static handleError(errorRes: HttpErrorResponse) {
    switch (errorRes.status) {
      case 401:
        return throwError(() => 'Permission denied!');
      default:
        return throwError(() => 'An unknown error occurred!');
    }
  }
}
