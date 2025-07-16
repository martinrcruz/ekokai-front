// role.guard.ts (extracto)
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.auth.ensureUserFromToken();
    const user = this.auth.getUser();
    const role = user?.rol;
    
    if (user && (role === 'worker' || role === 'encargado')) {
      return true;  // worker o encargado => OK
    }
    // si no es worker ni encargado => fallback
    this.router.navigate(['/auth/login']);
    return false;
  }
}
