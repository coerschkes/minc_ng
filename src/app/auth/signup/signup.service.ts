import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  mergeMap,
  switchMap,
  take,
} from 'rxjs';
import { ApiKeyValidationService } from 'src/app/shared/application/api-key-validation.service';
import { ApiUrlBuilderService } from 'src/app/shared/application/api/api-url-builder.service';
import { Role } from 'src/app/shared/application/model/roles.model';
import { User } from 'src/app/shared/application/model/user.model';
import { UserService } from 'src/app/shared/application/user.service';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class SignupService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthService,
    private user: UserService,
    private apiUrlBuilderService: ApiUrlBuilderService,
    private apiKeyValidationService: ApiKeyValidationService
  ) {}

  signup(email: string, password: string): Observable<any> {
    this.isLoading.next(true);
    return forkJoin({
      apiKey: this.apiUrlBuilderService.apiKey.pipe(take(1)),
      account: this.apiKeyValidationService.account.pipe(take(1)),
    }).pipe(
      switchMap((res) => {
        const user: User = new User(res.apiKey, res.account.name, [
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
