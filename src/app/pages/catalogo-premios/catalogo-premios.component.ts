import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { PremioService, Premio } from 'src/app/services/premio.service';
import { CATALOGO_CONFIG } from './catalogo.config';

@Component({
  selector: 'app-catalogo-premios',
  templateUrl: './catalogo-premios.component.html',
  standalone: false,
  styleUrls: ['./catalogo-premios.component.scss']
})
export class CatalogoPremiosComponent implements OnInit {
  premios: Premio[] = [];
  premiosFiltrados: Premio[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = '';
  terminoBusqueda: string = '';
  premiosDestacados: Premio[] = [];
  
  // Configuración del catálogo
  config = CATALOGO_CONFIG;
  
  // Estados de carga
  cargando: boolean = true;
  cargandoBusqueda: boolean = false;

  constructor(
    private premioService: PremioService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando catálogo...'
    });
    await loading.present();

    try {
      // Cargar premios destacados
      const destacadosResponse = await this.premioService.getPremiosDestacados().toPromise();
      if (destacadosResponse?.ok) {
        this.premiosDestacados = destacadosResponse.premios;
      }

      // Cargar todos los premios activos
      const premiosResponse = await this.premioService.getPremiosActivos().toPromise();
      if (premiosResponse?.ok) {
        this.premios = premiosResponse.premios;
        this.premiosFiltrados = [...this.premios];
        
        // Extraer categorías únicas
        this.categorias = [...new Set(this.premios.map(p => p.categoria))];
      }
    } catch (error) {
      console.error('Error al cargar premios:', error);
      await this.mostrarError('Error al cargar el catálogo');
    } finally {
      this.cargando = false;
      await loading.dismiss();
    }
  }



  async buscarPremios() {
    if (!this.terminoBusqueda.trim()) {
      this.premiosFiltrados = [...this.premios];
      return;
    }

    this.cargandoBusqueda = true;
    try {
      const response = await this.premioService.buscarPremios(this.terminoBusqueda).toPromise();
      if (response?.ok) {
        this.premiosFiltrados = response.premios;
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      await this.mostrarError('Error al buscar premios');
    } finally {
      this.cargandoBusqueda = false;
    }
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    if (categoria === '') {
      this.premiosFiltrados = [...this.premios];
    } else {
      this.premiosFiltrados = this.premios.filter(p => p.categoria === categoria);
    }
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = '';
    this.terminoBusqueda = '';
    this.premiosFiltrados = [...this.premios];
  }

  async canjearPremio(premio: Premio) {
    if (premio.stock <= 0) {
      await this.mostrarError('Este premio no tiene stock disponible');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Canjear por WhatsApp',
      message: `¿Deseas canjear "${premio.nombre}" por WhatsApp?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Abrir WhatsApp',
          handler: () => {
            this.abrirWhatsApp(premio);
          }
        }
      ]
    });

    await alert.present();
  }

  abrirWhatsApp(premio: Premio) {
    // Número de WhatsApp del chatbot desde environment
    const numeroWhatsApp = environment.whatsappNumber;
    
    // Generar código único para el premio (puedes usar el ID o crear uno)
    const codigoPremio = premio._id ? premio._id.substring(premio._id.length - 8) : 'PREMIO' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Mensaje predefinido para WhatsApp
    const mensaje = encodeURIComponent(`¡Hola! Quiero canjear el premio "${premio.nombre}" (Código: ${codigoPremio}) por ${premio.cuponesRequeridos} cupones.`);
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    
    // Abrir WhatsApp en nueva ventana/pestaña
    window.open(urlWhatsApp, '_blank');
    
    // Mostrar mensaje de confirmación
    this.mostrarExito(`WhatsApp abierto para canjear "${premio.nombre}"`);
  }



  async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  getImagenPremio(premio: Premio): string {
    if (premio.imagen) {
      return premio.imagen;
    }
    // Imagen por defecto
    return 'assets/icon/favicon.png';
  }

  getColorCategoria(categoria: string): string {
    return this.config.filters.categoryColors[categoria] || 'medium';
  }

  scrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollToTop(500);
    }
  }

  irAInicio() {
    // Solo permitir ir al inicio si el usuario está logueado
    // Si no está logueado, redirigir al login
    this.router.navigate(['/auth/login']);
  }
}
