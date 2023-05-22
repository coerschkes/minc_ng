import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthDirective } from '../auth.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent extends AuthDirective implements OnInit {
  ngOnInit(): void {
    this.authForm = new FormGroup({
      //todo: improve login "header"
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.handleAuth(
      this.authService.login(
        this.authForm.value.email,
        this.authForm.value.password
      )
    );
  }
}
