import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map, switchMap } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { UserService } from 'src/app/shared/application/user.service';
import { environment } from 'src/environments/environment';
import { SignupService } from './signup.service';

const heimGuildId = environment.heimGuildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private user: UserService,
    private signupService: SignupService
  ) {}

  get apiKey(): string {
    return this.api.apiKey;
  }

  validateApiKey(apiKey: string): Observable<any> {
    this.api.apiKey = apiKey;
    this.isLoading.next(true);
    return this.api.account.pipe(
      switchMap((account) => {
        if (account.guilds.includes(heimGuildId)) {
          return this.user.loadUsernames().pipe(
            map((resData) => {
              if (resData !== null && !resData.includes(account.name)) {
                this.signupService.account.next(account);
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
