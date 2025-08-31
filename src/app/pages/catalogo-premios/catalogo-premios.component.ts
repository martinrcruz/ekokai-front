import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { PremioService, Premio } from 'src/app/services/premio.service';
import { CATALOGO_CONFIG } from './catalogo.config';
import { PremioDetalleModalComponent } from './premio-detalle-modal/premio-detalle-modal.component';

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
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
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

  async mostrarDetallePremio(premio: Premio) {
    const modal = await this.modalCtrl.create({
      component: PremioDetalleModalComponent,
      componentProps: {
        premio: premio
      },
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.canjear) {
      await this.canjearPremio(premio);
    }
  }

  async canjearPremio(premio: Premio) {
    if (premio.stock <= 0) {
      await this.mostrarError('Este premio no tiene stock disponible');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Canjear Premio',
      message: `¿Deseas canjear "${premio.nombre}" por 1 cupón?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Canjear por WhatsApp',
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
    
    // Generar código único para el premio
    const codigoPremio = premio._id ? premio._id.substring(premio._id.length - 8) : 'PREMIO' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Mensaje predefinido para WhatsApp - ahora siempre 1 cupón
    const mensaje = encodeURIComponent(`¡Hola! Estaba viendo el catalogo de EKOKAI y quiero canjear el premio "${premio.nombre}" (Código: ${codigoPremio}) por 1 cupón.`);
    
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
    // Si el premio ya tiene una imagen personalizada, usarla
    if (premio.imagen) {
      return premio.imagen;
    }

    // Mapeo inteligente de imágenes basado en el nombre del premio
    const nombreLower = premio.nombre.toLowerCase();
    const categoriaLower = premio.categoria.toLowerCase();

    // Mapeo por nombre específico del premio
    if (nombreLower.includes('audífono') || nombreLower.includes('audifono') || nombreLower.includes('headphone') || nombreLower.includes('auricular')) {
      return 'assets/premios/audifonos.svg';
    }
    if (nombreLower.includes('celular') || nombreLower.includes('teléfono') || nombreLower.includes('telefono') || nombreLower.includes('smartphone') || nombreLower.includes('iphone')) {
      return 'assets/premios/celular.svg';
    }
    if (nombreLower.includes('laptop') || nombreLower.includes('notebook') || nombreLower.includes('computadora') || nombreLower.includes('portátil')) {
      return 'assets/premios/laptop.svg';
    }
    if (nombreLower.includes('tablet') || nombreLower.includes('ipad')) {
      return 'assets/premios/tablet.svg';
    }
    if (nombreLower.includes('café') || nombreLower.includes('cafe') || nombreLower.includes('coffee')) {
      return 'assets/premios/cafe.svg';
    }
    if (nombreLower.includes('libro') || nombreLower.includes('book')) {
      return 'assets/premios/libro.svg';
    }
    if (nombreLower.includes('pelota') || nombreLower.includes('ball') || nombreLower.includes('fútbol') || nombreLower.includes('futbol')) {
      return 'assets/premios/pelota.svg';
    }
    if (nombreLower.includes('remera') || nombreLower.includes('camiseta') || nombreLower.includes('shirt') || nombreLower.includes('tshirt')) {
      return 'assets/premios/remera.svg';
    }
    if (nombreLower.includes('gorra') || nombreLower.includes('cap') || nombreLower.includes('sombrero')) {
      return 'assets/premios/gorra.svg';
    }
    if (nombreLower.includes('mochila') || nombreLower.includes('backpack') || nombreLower.includes('bolso')) {
      return 'assets/premios/mochila.svg';
    }
    if (nombreLower.includes('taza') || nombreLower.includes('mug') || nombreLower.includes('vaso')) {
      return 'assets/premios/taza.svg';
    }
    if (nombreLower.includes('planta') || nombreLower.includes('maceta') || nombreLower.includes('flower') || nombreLower.includes('jardín')) {
      return 'assets/premios/planta.svg';
    }
    if (nombreLower.includes('juego') || nombreLower.includes('juguete') || nombreLower.includes('toy') || nombreLower.includes('game')) {
      return 'assets/premios/juego.svg';
    }
    if (nombreLower.includes('música') || nombreLower.includes('musica') || nombreLower.includes('music') || nombreLower.includes('instrumento')) {
      return 'assets/premios/musica.svg';
    }
    if (nombreLower.includes('arte') || nombreLower.includes('pintura') || nombreLower.includes('dibujo') || nombreLower.includes('manualidad')) {
      return 'assets/premios/arte.svg';
    }
    if (nombreLower.includes('mascota') || nombreLower.includes('perro') || nombreLower.includes('gato') || nombreLower.includes('pet')) {
      return 'assets/premios/mascota.svg';
    }
    if (nombreLower.includes('herramienta') || nombreLower.includes('martillo') || nombreLower.includes('destornillador') || nombreLower.includes('tool')) {
      return 'assets/premios/herramienta.svg';
    }
    if (nombreLower.includes('belleza') || nombreLower.includes('cosmético') || nombreLower.includes('cosmetico') || nombreLower.includes('crema')) {
      return 'assets/premios/belleza.svg';
    }
    if (nombreLower.includes('deporte') || nombreLower.includes('gimnasio') || nombreLower.includes('fitness') || nombreLower.includes('ejercicio')) {
      return 'assets/premios/deporte.svg';
    }
    if (nombreLower.includes('hogar') || nombreLower.includes('casa') || nombreLower.includes('doméstico') || nombreLower.includes('domestico')) {
      return 'assets/premios/hogar.svg';
    }
    if (nombreLower.includes('auto') || nombreLower.includes('carro') || nombreLower.includes('vehículo') || nombreLower.includes('vehiculo')) {
      return 'assets/premios/auto.svg';
    }

    // Mapeo por categoría si no se encontró por nombre
    if (categoriaLower.includes('electrónic') || categoriaLower.includes('tech') || categoriaLower.includes('digital')) {
      return 'assets/premios/electronico.svg';
    }
    if (categoriaLower.includes('hogar') || categoriaLower.includes('casa') || categoriaLower.includes('doméstic')) {
      return 'assets/premios/hogar.svg';
    }
    if (categoriaLower.includes('deporte') || categoriaLower.includes('fitness') || categoriaLower.includes('ejercicio')) {
      return 'assets/premios/deporte.svg';
    }
    if (categoriaLower.includes('ropa') || categoriaLower.includes('vestimenta') || categoriaLower.includes('accesorio')) {
      return 'assets/premios/ropa.svg';
    }
    if (categoriaLower.includes('libro') || categoriaLower.includes('lectura') || categoriaLower.includes('educación')) {
      return 'assets/premios/libro.svg';
    }
    if (categoriaLower.includes('comida') || categoriaLower.includes('alimento') || categoriaLower.includes('bebida')) {
      return 'assets/premios/comida.svg';
    }
    if (categoriaLower.includes('belleza') || categoriaLower.includes('cosmético') || categoriaLower.includes('cuidado')) {
      return 'assets/premios/belleza.svg';
    }
    if (categoriaLower.includes('juego') || categoriaLower.includes('juguete') || categoriaLower.includes('entretenimiento')) {
      return 'assets/premios/juego.svg';
    }
    if (categoriaLower.includes('jardín') || categoriaLower.includes('planta') || categoriaLower.includes('naturaleza')) {
      return 'assets/premios/planta.svg';
    }
    if (categoriaLower.includes('música') || categoriaLower.includes('instrumento') || categoriaLower.includes('audio')) {
      return 'assets/premios/musica.svg';
    }
    if (categoriaLower.includes('arte') || categoriaLower.includes('manualidad') || categoriaLower.includes('creatividad')) {
      return 'assets/premios/arte.svg';
    }
    if (categoriaLower.includes('mascota') || categoriaLower.includes('animal') || categoriaLower.includes('veterinaria')) {
      return 'assets/premios/mascota.svg';
    }
    if (categoriaLower.includes('auto') || categoriaLower.includes('vehículo') || categoriaLower.includes('transporte')) {
      return 'assets/premios/auto.svg';
    }
    if (categoriaLower.includes('herramienta') || categoriaLower.includes('construcción') || categoriaLower.includes('bricolaje')) {
      return 'assets/premios/herramienta.svg';
    }

    // Imagen por defecto si no se encontró coincidencia
    return 'assets/icon/favicon.png';
  }

  getColorCategoria(categoria: string): string {
    // Buscar el color en la configuración
    const color = this.config.filters.categoryColors[categoria];
    if (color) {
      return color;
    }
    
    // Si no hay color específico, intentar hacer match parcial
    const categoriaLower = categoria.toLowerCase();
    if (categoriaLower.includes('electrónic') || categoriaLower.includes('tech') || categoriaLower.includes('digital')) {
      return 'primary';
    } else if (categoriaLower.includes('hogar') || categoriaLower.includes('casa') || categoriaLower.includes('doméstic')) {
      return 'secondary';
    } else if (categoriaLower.includes('deporte') || categoriaLower.includes('fitness') || categoriaLower.includes('ejercicio')) {
      return 'success';
    } else if (categoriaLower.includes('ropa') || categoriaLower.includes('vestimenta') || categoriaLower.includes('accesorio')) {
      return 'warning';
    } else if (categoriaLower.includes('libro') || categoriaLower.includes('lectura') || categoriaLower.includes('educación')) {
      return 'info';
    } else if (categoriaLower.includes('comida') || categoriaLower.includes('alimento') || categoriaLower.includes('bebida')) {
      return 'danger';
    } else if (categoriaLower.includes('belleza') || categoriaLower.includes('cosmético') || categoriaLower.includes('cuidado')) {
      return 'tertiary';
    } else if (categoriaLower.includes('juego') || categoriaLower.includes('juguete') || categoriaLower.includes('entretenimiento')) {
      return 'success';
    } else if (categoriaLower.includes('jardín') || categoriaLower.includes('planta') || categoriaLower.includes('naturaleza')) {
      return 'success';
    } else if (categoriaLower.includes('música') || categoriaLower.includes('instrumento') || categoriaLower.includes('audio')) {
      return 'tertiary';
    } else if (categoriaLower.includes('arte') || categoriaLower.includes('manualidad') || categoriaLower.includes('creatividad')) {
      return 'warning';
    } else if (categoriaLower.includes('mascota') || categoriaLower.includes('animal') || categoriaLower.includes('veterinaria')) {
      return 'tertiary';
    } else if (categoriaLower.includes('auto') || categoriaLower.includes('vehículo') || categoriaLower.includes('transporte')) {
      return 'medium';
    } else if (categoriaLower.includes('herramienta') || categoriaLower.includes('construcción') || categoriaLower.includes('bricolaje')) {
      return 'medium';
    }
    
    // Color por defecto
    return 'medium';
  }

  getIconoCategoria(categoria: string): string {
    // Buscar el icono en la configuración
    const icono = this.config.filters.categoryIcons[categoria];
    if (icono) {
      return icono;
    }
    
    // Si no hay icono específico, intentar hacer match parcial
    const categoriaLower = categoria.toLowerCase();
    if (categoriaLower.includes('electrónic') || categoriaLower.includes('tech') || categoriaLower.includes('digital')) {
      return 'bi-phone';
    } else if (categoriaLower.includes('hogar') || categoriaLower.includes('casa') || categoriaLower.includes('doméstic')) {
      return 'bi-house';
    } else if (categoriaLower.includes('deporte') || categoriaLower.includes('fitness') || categoriaLower.includes('ejercicio')) {
      return 'bi-trophy';
    } else if (categoriaLower.includes('ropa') || categoriaLower.includes('vestimenta') || categoriaLower.includes('accesorio')) {
      return 'bi-bag';
    } else if (categoriaLower.includes('libro') || categoriaLower.includes('lectura') || categoriaLower.includes('educación')) {
      return 'bi-book';
    } else if (categoriaLower.includes('comida') || categoriaLower.includes('alimento') || categoriaLower.includes('bebida')) {
      return 'bi-cup-hot';
    } else if (categoriaLower.includes('belleza') || categoriaLower.includes('cosmético') || categoriaLower.includes('cuidado')) {
      return 'bi-mirror';
    } else if (categoriaLower.includes('juego') || categoriaLower.includes('juguete') || categoriaLower.includes('entretenimiento')) {
      return 'bi-controller';
    } else if (categoriaLower.includes('jardín') || categoriaLower.includes('planta') || categoriaLower.includes('naturaleza')) {
      return 'bi-flower1';
    } else if (categoriaLower.includes('música') || categoriaLower.includes('instrumento') || categoriaLower.includes('audio')) {
      return 'bi-music-note';
    } else if (categoriaLower.includes('arte') || categoriaLower.includes('manualidad') || categoriaLower.includes('creatividad')) {
      return 'bi-palette';
    } else if (categoriaLower.includes('mascota') || categoriaLower.includes('animal') || categoriaLower.includes('veterinaria')) {
      return 'bi-heart-pulse';
    } else if (categoriaLower.includes('auto') || categoriaLower.includes('vehículo') || categoriaLower.includes('transporte')) {
      return 'bi-car-front';
    } else if (categoriaLower.includes('herramienta') || categoriaLower.includes('construcción') || categoriaLower.includes('bricolaje')) {
      return 'bi-tools';
    }
    
    // Icono por defecto
    return 'bi-gift';
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
