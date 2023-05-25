import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from './model/user.model';

const dbUrl = environment.firebaseDbUrl;

@Injectable({ providedIn: 'root' })
export class UserService {
  userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(User.invalid());

  constructor(private http: HttpClient, private auth: AuthService) {}

  //todo: implement delete methods

  saveUsername(username: string): Observable<string> {
    return this.http
      .put<string>(dbUrl + 'usernames.json', { username: username })
      .pipe(catchError(this.handleError.bind(this)));
  }

  loadUsernames(): Observable<string[]> {
    return this.http
      .get<string[]>(dbUrl + 'usernames.json')
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
      .get<User>(dbUrl + 'users/' + userId + '/user.json')
      .pipe(catchError(this.handleError.bind(this)));
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
          this.userSubject.next(user);
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
