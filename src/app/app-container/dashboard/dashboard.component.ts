import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserState } from 'src/app/shared/application/model/user.model';
import { userSelector } from 'src/app/store/app/user.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<UserState> = new Observable<UserState>();

  constructor(private store: Store<{ user: UserState }>) {}

  //todo: rework login flow. is the userstate.username the account name or must the account be loaded here to display the right name?
  //todo: check settings page apikey: why is it so randomly loaded inside the input component? 

  ngOnInit(): void {
    this.currentUser$ = this.store.select(userSelector);
  }
}
