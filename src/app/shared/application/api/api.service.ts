import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiUrlBuilderService } from './api-url-builder.service';
import { Account } from './model/account.model';
import { TokenInfo } from './model/tokeninfo.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private url: ApiUrlBuilderService, private http: HttpClient) {}

  get account(): Observable<Account> {
    return this.url.account.pipe(
      switchMap((url) =>
        this.http.get<Account>(url).pipe(
          map((response: Account) => {
            return response;
          })
        )
      )
    );
  }

  get tokenInfo(): Observable<TokenInfo> {
    return this.url.tokenInfo.pipe(
      switchMap((url) =>
        this.http.get<TokenInfo>(url).pipe(
          map((response: TokenInfo) => {
            return response;
          })
        )
      )
    );
  }
}
