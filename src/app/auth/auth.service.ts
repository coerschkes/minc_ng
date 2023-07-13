import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { NotificationService } from '../shared/application/notification.service';
import {
  clearExpirationTimer,
  clearRefreshTimer,
  updateExpirationTimer,
  updatePrincipal,
  updateRefreshTimer,
} from '../store/auth/auth.actions';
import {
  principalSelector,
  principalValidSelector,
} from '../store/auth/auth.selector';
import {
  AuthResponseData,
  RefreshResponseData,
  firebaseLoginUrl,
  firebaseRefreshUrl,
  firebaseSignupUrl,
} from './model/auth-communication.model';
import { LocalStorageService } from './local-storage.service';
import { PrincipalMapperService } from './principal-mapper.service';
import { Principal } from './model/principal.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
    private notificationService: NotificationService,
    private principalMapper: PrincipalMapperService,
    private anyStore: Store<any>,
    private principalStore: Store<{ principal: Principal }>
  ) {
    this.initPrincipal();
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

  refreshToken(principal: Principal) {
    this.http
      .post<RefreshResponseData>(firebaseRefreshUrl, {
        grant_type: 'refresh_token',
        refresh_token: principal.refreshToken,
      })
      .pipe(
        map((refreshData) => {
          const updatedPrincipal = this.principalMapper.mapRefreshToPrincipal(
            principal,
            refreshData
          );
          this.updatePrincipal(updatedPrincipal);
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

  autoRefreshToken(principal: Principal) {
    this.anyStore.dispatch(clearRefreshTimer());
    const refreshDuration = 600000; //refresh every 10 min
    this.anyStore.dispatch(
      updateRefreshTimer({
        refreshTimer: setTimeout(() => {
          this.refreshToken(principal);
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
      this.refreshToken(loadedUser);
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
    return this.principalStore.select(principalValidSelector);
  }

  private handleAuthentication(authRes: AuthResponseData) {
    const principal = this.principalMapper.mapAuthResToPrincipal(authRes);
    this.updatePrincipal(principal);
  }

  private updatePrincipal(principal: Principal) {
    this.principalStore.dispatch(updatePrincipal({ principal: principal }));
  }

  private initPrincipal() {
    this.principalStore.select(principalSelector).subscribe((principal) => {
      if (Principal.isValid(principal)) {
        this.localStorage.storePrincipal(principal);
        this.autoLogout(principal.tokenExpirationDate);
        this.autoRefreshToken(principal);
      }
    });
  }
}
