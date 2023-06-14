import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map, switchMap } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { UserService } from 'src/app/shared/application/user.service';
import { environment } from 'src/environments/environment';
import { ApiStateService } from './api/api-state.service';
import { Store } from '@ngrx/store';
import { apiKeySelector } from 'src/app/store/api/api.selector';
import { updateApiKey } from 'src/app/store/api/api.actions';

const heimGuildId = environment.heimGuildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyValidationService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private user: UserService,
    private apiState: ApiStateService,
    private store: Store
  ) {}

  validateApiKey(apiKey: string): Observable<any> {
    this.store.dispatch(updateApiKey({ apiKey }));
    this.isLoading.next(true);
    return this.api.account.pipe(
      switchMap((account) => {
        if (account.guilds.includes(heimGuildId)) {
          return this.user.loadUsernames().pipe(
            map((resData) => {
              if (resData !== null && !resData.includes(account.name)) {
                this.apiState.account.next(account);
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
