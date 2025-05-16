import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClientSessionService } from '../../../services/clients/client-session.service';


export const ClientAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const session = inject(ClientSessionService);
  const router = inject(Router);

  // Permitir acceso libre a login y registro
  if (state.url === '/client/login' || state.url === '/client/register') {
    return true;
  }

  // Verificar sesión activa
  if (session.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/client/login']);
    return false;
  }
};
