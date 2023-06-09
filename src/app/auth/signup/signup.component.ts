import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { updateAccount } from 'src/app/store/api/api.actions';
import { accountSelector } from 'src/app/store/api/api.selector';
import { ApiKeyValidationService } from '../../shared/application/api-key-validation.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  authForm: FormGroup = new FormGroup({});
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  error: string = '';
  account: AccountState = AccountState.invalid();
  apiKeyError: string = '';

  //subscriptions to signup service
  isSignupLoadingSub: Subscription = new Subscription();
  isApiKeyLoadingSub: Subscription = new Subscription();
  accountSub: Subscription = new Subscription();

  constructor(
    private apiKeyService: ApiKeyValidationService,
    private router: Router,
    private signupService: SignupService,
    private store: Store<{ account: AccountState }>
  ) {}

  ngOnInit(): void {
    this.isSignupLoadingSub = this.signupService.isLoading.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.accountSub = this.store
      .select(accountSelector)
      .subscribe((account) => {
        this.account = account;
      });
    this.isApiKeyLoadingSub = this.apiKeyService.isLoading.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.initForm();
  }

  ngOnDestroy(): void {
    this.isSignupLoadingSub.unsubscribe();
    this.accountSub.unsubscribe();
    this.isApiKeyLoadingSub.unsubscribe();
  }

  onSubmit() {
    if (this.authForm.valid && this.accountIsValid()) {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      this.signupService.signup(email, password).subscribe({
        error: (error) => {
          this.signupService.isLoading.next(false);
          this.error = error;
        },
        complete: () => {
          this.signupService.isLoading.next(false);
          this.authForm.reset();
          this.router.navigate(['/dashboard']);
        },
      });
    } else {
      return;
    }
  }

  accountIsValid(): boolean {
    return AccountState.isValid(this.account);
  }

  onTogglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  private apiKeyValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      const apiKey = control.value;
      if (apiKey !== null && apiKey !== undefined && apiKey !== '') {
        return this.apiKeyService.validateApiKey(apiKey).pipe(
          map(() => {
            this.apiKeyError = '';
            return null;
          }),
          catchError((error) => {
            this.apiKeyError =
              error.message === undefined ? error : error.message;
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
        this.apiKeyValidator().bind(this)
      ),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
