import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token');
  if(!token){
   
    return true;
  }
  router.navigate(['/dashboard']);
  return false

};
 