import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { ApiKeyService } from './api-key.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  authForm: FormGroup = new FormGroup({});
  passwordVisible: boolean = false;
  //mirrored from signup service
  isLoading: boolean = false;
  error: string = '';
  account: Account = Account.invalid();
  apiPermissions: string[] = [];
  loadingState: string = '';
  //subscriptions to signup service
  isLoadingSub: Subscription = new Subscription();
  errorSub: Subscription = new Subscription();
  accountSub: Subscription = new Subscription();
  apiPermissionsSub: Subscription = new Subscription();
  loadingStateSub: Subscription = new Subscription();

  //todo: test signup process, especially errors! -> what happens if user not persisting? what happens when wrong url?
  //what happens when no permissions to write to db? what happens when email exists? what happens on network error? retry?

  //todo: what happens when unauthorized? -> logout?
  //todo: onLogout/inconsistent state -> clear local storage and redirect to login

  constructor(
    private apiKeyService: ApiKeyService,
    private router: Router,
    private signupService: SignupService
  ) {}

  ngOnInit(): void {
    this.isLoadingSub = this.signupService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.errorSub = this.signupService.error.subscribe((error) => {
      this.error = error;
    });
    this.accountSub = this.signupService.account.subscribe((account) => {
      this.account = account;
    });
    this.apiPermissionsSub = this.signupService.apiPermissions.subscribe(
      (apiPermissions) => {
        this.apiPermissions = apiPermissions;
      }
    );
    this.loadingStateSub = this.signupService.loadingState.subscribe(
      (loadingState) => {
        this.loadingState = loadingState;
      }
    );
    this.initForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSub.unsubscribe();
    this.errorSub.unsubscribe();
    this.accountSub.unsubscribe();
    this.apiPermissionsSub.unsubscribe();
    this.loadingStateSub.unsubscribe();
  }

  onValidateApiKey() {
    this.apiKeyService.validateApiKey(this.authForm.value.apiKey);
  }

  onSubmit() {
    if (this.authForm.valid && this.accountIsValid()) {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      this.signupService
        .signup(email, password, this.apiKeyService.apiKey)
        .subscribe({
          error: (error) => {
            this.signupService.isLoading.next(false);
            this.signupService.error.next(error);
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

  onHandleError() {
    this.error = '';
  }

  accountIsValid(): boolean {
    return Account.isValid(this.account);
  }

  onTogglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  private initForm() {
    this.authForm = new FormGroup({
      apiKey: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}){2}'
        ),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
