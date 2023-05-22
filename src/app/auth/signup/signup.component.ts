import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  apiKeyIsValid: boolean = true;

  constructor() {}

  //todo: add loading spinner and text (check for is in use, check for has permissions) while api key is being validated
  //todo: display message when check is failing
  //todo: go "forward" in the "wizard" when check is passing
  //have a button for submitting the "check"

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      // todo: add api key validator
      apiKey: new FormControl('', [Validators.required]),
      //todo: add username validator
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      //todo: add password validator
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
