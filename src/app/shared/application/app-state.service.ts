import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './model/user.model';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(User.invalid());
}
