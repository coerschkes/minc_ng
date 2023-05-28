import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { Principal } from './principal.model';
import { NotificationService } from '../shared/application/notification.service';

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

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  principalSubject = new BehaviorSubject<Principal>(Principal.invalid);
  principalSubjectSub = new Subscription();
  tokenExpirationTimer: any;
  tokenRefreshTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
    private notificationService: NotificationService
  ) {
    this.principalSubjectSub = this.principalSubject.subscribe((principal) => {
      if (Principal.isValid(principal)) {
        this.localStorage.storePrincipal(principal);
        this.autoLogout(principal.tokenExpirationDate);
        this.autoRefresh(principal);
      }
    });
  }

  ngOnDestroy(): void {
    this.principalSubjectSub.unsubscribe();
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
    this.localStorage.removeStoredPrincipal();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    this.tokenExpirationTimer = null;
    this.tokenRefreshTimer = null;
    this.router.navigate(['/auth']);
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
      .subscribe({
        error: () => {
          this.logout();
          this.notificationService.showError(
            'Session expired. Please login again.'
          );
        },
      });
  }

  autoRefresh(principal: Principal) {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    const refreshDuration = 600000; //refresh every 10 min
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
      this.refresh(loadedUser);
      this.principalSubject.next(loadedUser);
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
      map((principal) => {
        return Principal.isValid(principal);
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
    this.principalSubject.next(user);
  }

  private getExpirationDate(expiresIn: string) {
    return new Date(new Date().getTime() + +expiresIn * 1000);
  }
}
