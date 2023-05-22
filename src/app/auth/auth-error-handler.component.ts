import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class AuthErrorHandler {
  static handleError(errorRes: HttpErrorResponse) {
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error('An unknown error occurred!'));
    } else {
      return throwError(
        () => new Error(AuthErrorHandler.mapFirebaseError(errorRes))
      );
    }
  }

  private static mapFirebaseError(
    firebaseErrorResponse: HttpErrorResponse
  ): string {
    switch (firebaseErrorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        return 'This email already exists!';
      case 'EMAIL_NOT_FOUND':
        return 'This email does not exist!';
      case 'INVALID_PASSWORD':
        return 'This password is not correct!';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return 'Too many attempts, try again later!';
      case 'USER_DISABLED':
        return 'This user is disabled!';
      case 'OPERATION_NOT_ALLOWED':
        return 'This operation is not allowed!';
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        return 'Password should be at least 6 characters!';
      case 'INVALID_EMAIL':
        return 'This email is not valid!';
      case 'MISSING_PASSWORD':
        return 'Password is required!';
      case 'MISSING_EMAIL':
        return 'Email is required!';
      case 'INVALID_ID_TOKEN':
        return 'This token is not valid!';
      case 'USER_NOT_FOUND':
        return 'This user was not found!';
      default:
        return 'An unknown error occurred!';
    }
  }
}
