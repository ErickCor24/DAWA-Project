import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { ClientService } from '../../../services/clients/client.service';
import { map, catchError, of } from 'rxjs';
import { Client } from '../../../models/clients/client.model';

export const ClientAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthServiceService);
  const clientService = inject(ClientService);
  const router = inject(Router);

  const clientId = authService.getIdToken();

  if (state.url === '/client/login' || state.url === '/client/register') {
    return true;
  }

  if (!clientId) {
    authService.removeAuthToken();
    router.navigate(['/client/login']);
    return false;
  }

  return clientService.getClientById(clientId).pipe(
    map((client: Client) => {
      if (client && client.status) {
        return true;
      } else {
        authService.removeAuthToken();
        router.navigate(['/client/login']);
        return false;
      }
    }),
    catchError(() => {
      authService.removeAuthToken();
      router.navigate(['/client/login']);
      return of(false);
    })
  );
};
