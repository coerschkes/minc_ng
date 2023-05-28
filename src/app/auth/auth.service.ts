import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { Principal } from './principal.model';

const firebaseSignupUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  environment.firebaseApiKey;
const firebaseLoginUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  environment.firebaseApiKey;

const firebaseRefreshUrl =
  'https://securetoken.googleapis.com/v1/token?key=' +
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

export interface RefreshResponseData {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

//todo: Test! Does refresh token work?

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit, OnDestroy {
  principalSubject = new BehaviorSubject<Principal>(Principal.invalid);
  principalSubjectSub = new Subscription();
  tokenExpirationTimer: any;
  tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('auth service init');
  }

  ngOnDestroy(): void {
    this.principalSubjectSub.unsubscribe();
  }

  registerPrincipalChange() {
    this.principalSubjectSub.unsubscribe();
    this.principalSubjectSub = this.principalSubject.subscribe((principal) => {
      if (principal.isValid) {
        this.localStorage.storePrincipal(principal);
        this.autoLogout(principal.tokenExpirationDate);
        this.autoRefresh(principal);
      } else {
        this.router.navigate(['/auth']);
        this.localStorage.removeStoredPrincipal();
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        if (this.tokenRefreshTimer) {
          clearTimeout(this.tokenRefreshTimer);
        }
        this.tokenExpirationTimer = null;
      }
    });
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(firebaseSignupUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(tap(this.handleAuthentication.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(firebaseLoginUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(tap(this.handleAuthentication.bind(this)));
  }

  logout() {
    this.principalSubject.next(Principal.invalid);
    this.principalSubjectSub.unsubscribe();
  }

  refresh(principal: Principal) {
    this.http
      .post<RefreshResponseData>(firebaseRefreshUrl, {
        grant_type: 'refresh_token',
        refresh_token: principal.refreshToken,
      })
      .pipe(
        map((resData) => {
          const updatedPrincipal = new Principal(
            principal.email,
            principal.id,
            resData.refresh_token,
            resData.id_token,
            this.getExpirationDate(resData.expires_in)
          );
          this.principalSubject.next(updatedPrincipal);
        })
      )
      .subscribe();
  }

  autoRefresh(principal: Principal) {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    const refreshDuration =
      new Date(principal.tokenExpirationDate).getTime() -
      60 -
      new Date().getTime();
    this.tokenRefreshTimer = setTimeout(() => {
      this.refresh(principal);
    }, refreshDuration);
  }

  autoLogin() {
    const loadedUser = this.localStorage.getStoredPrincipal();
    if (!loadedUser) {
      return;
    }
    if (loadedUser.token && loadedUser.tokenExpirationDate > new Date()) {
      this.principalSubject.next(loadedUser);
      this.registerPrincipalChange();
    } else {
      this.localStorage.removeStoredPrincipal();
    }
  }

  autoLogout(tokenExpirationDate: Date) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    const expirationDuration =
      new Date(tokenExpirationDate).getTime() - new Date().getTime();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isLoggedIn() {
    return this.principalSubject.pipe(
      take(1),
      map((user) => {
        return user.isValid;
      })
    );
  }

  private handleAuthentication(authResponseData: AuthResponseData) {
    const user = new Principal(
      authResponseData.email,
      authResponseData.localId,
      authResponseData.refreshToken,
      authResponseData.idToken,
      this.getExpirationDate(authResponseData.expiresIn)
    );
    this.registerPrincipalChange();
    this.principalSubject.next(user);
  }

  private getExpirationDate(expiresIn: string) {
    return new Date(new Date().getTime() + +expiresIn * 1000);
  }
}
