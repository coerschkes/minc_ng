import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthErrorHandler } from './auth-error-handler.component';
import { LocalStorageService } from './local-storage.service';
import { User } from './user.model';

const firebaseSignupUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  environment.firebaseApiKey;
const firebaseLoginUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  environment.firebaseApiKey;

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

//todo: refresh token and change token expiration timer
@Injectable({ providedIn: 'root' })
export class AuthService {
  userSubject = new BehaviorSubject<User>(User.invalid);
  tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(firebaseSignupUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError(AuthErrorHandler.handleError))
      .pipe(tap(this.handleAuthentication.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(firebaseLoginUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(catchError(AuthErrorHandler.handleError))
      .pipe(tap(this.handleAuthentication.bind(this)));
  }

  logout() {
    this.userSubject.next(User.invalid);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const loadedUser = this.localStorage.getStoredUser();
    console.log(loadedUser);
    if (!loadedUser) {
      return;
    }
    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const expirationDuration =
        new Date(loadedUser.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isLoggedIn() {
    return this.userSubject.pipe(
      take(1),
      map((user) => {
        console.log(user);
        return user.isValid;
      })
    );
  }

  private handleAuthentication(authResponseData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +authResponseData.expiresIn * 1000
    );
    const user = new User(
      authResponseData.email,
      authResponseData.localId,
      authResponseData.idToken,
      expirationDate
    );
    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}