import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service'

export const publicGuard: CanActivateFn = (_route, _state) => {
  if (inject(AuthService).isLogged()) {
    return inject(Router).navigateByUrl('/map')
  } else {
    return true
  }
};
