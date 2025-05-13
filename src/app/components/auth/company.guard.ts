import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const companyGuard: CanActivateFn = (route, state) => {

  const token = sessionStorage.getItem('idCompany');
  let router = inject(Router);

  if (state.url === '/company/register' || state.url === '/company/login') {
    return true;
  }

  if (typeof token === 'string') {
    return true;
  } else {
    router.navigate(['/a']);
    return false;
  }
};
