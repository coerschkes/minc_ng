import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUrlBuilder } from './api-url-builder.service';
import { AccountState } from './model/account.model';
import { TokenInfoState } from './model/tokeninfo.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public account(apiKey: string): Observable<AccountState> {
    return this.http.get<AccountState>(new ApiUrlBuilder(apiKey).account).pipe(
      map((response: AccountState) => {
        return response;
      })
    );
  }

  public tokenInfo(apiKey: string): Observable<TokenInfoState> {
    return this.http
      .get<TokenInfoState>(new ApiUrlBuilder(apiKey).tokenInfo)
      .pipe(
        map((response: TokenInfoState) => {
          return response;
        })
      );
  }
}
