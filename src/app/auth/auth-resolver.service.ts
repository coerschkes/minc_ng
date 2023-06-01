import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '../shared/application/model/user.model';
import { UserService } from '../shared/application/user.service';

export const AuthResolver: ResolveFn<void> = () => {
  //todo: check if useful -> probably not
  inject(UserService).userSubject.next(User.invalid());
};
