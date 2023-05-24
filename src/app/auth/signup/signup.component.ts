import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/shared/application/api/model/account.model';
import { ApiKeyService } from './api-key.service';

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

  constructor(private apiKeyService: ApiKeyService) {}

  ngOnInit(): void {
    this.isLoadingSub = this.apiKeyService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.errorSub = this.apiKeyService.error.subscribe((error) => {
      this.error = error;
    });
    this.accountSub = this.apiKeyService.account.subscribe((account) => {
      this.account = account;
    });
    this.apiPermissionsSub = this.apiKeyService.apiPermissions.subscribe(
      (apiPermissions) => {
        this.apiPermissions = apiPermissions;
      }
    );
    this.loadingStateSub = this.apiKeyService.loadingState.subscribe(
      (loadingState) => {
        this.loadingState = loadingState;
      }
    );
    //todo: prevent multi-signup / login after several tries?
    //todo: form validation
    //todo: add api key validator
    //todo: add password validator
    //todo: add second password field?
    //todo: show password feature
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
    // this.api.getAccount(this.authForm.value.apiKey).subscribe((resData) => {
    //   this.accountInfo = resData;
    // });
    // console.log(this.accountInfo);
    // if (this.authForm.valid && this.accountInfo.isValid) {
    // this.isLoading = true;
    // const email = this.authForm.value.email;
    // const password = this.authForm.value.password;
    // const apiKey = this.authForm.value.apiKey;
    // this.authService.signup(email, password).subscribe({
    //   next: (resData: any) => {
    //     this.persistMetadata(apiKey, resData['localId']);
    //     this.isLoading = false;
    //   },
    //   error: (errorMessage) => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   },
    // });
    // this.authForm.reset();
    // this.router.navigate(['/dashboard']);
    // } else {
    //   return;
    // }
  }

  onHandleError() {
    this.error = '';
  }

  accountIsValid(): boolean {
    return Account.isValid(this.account);
  }
}
