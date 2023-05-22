import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        if (
          router
            .getCurrentNavigation()
            ?.extractedUrl.toString()
            .includes('auth')
        ) {
          return router.createUrlTree(['/dashboard']);
        }
        return true;
      }
      return router.createUrlTree(['/auth']);
    })
  );
};
