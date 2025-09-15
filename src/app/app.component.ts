// app.component.ts (extracto)
import { registerLocaleData } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import localeEs from '@angular/common/locales/es';
import { MenuController, Platform } from '@ionic/angular';

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
export class AppComponent implements OnInit, OnDestroy {

  public showMenu = false;  // Controla si se muestra o no el menú
  public userRole: string = '';  // almacenar el rol
  public sidebarOpen = false;  // Controla si el sidebar está abierto (solo para desktop)
  public isMobile = false;  // Detecta si estamos en móvil
  public isInitializing = true;  // Controla el estado de carga inicial

  // Definimos un conjunto completo de opciones
  private fullAppPages: AppPage[] = [
    { title: 'Dashboard', url: '/administrador/home',  icon: 'bi-speedometer2' },
    { title: 'Ecopuntos', url: '/administrador/ecopuntos',  icon: 'bi-geo-alt' },
    { 
      title: 'Usuarios', 
      icon: 'bi-people',
      subpages: [
        { title: 'Gestión General', url: '/administrador/usuarios-gestion', icon: 'bi-people' },
        { title: 'Vecinos', url: '/administrador/usuarios-vecinos', icon: 'bi-person' },
        { title: 'Staff', url: '/administrador/usuarios-staff', icon: 'bi-person-badge' }
      ]
    },
    { title: 'Premios', url: '/administrador/premios', icon: 'bi-gift' },
    { title: 'Historial de Reciclaje', url: '/administrador/historial-reciclaje', icon: 'bi-clock-history' },
    // { title: 'Marketplace', url: '/administrador/marketplace',  icon: 'bi-shop' },
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
    // { title: 'Marketplace', url: '/encargado/marketplace', icon: 'bi-shop' },
    { title: 'Tipos de Residuo', url: '/encargado/tiposresiduos', icon: 'bi-recycle' },
    { title: 'Crear Vecino', url: '/encargado/vecinos', icon: 'bi-person-plus' },
    { title: 'Reciclar', url: '/encargado/reciclar', icon: 'bi-recycle' }
  ];

  // Este es el array que se renderiza en la plantilla:
  public appPages: AppPage[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private menuController: MenuController,
    private platform: Platform
  ) {
    // Detectar si estamos en móvil y configurar el sidebar inicial
    this.detectMobileAndConfigure();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.detectMobileAndConfigure();
    });
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentUrl = event.url || event.urlAfterRedirects;
        console.log('[AppComponent] NavigationEnd - URL:', currentUrl);
        
        // Ocultar menú si la ruta es /login (o /auth/login) o /catalogo
        if (currentUrl === '/login' || currentUrl === '/auth/login' ||
            currentUrl === '/catalogo' || currentUrl.startsWith('/catalogo/')) {
          console.log('[AppComponent] Ocultando menú para URL:', currentUrl);
          this.showMenu = false;
          this.closeSidebar();
        } else {
          console.log('[AppComponent] Mostrando menú para URL:', currentUrl);
          this.showMenu = true;
          // Restaurar estado del sidebar según el dispositivo (solo para desktop)
          if (!this.isMobile) {
            this.sidebarOpen = true;
          }
        }
      });

    registerLocaleData(localeEs, 'es');

    // Suscribirse al estado de inicialización del AuthService
    this.authService.isInitialized$.subscribe(isInitialized => {
      if (isInitialized) {
        console.log('[AppComponent] AuthService inicializado');
        this.isInitializing = false;
      }
    });

    // Suscribirse a un observable del AuthService que retorne la info del usuario
    this.authService.user$.subscribe(async user => {
      // Verificar la URL actual antes de procesar cualquier lógica
      const currentUrl = this.router.url;
      
      // Si estamos en el catálogo, NO procesar redirecciones
      if (currentUrl.startsWith('/catalogo')) {
        console.log('[AppComponent] En catálogo, saltando lógica de redirección');
        if (user && user.rol) {
          this.userRole = user.rol;
          this.updateMenuByRole();
        }
        return;
      }
      
      if (!user) {
        await this.authService.ensureUserFromToken();
      }
      const refreshedUser = this.authService.getUser();
      if (refreshedUser && refreshedUser.rol) {
        this.userRole = refreshedUser.rol;
        console.log('[AppComponent] Usuario logueado con rol:', this.userRole, 'en ruta:', currentUrl);
        
        // Redirigir según el rol, pero solo si se permite
        if (this.shouldAllowRedirect(currentUrl)) {
          console.log('[AppComponent] Redirección permitida, verificando...');
          if (this.userRole === 'worker') {
            if (!currentUrl.includes('worker-dashboard')) {
              console.log('[AppComponent] Redirigiendo worker a dashboard');
              this.router.navigate(['/worker-dashboard']);
            }
          } else if (this.userRole === 'encargado') {
            if (!currentUrl.startsWith('/encargado')) {
              console.log('[AppComponent] Redirigiendo encargado a home');
              this.router.navigate(['/encargado/home']);
            }
          } else if (this.userRole === 'admin' || this.userRole === 'administrador') {
            // Solo redirigir si no está en ninguna ruta válida para admin
            if (!currentUrl.includes('worker-dashboard') && !currentUrl.startsWith('/encargado') && !currentUrl.startsWith('/administrador')) {
              console.log('[AppComponent] Redirigiendo admin a home');
              this.router.navigate(['/administrador/home']);
            }
          }
        } else {
          console.log('[AppComponent] Redirección no permitida para esta URL');
        }
      } else {
        this.userRole = '';
        console.log('[AppComponent] Usuario no logueado');
      }
      this.updateMenuByRole();
    });

    // Verificar el rol al iniciar la aplicación, pero solo si no estamos en el catálogo
    const initialUrl = this.router.url;
    if (!initialUrl.startsWith('/catalogo')) {
      this.checkInitialRole();
    } else {
      console.log('[AppComponent] Constructor - En catálogo, saltando checkInitialRole');
      // Asegurar que el menú esté oculto en el catálogo
      this.showMenu = false;
      this.closeSidebar();
    }
  }

  /**
   * Detecta si estamos en mobile y configura el comportamiento inicial
   */
  private detectMobileAndConfigure() {
    const widthIsMobile = window.matchMedia('(max-width: 768px)').matches;
    const wasMobile = this.isMobile;
    this.isMobile = this.platform.is('ios') || this.platform.is('android') || this.platform.is('mobileweb') || widthIsMobile;
  
    if (wasMobile && !this.isMobile) {
      // Cambió de mobile a desktop
      console.log('[AppComponent] Cambio de mobile a desktop');
      this.sidebarOpen = true;
      this.closeSidebar(); // Cerrar menú nativo si estaba abierto
    } else if (!wasMobile && this.isMobile) {
      // Cambió de desktop a mobile
      console.log('[AppComponent] Cambio de desktop a mobile');
      this.sidebarOpen = false;
      this.closeSidebar(); // Cerrar sidebar personalizado
    }
  }

  /**
   * Verifica si se debe permitir la redirección basada en la URL actual
   */
  private shouldAllowRedirect(url: string): boolean {
    // NO permitir redirección si está en el catálogo
    if (url.startsWith('/catalogo')) {
      console.log('[AppComponent] shouldAllowRedirect - En catálogo, NO se permite redirección');
      return false;
    }
    
    // NO permitir redirección si está en auth
    if (url.startsWith('/auth')) {
      console.log('[AppComponent] shouldAllowRedirect - En auth, NO se permite redirección');
      return false;
    }
    
    // NO permitir redirección si está en worker-dashboard
    if (url.includes('worker-dashboard')) {
      console.log('[AppComponent] shouldAllowRedirect - En worker-dashboard, NO se permite redirección');
      return false;
    }
    
    // NO permitir redirección si está en encargado
    if (url.startsWith('/encargado')) {
      console.log('[AppComponent] shouldAllowRedirect - En encargado, NO se permite redirección');
      return false;
    }
    
    // NO permitir redirección si está en administrador
    if (url.startsWith('/administrador')) {
      console.log('[AppComponent] shouldAllowRedirect - En administrador, NO se permite redirección');
      return false;
    }
    
    console.log('[AppComponent] shouldAllowRedirect - Redirección permitida para URL:', url);
    return true;
  }

  /**
   * Verifica el rol al iniciar la aplicación y redirige si es necesario
   */
  private async checkInitialRole() {
    try {
      // Verificar la URL actual antes de procesar cualquier lógica
      const currentUrl = this.router.url;
      
      // Si estamos en el catálogo, NO procesar redirecciones
      if (currentUrl.startsWith('/catalogo')) {
        console.log('[AppComponent] checkInitialRole - En catálogo, saltando lógica de redirección');
        return;
      }
      
      await this.authService.ensureUserFromToken();
      const user = this.authService.getUser();
      
      if (!user) {
        console.log('[AppComponent] checkInitialRole - No hay usuario');
        return;
      }
      
      console.log('[AppComponent] checkInitialRole - Usuario:', user.rol, 'en ruta:', currentUrl);
      
      // NO redirigir si no se debe permitir
      if (!this.shouldAllowRedirect(currentUrl)) {
        console.log('[AppComponent] checkInitialRole - Redirección no permitida para esta URL');
        return;
      }
      
      console.log('[AppComponent] checkInitialRole - Verificando redirección...');
      
      if (user.rol === 'worker') {
        if (!currentUrl.includes('worker-dashboard')) {
          console.log('[AppComponent] checkInitialRole - Redirigiendo worker a dashboard');
          this.router.navigate(['/worker-dashboard']);
        }
      } else if (user.rol === 'encargado') {
        if (!currentUrl.startsWith('/encargado')) {
          console.log('[AppComponent] checkInitialRole - Redirigiendo encargado a home');
          this.router.navigate(['/encargado/home']);
        }
      } else if (user.rol === 'admin' || user.rol === 'administrador') {
        // Solo redirigir si no está en ninguna ruta válida para admin
        if (!currentUrl.includes('worker-dashboard') && !currentUrl.startsWith('/encargado') && !currentUrl.startsWith('/administrador')) {
          console.log('[AppComponent] checkInitialRole - Redirigiendo admin a home');
          this.router.navigate(['/administrador/home']);
        }
      }
    } catch (error) {
      console.error('[AppComponent] checkInitialRole - Error:', error);
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
   * Controla la apertura/cierre del sidebar (solo para desktop)
   */
  toggleSidebar() {
    if (this.isMobile) {
      console.log('[AppComponent] toggleSidebar llamado en mobile, usando menú nativo');
      return;
    }
    
    if (this.sidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  /**
   * Abre el sidebar (solo para desktop)
   */
  async openSidebar() {
    if (this.isMobile) {
      console.log('[AppComponent] openSidebar llamado en mobile, usando menú nativo');
      return;
    }
    
    this.sidebarOpen = true;
    await this.menuController.open('mainMenu');
  }

  /**
   * Cierra el sidebar (solo para desktop)
   */
  async closeSidebar() {
    if (this.isMobile) {
      console.log('[AppComponent] closeSidebar llamado en mobile, cerrando menú nativo');
      await this.menuController.close('mobileMenu');
      return;
    }
    
    this.sidebarOpen = false;
    await this.menuController.close('mainMenu');
  }

  /**
   * Cierra el sidebar en móvil después de navegar
   */
  closeSidebarOnMobile() {
    if (this.isMobile) {
      console.log('[AppComponent] Cerrando sidebar en mobile después de navegación');
      this.menuController.close('mobileMenu');
    }
  }

  /**
   * Evento antes de abrir el menú (solo para desktop)
   */
  onMenuWillOpen() {
    if (!this.isMobile) {
      this.sidebarOpen = true;
    }
  }

  /**
   * Evento antes de cerrar el menú (solo para desktop)
   */
  onMenuWillClose() {
    if (!this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  /**
   * Logout
   */
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {
    // Inicializar el servicio de tema
    this.themeService.listenToSystemThemeChanges();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }
}
