import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/application/model/user.model';
import { UserService } from '../shared/application/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
