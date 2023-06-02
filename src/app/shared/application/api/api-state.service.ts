import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from './model/account.model';
import { TokenInfo } from './model/tokeninfo.model';

@Injectable({ providedIn: 'root' })
export class ApiStateService {
  //state
  apiKey = new BehaviorSubject<string>('');
  //dependent of apiKey
  account = new BehaviorSubject<Account>(Account.invalid());
  tokenInfo = new BehaviorSubject<TokenInfo>(TokenInfo.invalid());
}
