import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { UserService } from 'src/app/shared/application/user.service';
import { AuthService } from '../auth.service';
import { ApiKeyService } from './api-key.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  authForm: FormGroup = new FormGroup({});
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

  //todo: prevent multi-signup / login after several tries?
  //todo: form validation
  //todo: add api key validator
  //todo: add password validator
  //todo: add second password field?
  //todo: show password feature
  //todo: test signup process, especially errors! -> what happens if user not persisting? what happens when wrong url?
  //what happens when no permissions to write to db? what happens when email exists? what happens on network error? retry?
  //todo: good error messages! -> implement error mapper
  //todo: restrict db access to authenticated only

  constructor(
    private apiKeyService: ApiKeyService,
    private auth: AuthService,
    private router: Router,
    private user: UserService,
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

  initForm() {
    this.authForm = new FormGroup({
      apiKey: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      status: new FormControl('Member', [Validators.required]),
    });
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
          next: () => {
            console.log('signup next');
          },
          complete: () => {
            this.signupService.isLoading.next(false);
            console.log('signup complete');
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
}
