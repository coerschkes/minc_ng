import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserState } from './model/user.model';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';

export const UserResolver: ResolveFn<UserState> = () => {
  let user: UserState = UserState.invalid();
  let auth: AuthService = inject(AuthService);
  let notification: NotificationService = inject(NotificationService);
  inject(UserService)
    .loadUserForPrincipal()
    .subscribe({
      next: (u) => {
        if (u === null) {
          auth.logout();
          notification.showError('User not found in database! Contact the admin.');
        } else {
          user = u;
        }
      },
    });
  return user;
};
