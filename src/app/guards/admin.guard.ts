import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    const role = await this.authService.getRole();
    if (role === 'admin') {
      return true;
    }
    // Si no es admin, redirigir a login
    this.router.navigate(['/auth/login']);
    return false;
  }
}
