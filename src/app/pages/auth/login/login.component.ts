import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  async onLogin() {
    try {
      // Llamada al servicio de autenticación
      const response: any = await this.authService
        .login({ email: this.email, password: this.password })
        .toPromise();

      if (response?.ok) {
        // Si es correcto, navega a la página principal
        this.navCtrl.navigateRoot('/calendario', { animated: true });
      } else {
        console.error('Error en login:', response?.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
    }
  }

  onForgotPassword() {
    // Aquí puedes navegar a una página de recuperación de contraseña o mostrar un modal
    this.navCtrl.navigateForward('/forgot-password');
  }
}
