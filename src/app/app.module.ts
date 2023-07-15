import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { AppContainerModule } from './app-container/app-container.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthParamInterceptorService } from './auth/auth-interceptor.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpErrorHandlerInterceptor } from './shared/application/http-error-handler-interceptor.service';
import { LoggingInterceptorService } from './shared/application/logging-interceptor.service';
import {
  accountReducer,
  apiKeyReducer,
  tokenInfoReducer,
} from './store/api/api.reducer';
import { userReducer } from './store/app/user.reducer';
import {
  expirationTimerReducer,
  principalReducer,
  refreshTimerReducer,
} from './store/auth/auth.reducer';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppContainerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      user: userReducer,
      apiKey: apiKeyReducer,
      tokenInfo: tokenInfoReducer,
      account: accountReducer,
      expirationTimer: expirationTimerReducer,
      refreshTimer: refreshTimerReducer,
      principal: principalReducer,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthParamInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorHandlerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
