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
    const user = await this.auth.getUser(); // p.ej. un método que retorne la info
    if (user && user.role === 'worker') {
      return true;  // worker => OK
    }
    // si no es worker => fallback
    this.router.navigate(['/auth/login']);
    return false;
  }
}
