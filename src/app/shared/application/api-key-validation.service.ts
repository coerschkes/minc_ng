import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map, switchMap } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { UserService } from 'src/app/shared/application/user.service';
import { environment } from 'src/environments/environment';
import { ApiUrlBuilderService } from './api/api-url-builder.service';
import { Account } from './api/model/account.model';

const heimGuildId = environment.heimGuildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyValidationService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  account: BehaviorSubject<Account> = new BehaviorSubject<Account>(Account.invalid());

  //todo rework: validation should notify observers from THIS class not from another class. Cross state = bad design

  constructor(
    private api: ApiService,
    private url: ApiUrlBuilderService,
    private user: UserService,
  ) {}

  validateApiKey(apiKey: string): Observable<any> {
    this.url.apiKey.next(apiKey);
    this.isLoading.next(true);
    return this.api.account.pipe(
      switchMap((account) => {
        if (account.guilds.includes(heimGuildId)) {
          return this.user.loadUsernames().pipe(
            map((resData) => {
              if (resData !== null && !resData.includes(account.name)) {
                this.account.next(account);
                // this.signupService.account.next(account); //todo: rework signup flow to use this account!
              } else {
                throw new Error('This account is already registered!');
              }
            })
          );
        } else {
          throw new Error('The Account is not a member of [Heim]!');
        }
      }),
      finalize(() => {
        this.isLoading.next(false);
      })
    );
  }
}
