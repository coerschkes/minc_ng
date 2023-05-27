import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  mergeMap,
  switchMap,
  take
} from 'rxjs';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { Role } from 'src/app/shared/application/model/roles.model';
import { User } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class SignupService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  account: BehaviorSubject<Account> = new BehaviorSubject<Account>(
    Account.invalid()
  );

  constructor(private auth: AuthService, private user: UserService) {}

  signup(email: string, password: string, apiKey: string): Observable<any> {
    this.isLoading.next(true);
    return this.account.pipe(
      take(1),
      switchMap((account) => {
        const user: User = new User(apiKey, account.name, [Role.MEMBER]);
        return this.auth.signup(email, password).pipe(
          mergeMap(() => {
            return forkJoin({
              userSave: this.user.saveUser(user),
              username: this.user.saveUsername(account.name),
            });
          })
        );
      })
    );
  }
}
