import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiUrlBuilderService } from './api-url-builder.service';
import { AccountState } from './model/account.model';
import { TokenInfoState } from './model/tokeninfo.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private url: ApiUrlBuilderService, private http: HttpClient) {}

  get account(): Observable<AccountState> {
    return this.url.account.pipe(
      switchMap((url) =>
        this.http.get<AccountState>(url).pipe(
          map((response: AccountState) => {
            return response;
          })
        )
      )
    );
  }

  get tokenInfo(): Observable<TokenInfoState> {
    return this.url.tokenInfo.pipe(
      switchMap((url) =>
        this.http.get<TokenInfoState>(url).pipe(
          map((response: TokenInfoState) => {
            return response;
          })
        )
      )
    );
  }
}
