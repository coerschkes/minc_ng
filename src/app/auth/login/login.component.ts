import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  authForm: FormGroup = new FormGroup({});
  //mirrored from login service
  error: string = '';
  isLoading: boolean = false;
  //subscriptions to login service
  isLoadingSub: Subscription = new Subscription();
  errorSub: Subscription = new Subscription();

  //todo: prevent login spamming
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.isLoadingSub = this.loginService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.errorSub = this.loginService.error.subscribe((error) => {
      this.error = error;
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSub.unsubscribe();
    this.errorSub.unsubscribe();
  }

  onSubmit() {
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    this.loginService.login(email, password).subscribe({
      complete: () => {
        this.loginService.isLoading.next(false);
        this.authForm.reset();
        this.router.navigate(['/dashboard']);
      },
    });
  }

  onHandleError() {
    this.error = '';
  }

  private initForm() {
    //todo: improve login "header" with icon
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
