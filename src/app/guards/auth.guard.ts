// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  canActivate() {
    return this.authService.isLoggedIn()
      .pipe(
        map((loggedIn: boolean) => {
          if (!loggedIn) {
            this.navCtrl.navigateRoot('/login');
            return false;
          }
          return true;
        })
      );
  }
}
