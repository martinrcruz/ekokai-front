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
  public userRole: 'admin' | 'worker' | '' = '';  // almacenar el rol

  // Definimos un conjunto completo de opciones
  private fullAppPages: AppPage[] = [
    { title: 'Calendario', url: '/calendario',  icon: 'bi-calendar-check' },
    { title: 'Partes',     url: '/partes',      icon: 'bi-file-text' },
    { title: 'Contratos',  url: '/clientes',    icon: 'bi-people-fill' },
    { title: 'Facturación',url: '/facturacion', icon: 'bi-cash-stack' },
    {
      title: 'Administración',
      icon: 'bi-briefcase',
      expanded: false,
      subpages: [
        { title: 'Vehículos',    url: '/vehiculos',    icon: 'bi-truck' },
        { title: 'Herramientas', url: '/herramientas', icon: 'bi-tools' },
        { title: 'Zonas',        url: '/zonas',        icon: 'bi-geo-alt' },
        { title: 'Rutas',        url: '/rutas',        icon: 'bi-map' },
        { title: 'Usuarios',     url: '/usuarios',     icon: 'bi-people' },
      ]
    }
  ];

  // Para el rol worker, solo dejamos Calendario
  private workerAppPages: AppPage[] = [
    { title: 'Calendario', url: '/calendario',  icon: 'bi-calendar-check' }
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
    this.authService.user$.subscribe(user => {
      if (user && user.role) {
        this.userRole = user.role;
      } else {
        this.userRole = '';
      }
      this.updateMenuByRole();
    });
  }

  /**
   * Ajusta el menú según el rol:
   */
  updateMenuByRole() {
    if (this.userRole === 'worker') {
      this.appPages = this.workerAppPages;
    } else {
      // Admin o cualquiera => menú completo
      this.appPages = this.fullAppPages;
    }
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
    this.router.navigate(['/login']);
  }
}
