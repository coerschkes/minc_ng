import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { updateApiKey } from 'src/app/store/api/api.actions';
import { updateUser } from 'src/app/store/app/user.actions';
import { environment } from 'src/environments/environment';
import { Role, roleFromString } from './model/roles.model';
import { UserState } from './model/user.model';

export interface UserResponseData {
  apiKey: string;
  username: string;
  _roles: string[];
}

const dbUrl = environment.firebaseDbUrl;

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private authState: AuthStateService,
    private store: Store
  ) {}

  //todo: implement delete methods

  saveUsername(username: string): Observable<string[]> {
    return this.loadUsernames()
      .pipe(
        switchMap((usernames) => {
          if (usernames !== null && usernames.includes(username)) {
            return throwError(() => 'Username already exists');
          } else {
            if (usernames === null) {
              usernames = [];
            }
            usernames.push(username);
            return this.http.put<string[]>(dbUrl + 'usernames.json', usernames);
          }
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  loadUsernames(): Observable<string[]> {
    return this.http
      .get<string[]>(dbUrl + 'usernames.json')
      .pipe(
        map((usernames) => {
          return usernames === null ? [] : usernames;
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  saveUser(user: UserState): Observable<UserState> {
    return this.authState.principalSubject.pipe(
      take(1),
      exhaustMap((principal) => {
        return this.http
          .put<UserState>(dbUrl + 'users/' + principal.id + '/user.json', user)
          .pipe(catchError(this.handleError.bind(this)));
      })
    );
  }

  loadUserById(userId: string): Observable<UserState> {
    return this.http
      .get<UserResponseData>(dbUrl + 'users/' + userId + '/user.json')
      .pipe(
        map((userResponseData) => {
          return new UserState(
            userResponseData.apiKey,
            userResponseData.username,
            this.toRoles(userResponseData._roles)
          );
        }),
        catchError(this.handleError.bind(this))
      );
  }

  toRoles(roleArray: string[]): Role[] {
    return roleArray.map((array) => {
      return roleFromString(array);
    });
  }

  loadUserForPrincipal(): Observable<UserState> {
    return this.authState.principalSubject
      .pipe(
        take(1),
        exhaustMap((principal) => {
          return this.loadUserById(principal.id);
        })
      )
      .pipe(
        tap((user: UserState) => {
          this.store.dispatch(updateUser({ user: user }));
          if (
            user.apiKey !== '' &&
            user.apiKey !== null &&
            user.apiKey !== undefined
          ) {
            this.store.dispatch(updateApiKey({ apiKey: user.apiKey }));
          }
        })
      );
  }

  updateUserById(userId: string, user: UserState): Observable<UserState> {
    return this.http
      .put<UserState>(dbUrl + 'users/' + userId + '/user.json', user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateUserForPrincipal(user: UserState): Observable<any> {
    return this.authState.principalSubject.pipe(
      take(1),
      exhaustMap((principal) => {
        return this.updateUserById(principal.id, user);
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    return throwError(() => errorRes);
  }
}
