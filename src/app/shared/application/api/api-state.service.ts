import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccountState } from './model/account.model';
import { TokenInfoState } from './model/tokeninfo.model';

@Injectable({ providedIn: 'root' })
export class ApiStateService {
  //state
  apiKey = new BehaviorSubject<string>('');
  //dependent of apiKey
  account = new BehaviorSubject<AccountState>(AccountState.invalid());
  tokenInfo = new BehaviorSubject<TokenInfoState>(TokenInfoState.invalid());
}
