import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  apiKeyIsValid: boolean = true;
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  //todo: add loading spinner and text (check for is in use, check for has permissions) while api key is being validated
  //todo: display message when check is failing
  //todo: go "forward" in the "wizard" when check is passing

  ngOnInit(): void {
    //todo: form validation and error handling
    this.signupForm = new FormGroup({
      // todo: add api key validator
      // apiKey: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      //todo: add password validator
      //todo: add second password field
      //todo: show password feature
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    } else {
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;
      this.isLoading = true;

      this.authService.signup(email, password).subscribe({
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

      this.signupForm.reset();
    }
  }
}
