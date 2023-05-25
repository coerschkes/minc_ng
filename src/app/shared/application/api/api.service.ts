import {
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiErrorHandler } from './api-error-handler';
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

  get apiKey(): string {
    return this.url.apiKey;
  }

  get account(): Observable<Account> {
    return this.http
      .get<Account>(this.url.account)
      .pipe(
        map((response: Account) => {
          return response;
        })
      )
  }

  get tokenInfo(): Observable<TokenInfo> {
    return this.http
      .get<TokenInfo>(this.url.tokenInfo)
      .pipe(
        map((response: TokenInfo) => {
          return response;
        })
      )
  }
}
