import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { UserService } from 'src/app/shared/application/user.service';
import { updateAccount, updateApiKey } from 'src/app/store/api/api.actions';
import { environment } from 'src/environments/environment';
import { AccountState } from './api/model/account.model';

const guildId = environment.guildId;

@Injectable({ providedIn: 'root' })
export class ApiKeyValidationService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  validationError: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private api: ApiService,
    private user: UserService,
    private store: Store
  ) {}

  get validator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      const apiKey = control.value;
      if (apiKey !== null && apiKey !== undefined && apiKey !== '') {
        return this.validateApiKey(apiKey).pipe(
          map(() => {
            this.validationError.next('');
            return null;
          }),
          catchError((error) => {
            this.validationError.next(
              error.message === undefined ? error : error.message
            );
            this.store.dispatch(
              updateAccount({ account: AccountState.invalid() })
            );
            return of({ apiKeyError: { value: control.value } });
          })
        );
      } else {
        return of({ apiKeyError: { value: control.value } });
      }
    };
  }

  private validateApiKey(apiKey: string): Observable<any> {
    this.store.dispatch(updateApiKey({ apiKey }));
    this.isLoading.next(true);
    return this.api.account.pipe(
      switchMap((account) => {
        if (account.guilds.includes(guildId)) {
          return this.user.loadUsernames().pipe(
            map((resData) => {
              if (resData !== null && !resData.includes(account.name)) {
                this.store.dispatch(updateAccount({ account }));
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
