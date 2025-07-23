// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    console.log('[AuthGuard] canActivate - Checking authentication...');
    
    // Verificar si ya estamos logueados antes de llamar ensureUserFromToken
    const currentLoggedIn = this.authService.isLoggedInSync();
    console.log('[AuthGuard] canActivate - Current logged in state:', currentLoggedIn);
    
    if (currentLoggedIn) {
      console.log('[AuthGuard] canActivate - Already logged in, allowing access');
      return true;
    }
    
    // Verificar si ya hay un usuario en el subject
    const currentUser = this.authService.getUser();
    if (currentUser) {
      console.log('[AuthGuard] canActivate - User already exists in subject, allowing access');
      return true;
    }
    
    return from(this.authService.ensureUserFromToken()).pipe(
      map(() => {
        const loggedIn = this.authService.isLoggedInSync();
        console.log('[AuthGuard] canActivate - After ensureUserFromToken, loggedIn:', loggedIn);
        
        if (!loggedIn) {
          console.log('[AuthGuard] canActivate - Not logged in, redirecting to login');
          this.router.navigate(['/auth/login']);
          return false;
        }
        
        console.log('[AuthGuard] canActivate - User is logged in, allowing access');
        return true;
      })
    );
  }
}
