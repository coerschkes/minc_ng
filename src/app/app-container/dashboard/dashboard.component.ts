import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/shared/application/app-state.service';
import { User } from 'src/app/shared/application/model/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User = User.invalid();
  sub: Subscription = new Subscription();

  constructor(private appState: AppStateService) {}

  ngOnInit(): void {
    this.sub = this.appState.user.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
