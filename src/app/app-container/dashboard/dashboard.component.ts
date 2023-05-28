import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User = User.invalid();
  sub: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.sub = this.userService.userSubject.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
