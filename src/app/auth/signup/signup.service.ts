import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  mergeMap,
  switchMap,
  take,
} from 'rxjs';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { Role } from 'src/app/shared/application/model/roles.model';
import { UserState } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';
import {
  accountSelector,
  apiKeySelector,
} from 'src/app/store/api/api.selector';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class SignupService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthService,
    private user: UserService,
    private apiKeyStore: Store<{ apiKey: string }>,
    private accountStore: Store<{ account: AccountState }>
  ) {}

  //has to be called after api-key-validation. Depends on account and apiKey
  signup(email: string, password: string): Observable<any> {
    this.isLoading.next(true);
    return forkJoin({
      apiKey: this.apiKeyStore.select(apiKeySelector).pipe(take(1)),
      account: this.accountStore.select(accountSelector).pipe(take(1)),
    }).pipe(
      switchMap((res) => {
        const user: UserState = new UserState(res.apiKey, res.account.name, [
          Role.MEMBER,
        ]);
        return this.auth.signup(email, password).pipe(
          mergeMap(() => {
            return forkJoin({
              userSave: this.user.saveUser(user),
              username: this.user.saveUsername(res.account.name),
            });
          })
        );
      })
    );
  }
}
