import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { UserService } from 'src/app/shared/application/user.service';
import { environment } from 'src/environments/environment';

const heimGuildId = environment.heimGuildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: BehaviorSubject<string> = new BehaviorSubject<string>('');
  account: BehaviorSubject<Account> = new BehaviorSubject<Account>(
    Account.invalid()
  );
  apiPermissions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  loadingState: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private api: ApiService, private user: UserService) {}

  validateApiKey(apiKey: string) {
    this.api.apiKey = apiKey;
    this.isLoading.next(true);
    this.loadAccountInfo();
  }

  private loadAccountInfo() {
    this.loadingState.next('Loading account info...');
    this.api.account.subscribe({
      next: (resData: Account) => {
        this.account.next(resData);
      },
      error: (errorMessage) => {
        this.account.next(Account.invalid());
        this.handleErrror(errorMessage);
      },
      complete: () => {
        console.log('Account loaded');
        this.loadTokenInfo();
      },
    });
  }

  private loadTokenInfo() {
    this.loadingState.next('Loading token info...');
    this.api.tokenInfo.subscribe({
      next: (resData) => {
        this.apiPermissions.next(resData.permissions);
      },
      error: (errorMessage) => {
        this.handleErrror(errorMessage);
      },
      complete: () => {
        console.log('Token info loaded');
        this.checkAccount();
      },
    });
  }

  private checkAccount() {
    this.loadingState.next('Checking account...');
    this.account.pipe(take(1)).subscribe((account) => {
      console.log(account.guilds);
      if (account.guilds.includes(heimGuildId)) {
        this.user.loadUsernames().subscribe({
          next: (resData) => {
            if (
              resData !== null &&
              resData.length > 0 &&
              resData.includes(account.name)
            ) {
              this.handleErrror('This account is already registered!');
            } else {
              this.isLoading.next(false);
            }
          },
          error: (errorMessage) => {
            this.handleErrror(errorMessage);
          },
          complete: () => {
            console.log('Check account complete');
          },
        });
      } else {
        this.handleErrror(
          'The API-Key does not belong to an account that is a member of [Heim]!'
        );
      }
    });
  }

  private handleErrror(errorObj: any) {
    this.error.next(errorObj);
    this.isLoading.next(false);
  }
}
