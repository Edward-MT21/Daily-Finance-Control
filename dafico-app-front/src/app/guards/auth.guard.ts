import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.currentUser()) {
    return true; 
  } else {
    // Si no hay usuario en la Signal, lo mandamos al login
    router.navigate(['/login']); 
    return false;
  }
};