import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/application/notification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  passwordVisible: boolean = false;
  authForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;

  //todo: prevent login spamming
  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    //todo: improve login "header" with icon
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if(!this.authForm.valid) return;
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    this.isLoading = true;

    this.auth.login(email, password).subscribe({
      error: (error) => {
        this.isLoading = false;
        this.onError(error);
      },
      complete: () => {
        this.isLoading = false;
        this.authForm.reset();
        this.router.navigate(['/dashboard']);
      },
    });
  }

  onTogglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onError(error: string) {
    this.notification.showError(error);
  }
}
