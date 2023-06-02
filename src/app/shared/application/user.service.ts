import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { AppStateService } from './app-state.service';
import { Role, roleFromString } from './model/roles.model';
import { User } from './model/user.model';

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
    private auth: AuthService,
    private appState: AppStateService
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

  saveUser(user: User): Observable<User> {
    return this.auth.principalSubject.pipe(
      take(1),
      exhaustMap((principal) => {
        return this.http
          .put<User>(dbUrl + 'users/' + principal.id + '/user.json', user)
          .pipe(catchError(this.handleError.bind(this)));
      })
    );
  }

  loadUserById(userId: string): Observable<User> {
    return this.http
      .get<UserResponseData>(dbUrl + 'users/' + userId + '/user.json')
      .pipe(
        map((userResponseData) => {
          return new User(
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

  loadUserForPrincipal(): Observable<User> {
    return this.auth.principalSubject
      .pipe(
        take(1),
        exhaustMap((principal) => {
          return this.loadUserById(principal.id);
        })
      )
      .pipe(
        tap((user: User) => {
          this.appState.user.next(user);
        })
      );
  }

  updateUserById(userId: string, user: User): Observable<User> {
    return this.http
      .put<User>(dbUrl + 'users/' + userId + '/user.json', user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateUserForPrincipal(user: User): Observable<any> {
    return this.auth.principalSubject.pipe(
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
