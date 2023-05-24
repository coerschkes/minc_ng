import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { User } from './model/user.model';

const dbUrl = environment.firebaseDbUrl;

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

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
    return this.auth.principalSubject.pipe(
      take(1),
      exhaustMap((principal) => {
        return this.loadUserById(principal.id);
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
