import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/application/api/api.service';
import { AccountState } from 'src/app/shared/application/api/model/account.model';
import { updateAccount, updateApiKey } from 'src/app/store/api/api.actions';
import { accountValidSelector } from 'src/app/store/api/api.selector';
import { ApiKeyValidationService } from '../../shared/application/api-key-validation.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  accountValid$: Observable<boolean> = new Observable<boolean>();
  authForm: FormGroup = new FormGroup({});
  passwordVisible: boolean = false;
  error: string = '';

  constructor(
    public apiKeyValidationService: ApiKeyValidationService,
    private router: Router,
    public signupService: SignupService,
    private api: ApiService,
    private accountStore: Store<{ account: AccountState }>,
    private apiKeyStore: Store<string>
  ) {}

  ngOnInit(): void {
    this.accountValid$ = this.accountStore.select(accountValidSelector);
    this.initForm();
  }

  async onSubmit() {
    if (this.authForm.valid) {
      const validatedApiKey = this.authForm.value.apiKey;
      this.apiKeyStore.dispatch(updateApiKey({ apiKey: validatedApiKey }));
      this.api.account(validatedApiKey).subscribe((account) => {
        this.accountStore.dispatch(updateAccount({ account }));
      });
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      this.signupService.signup(email, password).subscribe({
        error: (error) => {
          this.signupService.isLoading.next(false);
          this.error = error;
        },
        complete: () => {
          this.signupService.isLoading.next(false);
          this.authForm.reset();
          this.router.navigate(['/dashboard']);
        },
      });
    } else {
      return;
    }
  }

  onTogglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  private initForm() {
    this.authForm = new FormGroup({
      apiKey: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern(
            '([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}){2}'
          ),
        ],
        this.apiKeyValidationService.signupValidator
      ),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
