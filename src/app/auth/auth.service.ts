import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from '../shared/application/notification.service';
import {
  clearExpirationTimer,
  clearRefreshTimer,
  updateExpirationTimer,
  updatePrincipal,
  updateRefreshTimer,
} from '../store/auth/auth.actions';
import { principalSelector } from '../store/auth/auth.selector';
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

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  principalSubjectSub = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
    private notificationService: NotificationService,
    private anyStore: Store<any>,
    private principalStore: Store<{ principal: Principal }>
  ) {
    this.principalStore.select(principalSelector).subscribe((principal) => {
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
    this.principalStore.dispatch(
      updatePrincipal({ principal: Principal.invalid() })
    );
    this.localStorage.removeStoredPrincipal();
    this.anyStore.dispatch(clearExpirationTimer());
    this.anyStore.dispatch(clearRefreshTimer());
    this.router.navigate(['/auth']);
  }

  refresh(principal: Principal) {
    //todo: can i refactor?
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
          this.principalStore.dispatch(
            updatePrincipal({ principal: updatedPrincipal })
          );
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
    this.anyStore.dispatch(clearRefreshTimer());
    const refreshDuration = 600000; //refresh every 10 min
    this.anyStore.dispatch(
      updateRefreshTimer({
        refreshTimer: setTimeout(() => {
          this.refresh(principal);
        }, refreshDuration),
      })
    );
  }

  autoLogin() {
    const loadedUser = this.localStorage.getStoredPrincipal();
    if (!loadedUser) {
      return;
    }
    if (loadedUser.token && loadedUser.tokenExpirationDate > new Date()) {
      this.refresh(loadedUser);
      this.principalStore.dispatch(updatePrincipal({ principal: loadedUser }));
    } else {
      this.localStorage.removeStoredPrincipal();
    }
  }

  autoLogout(tokenExpirationDate: Date) {
    this.anyStore.dispatch(clearExpirationTimer());
    const expirationDuration =
      new Date(tokenExpirationDate).getTime() - new Date().getTime();
    this.anyStore.dispatch(
      updateExpirationTimer({
        expirationTimer: setTimeout(() => {
          this.logout();
        }, expirationDuration),
      })
    );
  }

  isLoggedIn() {
    return this.principalStore.select(principalSelector).pipe(
      take(1),
      map((principal) => {
        return Principal.isValid(principal);
      })
    );
  }

  private handleAuthentication(authResponseData: AuthResponseData) {
    const principal = new Principal(
      authResponseData.email,
      authResponseData.localId,
      authResponseData.refreshToken,
      authResponseData.idToken,
      this.getExpirationDate(authResponseData.expiresIn)
    );
    this.principalStore.dispatch(updatePrincipal({ principal: principal }));
  }

  private getExpirationDate(expiresIn: string) {
    return new Date(new Date().getTime() + +expiresIn * 1000);
  }
}
