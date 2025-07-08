import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const _service = inject(AuthServiceService);
  const token = _service.getAuthToken();
  const router = inject(Router);

  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    })
  }

  return next(req).pipe(
    catchError(err => {
      router.navigate(['/home']);
      /* _service.removeAuthToken(); */
      return throwError(() => err);
    })
  );
};
