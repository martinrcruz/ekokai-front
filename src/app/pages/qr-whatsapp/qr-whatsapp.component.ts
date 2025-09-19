import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { QRWhatsappService, QRWhatsapp, CrearQRRequest, ActualizarQRRequest } from '../../services/qr-whatsapp.service';
import { QRWhatsappModalComponent } from './qr-whatsapp-modal/qr-whatsapp-modal.component';

@Component({
  selector: 'app-qr-whatsapp',
  templateUrl: './qr-whatsapp.component.html',
  styleUrls: ['./qr-whatsapp.component.scss'],
  standalone: false
})
export class QRWhatsappComponent implements OnInit {
  qrs: QRWhatsapp[] = [];
  estadisticas: any = null;
  loading = false;
  filtroActivos = true;

  constructor(
    private qrWhatsappService: QRWhatsappService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarQRs();
    this.cargarEstadisticas();
  }

  /**
   * Carga la lista de códigos QR
   */
  async cargarQRs() {
    this.loading = true;
    try {
      const response = await this.qrWhatsappService.obtenerQRs({
        soloActivos: this.filtroActivos,
        limit: 50
      }).toPromise();
      
      if (response?.success) {
        this.qrs = response.data;
      }
    } catch (error) {
      console.error('Error cargando QRs:', error);
      this.mostrarAlerta('Error', 'No se pudieron cargar los códigos QR');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Carga las estadísticas
   */
  async cargarEstadisticas() {
    try {
      const response = await this.qrWhatsappService.obtenerEstadisticas().toPromise();
      if (response?.success) {
        this.estadisticas = response.data;
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }

  /**
   * Abre el modal para crear un nuevo código QR
   */
  async crearQR() {
    const modal = await this.modalController.create({
      component: QRWhatsappModalComponent,
      componentProps: {
        modo: 'crear'
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.cargarQRs();
        this.cargarEstadisticas();
      }
    });

    return await modal.present();
  }

  /**
   * Abre el modal para editar un código QR
   */
  async editarQR(qr: QRWhatsapp) {
    const modal = await this.modalController.create({
      component: QRWhatsappModalComponent,
      componentProps: {
        modo: 'editar',
        qr: qr
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        this.cargarQRs();
        this.cargarEstadisticas();
      }
    });

    return await modal.present();
  }

  /**
   * Muestra los detalles de un código QR
   */
  async verDetalles(qr: QRWhatsapp) {
    const modal = await this.modalController.create({
      component: QRWhatsappModalComponent,
      componentProps: {
        modo: 'ver',
        qr: qr
      }
    });

    return await modal.present();
  }

  /**
   * Desactiva un código QR
   */
  async desactivarQR(qr: QRWhatsapp) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de que quieres desactivar el código QR "${qr.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Desactivar',
          handler: async () => {
            await this.confirmarDesactivacion(qr.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Confirma la desactivación del código QR
   */
  async confirmarDesactivacion(id: string) {
    const loading = await this.loadingController.create({
      message: 'Desactivando código QR...'
    });
    await loading.present();

    try {
      const response = await this.qrWhatsappService.desactivarQR(id).toPromise();
      if (response?.success) {
        this.mostrarAlerta('Éxito', 'Código QR desactivado correctamente');
        this.cargarQRs();
        this.cargarEstadisticas();
      }
    } catch (error) {
      console.error('Error desactivando QR:', error);
      this.mostrarAlerta('Error', 'No se pudo desactivar el código QR');
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Descarga un código QR
   */
  descargarQR(qr: QRWhatsapp) {
    if (qr.qrDataUrl) {
      this.qrWhatsappService.descargarQR(qr.qrDataUrl, qr.nombre);
    } else {
      this.mostrarAlerta('Error', 'No hay imagen de código QR disponible');
    }
  }

  /**
   * Copia el enlace de WhatsApp al portapapeles
   */
  async copiarEnlace(qr: QRWhatsapp) {
    const enlace = this.qrWhatsappService.generarEnlaceWhatsapp(qr.mensaje, qr.numeroWhatsapp);
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(enlace);
        this.mostrarAlerta('Éxito', 'Enlace copiado al portapapeles');
      } catch (error) {
        console.error('Error copiando al portapapeles:', error);
        this.mostrarAlerta('Error', 'No se pudo copiar el enlace');
      }
    } else {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = enlace;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.mostrarAlerta('Éxito', 'Enlace copiado al portapapeles');
    }
  }

  /**
   * Limpia códigos QR expirados
   */
  async limpiarExpirados() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres desactivar todos los códigos QR expirados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpiar',
          handler: async () => {
            await this.confirmarLimpieza();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Confirma la limpieza de códigos QR expirados
   */
  async confirmarLimpieza() {
    const loading = await this.loadingController.create({
      message: 'Limpiando códigos QR expirados...'
    });
    await loading.present();

    try {
      const response = await this.qrWhatsappService.limpiarQRsExpirados().toPromise();
      if (response?.success) {
        this.mostrarAlerta('Éxito', response.message);
        this.cargarQRs();
        this.cargarEstadisticas();
      }
    } catch (error) {
      console.error('Error limpiando QRs expirados:', error);
      this.mostrarAlerta('Error', 'No se pudieron limpiar los códigos QR expirados');
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Cambia el filtro de códigos activos
   */
  cambiarFiltro() {
    this.cargarQRs();
  }

  /**
   * Verifica si un código QR está expirado
   */
  isExpirado(fechaExpiracion: string): boolean {
    return this.qrWhatsappService.isExpirado(fechaExpiracion);
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    return this.qrWhatsappService.formatearFecha(fecha);
  }

  /**
   * Obtiene el número de WhatsApp a mostrar (por defecto o el especificado)
   */
  obtenerNumeroWhatsapp(qr: QRWhatsapp): string {
    return qr.numeroWhatsapp || '+17017604112';
  }

  /**
   * Muestra una alerta
   */
  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
