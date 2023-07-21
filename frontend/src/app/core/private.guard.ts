import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service'

export const privateGuard: CanActivateFn = (_route, _state) => {
  if (inject(AuthService).isLogged()) {
    return true
  } else {
    return inject(Router).navigateByUrl('/login')
  }
};
