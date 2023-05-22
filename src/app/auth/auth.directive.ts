import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Directive()
export abstract class AuthDirective {
  protected authForm: FormGroup = new FormGroup({});
  protected isLoading: boolean = false;
  protected error: string = '';

  constructor(protected router: Router, protected authService: AuthService) {}

  abstract onSubmit(): void;

  protected handleAuth(observable: Observable<AuthResponseData>) {
    if (!this.authForm.valid) {
      return;
    } else {
      this.isLoading = true;

      observable.subscribe({
        next: (resData) => {
          console.log(resData);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (errorMessage) => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        },
      });

      this.authForm.reset();
    }
  }

  protected onHandleError() {
    this.error = '';
  }
}
