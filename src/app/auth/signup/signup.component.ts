import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthDirective } from '../auth.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent extends AuthDirective implements OnInit {
  apiKeyIsValid: boolean = true;
  memberStatus = ['Lead', 'Member'];

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

  onSubmit() {
    console.log(this.authForm.value);
    this.handleAuth(
      this.authService.signup(
        this.authForm.value.email,
        this.authForm.value.password
      )
    );
  }
}
