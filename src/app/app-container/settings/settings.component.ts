import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  user: User = User.invalid();
  panelOpenState = false;
  userSub: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  concatenateRoles() {
    let result: string = '';
    for (let i = 0; i < this.user.roles.length; i++) {
      result += this.user.roles[i].toString();
      if (i < this.user.roles.length - 1) {
        result += ', ';
      }
    }
    return result;
  }
}
