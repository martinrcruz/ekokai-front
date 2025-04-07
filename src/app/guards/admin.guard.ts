import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  async canActivate() {
    console.log("entra 1")
    const role = await this.authService.getRole(); 
    console.log("entra 2")
    if (role === 'admin') {
      console.log('admin');
      return true;
    }
    // si worker => false => redir
    this.router.navigate(['/calendario']); 
    return false;
  }
}
