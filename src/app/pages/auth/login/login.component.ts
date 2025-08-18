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
    console.log('🔐 Iniciando login con:', this.email);

    try {
      const response: any = await this.authService
        .login({ email: this.email, password: this.password })
        .toPromise();

      console.log('📥 Respuesta del backend:', response);

      // El backend devuelve {token, usuario} directamente, no {ok, data}
      if (response?.token && response?.usuario) {
        console.log('✅ Login exitoso. Token recibido.');

        // Establecer el token manualmente
        await this.authService.setToken(response.token);

        console.log('✅ Login exitoso. Navegando según rol...');
        const user = this.authService.getUser();
        const role = user?.rol || response?.usuario?.rol;

        if (role === 'admin' || role === 'administrador') {
          console.log('👑 Redirigiendo administrador a /administrador/home');
          this.navCtrl.navigateRoot('/administrador/home', { animated: true });
        } else if (role === 'encargado') {
          console.log('👨‍💼 Redirigiendo encargado a /encargado/home');
          this.navCtrl.navigateRoot('/encargado/home', { animated: true });
        } else if (role === 'vecino') {
          console.log('🏠 Redirigiendo vecino a /administrador/home');
          this.navCtrl.navigateRoot('/administrador/home', { animated: true });
        } else {
          console.warn('⚠️ Rol no reconocido:', role, '. Redirigiendo a /home');
          this.navCtrl.navigateRoot('/home', { animated: true });
        }

      } else {
        console.error('❌ Login fallido: respuesta incompleta', response);
      }
    } catch (error: any) {
      const mensaje = error?.error?.error || 'Error desconocido en login';
      console.error('❌ Error en login (catch):', mensaje);
    }
  }

  onForgotPassword() {
    console.log('🧠 Navegando a recuperación de contraseña...');
    this.navCtrl.navigateForward('/forgot-password');
  }
}
