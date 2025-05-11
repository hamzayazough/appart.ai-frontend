import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/register']);
      }
      return isAuthenticated;
    })
  );};
