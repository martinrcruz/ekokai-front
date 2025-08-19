// app.component.ts (extracto)
import { registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import localeEs from '@angular/common/locales/es';

interface AppPage {
  title: string;
  url?: string;   // si es un submenú principal sin URL, lo omites
  icon?: string;
  subpages?: AppPage[];
  expanded?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public showMenu = false;  // Controla si se muestra o no el menú
  public userRole: string = '';  // almacenar el rol

  // Definimos un conjunto completo de opciones
  private fullAppPages: AppPage[] = [
    { title: 'Dashboard', url: '/administrador/home',  icon: 'bi-speedometer2' },
    { title: 'Ecopuntos', url: '/administrador/ecopuntos',  icon: 'bi-geo-alt' },
    { title: 'Usuarios', url: '/administrador/usuarios-gestion',  icon: 'bi-people' },
    { title: 'Cupones', url: '/administrador/cupones', icon: 'bi-ticket' },
    { title: 'Marketplace', url: '/administrador/marketplace',  icon: 'bi-shop' },
    { title: 'Tipos de Residuo', url: '/administrador/tiposresiduos', icon: 'bi-recycle' },
    // { title: 'Configuración', url: '/administrador/configuracion',  icon: 'bi-gear' },
    { title: 'Reciclar', url: '/administrador/reciclar', icon: 'bi-recycle' }
  ];

  // Para el rol worker, solo dejamos Calendario
  private workerAppPages: AppPage[] = [
    { title: 'Calendario', url: '/worker-dashboard',  icon: 'bi-calendar-check' }
  ];

  // Menú para encargado (sin gestión de ecopuntos ni gestión de usuarios, mantiene crear vecino)
  private encargadoAppPages: AppPage[] = [
    { title: 'Dashboard', url: '/encargado/home', icon: 'bi-speedometer2' },
    { title: 'Marketplace', url: '/encargado/marketplace', icon: 'bi-shop' },
    { title: 'Tipos de Residuo', url: '/encargado/tiposresiduos', icon: 'bi-recycle' },
    { title: 'Crear Vecino', url: '/encargado/vecinos', icon: 'bi-person-plus' },
    { title: 'Reciclar', url: '/encargado/reciclar', icon: 'bi-recycle' }
  ];

  // Este es el array que se renderiza en la plantilla:
  public appPages: AppPage[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Ocultar menú si la ruta es /login (o /auth/login)
        if (event.url === '/login' || event.urlAfterRedirects === '/login' ||
            event.url === '/auth/login' || event.urlAfterRedirects === '/auth/login') {
          this.showMenu = false;
        } else {
          this.showMenu = true;
        }
      });

    registerLocaleData(localeEs, 'es');

    // Suscribirse a un observable del AuthService que retorne la info del usuario
    this.authService.user$.subscribe(async user => {
      if (!user) {
        await this.authService.ensureUserFromToken();
      }
      const refreshedUser = this.authService.getUser();
      if (refreshedUser && refreshedUser.rol) {
        this.userRole = refreshedUser.rol;
        // Redirigir según el rol
        if (this.userRole === 'worker') {
          if (!this.router.url.includes('worker-dashboard')) {
            this.router.navigate(['/worker-dashboard']);
          }
        } else if (this.userRole === 'encargado') {
          if (!this.router.url.startsWith('/encargado')) {
            this.router.navigate(['/encargado/home']);
          }
        } else if (this.userRole === 'admin' || this.userRole === 'administrador') {
          if (!this.router.url.startsWith('/administrador')) {
            this.router.navigate(['/administrador/home']);
          }
        }
      } else {
        this.userRole = '';
      }
      this.updateMenuByRole();
    });

    // Verificar el rol al iniciar la aplicación
    this.checkInitialRole();
  }

  /**
   * Verifica el rol al iniciar la aplicación y redirige si es necesario
   */
  private async checkInitialRole() {
    await this.authService.ensureUserFromToken();
    const user = this.authService.getUser();
    if (!user) return;
    if (user.rol === 'worker') {
      if (!this.router.url.includes('worker-dashboard')) {
        this.router.navigate(['/worker-dashboard']);
      }
    } else if (user.rol === 'encargado') {
      if (!this.router.url.startsWith('/encargado')) {
        this.router.navigate(['/encargado/home']);
      }
    } else if (user.rol === 'admin' || user.rol === 'administrador') {
      if (!this.router.url.startsWith('/administrador')) {
        this.router.navigate(['/administrador/home']);
      }
    }
  }

  /**
   * Ajusta el menú según el rol:
   */
  updateMenuByRole() {
    if (this.userRole === 'worker') {
      this.appPages = this.workerAppPages;
      return;
    }
    if (this.userRole === 'encargado') {
      this.appPages = this.encargadoAppPages;
      return;
    }
    // Admin o cualquiera => menú completo
    this.appPages = this.fullAppPages;
  }

  

  /**
   * Toggle para expandir/colapsar submenús
   */
  toggleSubMenu(page: AppPage) {
    if (page.subpages) {
      page.expanded = !page.expanded;
    }
  }

  /**
   * Logout
   */
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
