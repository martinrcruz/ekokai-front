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

      if (response?.token && response?.usuario) {
        await this.authService.setToken(response.token);
        // Forzar actualización del observable de usuario
        (this.authService as any).userSubject.next(response.usuario);
        console.log('✅ Login exitoso. Navegando según rol...');
        const role = response?.usuario?.rol || response?.role;

        if (role === 'admin' || role === 'administrador') {
          console.log('👑 Redirigiendo administrador a /home');
          this.navCtrl.navigateRoot('/home', { animated: true });
        } else if (role === 'encargado') {
          console.log('👨‍💼 Redirigiendo encargado a /encargado-home');
          this.navCtrl.navigateRoot('/encargado-home', { animated: true });
        } else if (role === 'vecino') {
          console.log('🏠 Redirigiendo vecino a /home');
          this.navCtrl.navigateRoot('/home', { animated: true });
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
