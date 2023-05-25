import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from './model/user.model';
import { UserService } from './user.service';

export const UserResolver: ResolveFn<User> = () => {
  let user: User = User.invalid();
  inject(UserService)
    .loadUserForPrincipal()
    .subscribe((usr) => (user = usr));
  console.log('resolved user');
  return user;
};
