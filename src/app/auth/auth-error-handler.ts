import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class AuthErrorHandler {
  static handleError(errorRes: HttpErrorResponse) {
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => 'An unknown error occurred!');
    } else {
      return throwError(() => AuthErrorHandler.mapFirebaseError(errorRes));
    }
  }

  private static mapFirebaseError(
    firebaseErrorResponse: HttpErrorResponse
  ): string {
    switch (firebaseErrorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        return 'Email already exists!';
      case 'EMAIL_NOT_FOUND':
        return 'Email does not exist!';
      case 'INVALID_PASSWORD':
        return 'Password is not correct!';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return 'Too many attempts, try again later!';
      case 'USER_DISABLED':
        return 'User is disabled!';
      case 'OPERATION_NOT_ALLOWED':
        return 'Operation not allowed!';
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        return 'Password should be at least 6 characters!';
      case 'INVALID_EMAIL':
        return 'Email is not valid!';
      case 'MISSING_PASSWORD':
        return 'Password is required!';
      case 'MISSING_EMAIL':
        return 'Email is required!';
      case 'INVALID_ID_TOKEN':
        return 'ID-Token is invalid!';
      case 'USER_NOT_FOUND':
        return 'User not found!';
      case 'INVALID_REFRESH_TOKEN':
        return 'Refresh-Token is invalid!';
      case 'TOKEN_EXPIRED':
        return 'Token is expired!';
      case 'USER_DISABLED':
        return 'User is disabled!';
      case 'USER_NOT_FOUND':
        return 'User not found!';
      case 'INVALID_GRANT_TYPE':
        return 'Grant type is invalid!';
      case 'MISSING_REFRESH_TOKEN':
        return 'Refresh token is missing!';
      default:
        return 'An unknown error occurred!';
    }
  }
}
