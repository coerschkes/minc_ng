import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ApiKeyValidationService } from 'src/app/shared/application/api-key-validation.service';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { TokenInfoState } from 'src/app/shared/application/api/model/tokeninfo.model';
import { UserState } from 'src/app/shared/application/model/user.model';
import {
  accountSelector,
  apiKeySelector,
  tokenInfoSelector,
} from 'src/app/store/api/api.selector';
import { userSelector } from 'src/app/store/app/user.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  user$: Observable<UserState> = new Observable<UserState>();
  tokenInfo$: Observable<TokenInfoState> = new Observable<TokenInfoState>();
  apiKey$: Observable<String> = new Observable<String>();
  account$: Observable<AccountState> = new Observable<AccountState>();
  panelOpenState = false;
  authForm: FormGroup = new FormGroup({});
  validationError: string = '';
  isLoading: boolean = false;

  validationErrorSub: Subscription = new Subscription();
  isApiKeyLoadingSub: Subscription = new Subscription();

  constructor(
    private userStore: Store<{ user: UserState }>,
    private tokenInfoStore: Store<{ tokenInfo: TokenInfoState }>,
    private apiKeyStore: Store<{ apiKey: string }>,
    private accountStore: Store<{ account: AccountState }>,
    private apiKeyValtionService: ApiKeyValidationService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userStore.select(userSelector);
    this.tokenInfo$ = this.tokenInfoStore.select(tokenInfoSelector);
    this.apiKey$ = this.apiKeyStore.select(apiKeySelector);
    this.account$ = this.accountStore.select(accountSelector);
    this.isApiKeyLoadingSub = this.apiKeyValtionService.isLoading.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.validationErrorSub =
      this.apiKeyValtionService.validationError.subscribe(
        (validationError) => (this.validationError = validationError)
      );
    this.initForm();
  }

  ngOnDestroy(): void {
    this.validationErrorSub.unsubscribe();
    this.isApiKeyLoadingSub.unsubscribe();
  }

  concatenateStringArray(array: string[]): string {
    let result: string = '';
    for (let i = 0; i < array.length; i++) {
      result += array[i].toString();
      if (i < array.length - 1) {
        result += ', ';
      }
    }
    return result;
  }

  private initForm() {
    this.authForm = new FormGroup({
      apiKey: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern(
            '([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}){2}'
          ),
        ],
        this.apiKeyValtionService.validator
      ),
    });
  }
}
