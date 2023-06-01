import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { TokenInfo } from 'src/app/shared/application/api/model/tokeninfo.model';
import { User } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';

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

  constructor(private userService: UserService, private api: ApiService) {}

  //todo: on login/init app -> load api key centralized and dont load it in every component (also make sure its not changing unless by settings)

  ngOnInit(): void {
    this.userSub = this.userService.userSubject.subscribe((user) => {
      this.user = user;
      // this.api.apiKey = this.user.apiKey;
      this.tokenInfoSub.unsubscribe();
      this.tokenInfoSub = this.api.tokenInfo.subscribe((tokenInfo) => {
        this.tokenInfo = tokenInfo;
        console.log(this.tokenInfo.permissions);
      });
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
