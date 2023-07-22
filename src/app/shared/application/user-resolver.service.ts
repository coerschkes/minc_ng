import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

export const UserResolver: ResolveFn<void> = () => {
  const auth: AuthService = inject(AuthService);
  const notification: NotificationService = inject(NotificationService);
  inject(UserService)
    .loadUserForPrincipal()
    .pipe(
      map((user) => {
        if (user === null) {
          auth.logout();
          notification.showError(
            'User not found in database! Contact the admin.'
          );
        }
      })
    )
    .subscribe();
};
