import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      // todo: add api key validator
      // apiKey: new FormControl('', [Validators.required]),
      //todo: add username validator
      // username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      //todo: add password validator
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.isLoading = true;

      this.authService.login(email, password).subscribe({
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

      this.loginForm.reset();
    }
  }
}
