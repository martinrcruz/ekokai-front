import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    await this.authService.ensureUserFromToken();
    const user = this.authService.getUser();
    const role = user?.rol;
    console.log('[AdminGuard] Rol detectado:', role);
    if (role === 'admin' || role === 'administrador' || role === 'encargado') {
      console.log('[AdminGuard] Acceso permitido');
      return true;
    }
    console.warn('[AdminGuard] Acceso denegado, redirigiendo a login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
