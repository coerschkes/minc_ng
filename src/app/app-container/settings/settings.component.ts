import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ApiStateService } from 'src/app/shared/application/api/api-state.service';
import { TokenInfo } from 'src/app/shared/application/api/model/tokeninfo.model';
import { UserState } from 'src/app/shared/application/model/user.model';
import { userSelector } from 'src/app/store/app/user.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  user$: Observable<UserState> = new Observable<UserState>();
  tokenInfo: TokenInfo = TokenInfo.invalid();
  panelOpenState = false;
  tokenInfoSub: Subscription = new Subscription();

  constructor(
    private apiState: ApiStateService,
    private store: Store<{ user: UserState }>
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(userSelector);
    this.tokenInfoSub = this.apiState.tokenInfo.subscribe((tokenInfo) => {
      this.tokenInfo = tokenInfo;
    });
  }

  ngOnDestroy(): void {
    this.tokenInfoSub.unsubscribe();
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
