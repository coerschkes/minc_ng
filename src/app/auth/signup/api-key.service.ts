import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { UserService } from 'src/app/shared/application/user.service';
import { environment } from 'src/environments/environment';
import { SignupService } from './signup.service';

const heimGuildId = environment.heimGuildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  constructor(
    private api: ApiService,
    private user: UserService,
    private signupService: SignupService
  ) {}

  validateApiKey(apiKey: string) {
    this.api.apiKey = apiKey;
    this.signupService.error.next('');
    this.signupService.isLoading.next(true);
    this.loadAccountInfo();
  }

  get apiKey(): string {
    return this.api.apiKey;
  }

  private loadAccountInfo() {
    this.signupService.loadingState.next('Loading account info...');
    this.api.account.subscribe({
      next: (resData: Account) => {
        this.signupService.account.next(resData);
      },
      error: (errorMessage) => {
        this.signupService.account.next(Account.invalid());
        this.handleErrror(errorMessage);
      },
      complete: () => {
        console.log('Account loaded');
        this.loadTokenInfo();
      },
    });
  }

  private loadTokenInfo() {
    this.signupService.loadingState.next('Loading token info...');
    this.api.tokenInfo.subscribe({
      next: (resData) => {
        this.signupService.apiPermissions.next(resData.permissions);
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
    this.signupService.loadingState.next('Checking account...');
    this.signupService.account.pipe(take(1)).subscribe((account) => {
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
              this.signupService.isLoading.next(false);
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

  private handleErrror(error: string) {
    this.signupService.error.next(error);
    this.signupService.isLoading.next(false);
  }
}
