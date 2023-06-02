import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiStateService } from 'src/app/shared/application/api/api-state.service';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { TokenInfo } from 'src/app/shared/application/api/model/tokeninfo.model';
import { AppStateService } from 'src/app/shared/application/app-state.service';
import { User } from 'src/app/shared/application/model/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  user: User = User.invalid();
  tokenInfo: TokenInfo = TokenInfo.invalid();
  panelOpenState = false;
  userSub: Subscription = new Subscription();
  tokenInfoSub: Subscription = new Subscription();

  constructor(
    private appState: AppStateService,
    private api: ApiService,
    private apiState: ApiStateService
  ) {}

  ngOnInit(): void {
    this.tokenInfoSub = this.apiState.tokenInfo.subscribe((tokenInfo) => {
      this.tokenInfo = tokenInfo;
    });
    this.userSub = this.appState.user.subscribe({
      next: (user) => {
        this.user = user;
      },
      complete: () => {
        this.api.tokenInfo.subscribe((tokenInfo) => {
          this.apiState.tokenInfo.next(tokenInfo);
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
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
