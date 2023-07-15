import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TokenInfoState } from 'src/app/shared/application/api/model/tokeninfo.model';
import { UserState } from 'src/app/shared/application/model/user.model';
import { apiKeySelector, tokenInfoSelector } from 'src/app/store/api/api.selector';
import { userSelector } from 'src/app/store/app/user.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user$: Observable<UserState> = new Observable<UserState>();
  tokenInfo$: Observable<TokenInfoState> = new Observable<TokenInfoState>();
  apiKey$: Observable<String> = new Observable<String>();
  panelOpenState = false;

  constructor(
    private userStore: Store<{ user: UserState }>,
    private tokenInfoStore: Store<{ tokenInfo: TokenInfoState }>,
    private apiKeyStore: Store<{ apiKey: string }>
  ) {}

  ngOnInit(): void {
    this.user$ = this.userStore.select(userSelector);
    this.tokenInfo$ = this.tokenInfoStore.select(tokenInfoSelector);
    this.apiKey$ = this.apiKeyStore.select(apiKeySelector);
  }

  concatenateStringArray(array: string[]): string {
    let result: string = '';
    for (let i = 0; i < array.length; i++) {
      result += array[i].toString();
      if (i < array.length - 1) {
        result += ', ';
      }
    }
    return result;
  }
}
