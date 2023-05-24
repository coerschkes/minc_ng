import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthDirective } from '../auth.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent extends AuthDirective implements OnInit {
  // accountInfo: AccountInfo = AccountInfo.invalid;

  //all shown only when api key is valid
  //todo: go "forward" in the "wizard" when check is passing

  ngOnInit(): void {
    //todo: form validation
    // todo: add api key validator
    //todo: add password validator
    //todo: add second password field?
    //todo: show password feature
    //todo: validate api key with backend call
    this.initForm();
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

  onCheckApiKey() {
    this.apiService.apiKey = this.authForm.value.apiKey;
    this.apiService.account.subscribe((resData) => {
      console.log(resData);
    });
    this.apiService.tokenInfo.subscribe((resData) => {
      console.log('tokeninfo: ' + resData.permissions);
    });

    //check if account is used already
    // this.isLoading = true;
    // this.api.getAccount(this.authForm.value.apiKey).subscribe({
    //   next: (resData: AccountInfo) => {
    //     this.accountInfo = resData;
    //     this.isLoading = false;
    //   },
    //   error: (errorMessage) => {
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   },
    //   complete: () => {
    //     console.log(this.accountInfo);
    //     console.log(this.accountInfoValid);
    //     this.authForm.get('apiKey')?.disable();
    //   },
    // });
    //check if account is in guild
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

  get accountInfoValid() {
    return true;
    // return (
    //   this.accountInfo.username !== '' &&
    //   this.accountInfo.world !== 0 &&
    //   this.accountInfo.guilds.length > 0
    // );
  }

  private persistMetadata(apiKey: string, userId: string) {
    // const metadata = <UserMetadata>{
    //   username: this.accountInfo.username,
    //   apiKey: apiKey,
    //   roles: ['Member'],
    // };
    // this.db.persistUserMetadata(userId, metadata);
    // this.authService.userMetadataSubject.next(metadata);
  }
}
