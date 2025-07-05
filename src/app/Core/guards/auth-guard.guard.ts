import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth/auth-service.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const _service = inject(AuthServiceService);
  const router = inject(Router);

  if (!_service.getAuthToken) {
    router.navigate(['/home']);
    return false;
  }

  const requiredRole = route.data['role'];
  const userRole = _service.getRole();

  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
