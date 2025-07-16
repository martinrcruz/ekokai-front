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
    return from(this.authService.ensureUserFromToken()).pipe(
      switchMap(() => this.authService.isLoggedIn()),
      map((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}
