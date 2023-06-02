import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ApiStateService } from './shared/application/api/api-state.service';
import { ApiService } from './shared/application/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private currentApiKey = '';
  apiKeySub: Subscription = Subscription.EMPTY;

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private apiState: ApiStateService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.apiKeySub = this.apiState.apiKey.subscribe((apiKey) => {
      if (
        apiKey !== null &&
        apiKey !== '' &&
        apiKey !== undefined &&
        apiKey !== this.currentApiKey
      ) {
        //preload account and tokenInfo if apiKey is set
        this.currentApiKey = apiKey;
        forkJoin({
          account: this.api.account.pipe(
            tap((resData) => this.apiState.account.next(resData))
          ),
          tokenInfo: this.api.tokenInfo.pipe(
            tap((resData) => this.apiState.tokenInfo.next(resData))
          ),
        }).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.apiKeySub.unsubscribe();
  }
}
