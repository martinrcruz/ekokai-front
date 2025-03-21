import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

interface AppPage {
  title: string;
  url?: string;          // opcional si es un submenú principal sin URL
  icon?: string;
  subpages?: AppPage[];  // submenús
  expanded?: boolean;    // para el toggle de submenú
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public showMenu = true;  // Controla si se muestra o no el menú

  // Definimos el menú con posible submenú
  public appPages: AppPage[] = [
    // { title: 'Home',       url: '/home',        icon: 'bi-house' },
    { title: 'Calendario', url: '/calendario',  icon: 'bi-calendar-check' },
    { title: 'Usuarios',   url: '/usuarios',    icon: 'bi-people' },
    { title: 'Partes',     url: '/partes',      icon: 'bi-file-text' },
    { title: 'Facturación',url: '/facturacion', icon: 'bi-cash-stack' },
    // Sección con submenú
    {
      title: 'Administración',
      icon: 'bi-briefcase',
      expanded: false,
      subpages: [
        { title: 'Vehículos',    url: '/vehiculos',    icon: 'bi-truck' },
        { title: 'Herramientas', url: '/herramientas', icon: 'bi-tools' },
        { title: 'Zonas',        url: '/zonas',        icon: 'bi-geo-alt' },
        { title: 'Rutas',        url: '/rutas',        icon: 'bi-map' },
      ]
    }
  ];

  constructor(private router: Router, private authService: AuthService) {
    // Suscribirse a eventos de navegación
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

  }

  /**
   * Toggle para expandir/colapsar submenús.
   */
  toggleSubMenu(page: AppPage) {
    // Solo si tiene subpages, alternamos expanded
    if (page.subpages) {
      page.expanded = !page.expanded;
    }
  }


  /**
   * Método para cerrar sesión
   */
  async logout() {
    try {
      // Llamar al servicio de logout
      await this.authService.logout(); 
      // Navegar a login
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  }
}
