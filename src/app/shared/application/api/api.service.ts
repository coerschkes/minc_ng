import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiUrlBuilderService } from './api-url-builde.service';
import { Account } from './model/account.model';
import { TokenInfo } from './model/tokeninfo.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private url: ApiUrlBuilderService, private http: HttpClient) {}

  set apiKey(apiKey: string) {
    this.url.apiKey = apiKey;
  }

  get account(): Observable<Account> {
    return this.http
      .get<Account>(this.url.account)
      .pipe(
        map((response: Account) => {
          return response;
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  get tokenInfo(): Observable<TokenInfo> {
    return this.http
      .get<TokenInfo>(this.url.tokenInfo)
      .pipe(
        map((response: TokenInfo) => {
          return response;
        })
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  handleError(errorRes: HttpErrorResponse) {
    //todo: proper error handling
    return throwError(() => {
      errorRes;
    });
  }
}
