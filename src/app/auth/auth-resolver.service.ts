import { ResolveFn } from '@angular/router';

export const AuthResolver: ResolveFn<void> = () => {
  //todo: check if useful -> probably not
  // inject(UserService).userSubject.next(User.invalid());
};
