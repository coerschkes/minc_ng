import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from './model/user.model';
import { UserService } from './user.service';

export const UserResolver: ResolveFn<User> = () => {
  let user: User = User.invalid();
  let auth: AuthService = inject(AuthService);
  inject(UserService)
    .loadUserForPrincipal()
    .subscribe({
      next: (u) => {
        if (u === null) {
          auth.logout();
          //todo: show popup error!
        } else {
          user = u;
        }
      },
    });
  return user;
};
