import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { QRWhatsappService, QRWhatsapp, CrearQRRequest, ActualizarQRRequest } from '../../../services/qr-whatsapp.service';

@Component({
  selector: 'app-qr-whatsapp-modal',
  templateUrl: './qr-whatsapp-modal.component.html',
  styleUrls: ['./qr-whatsapp-modal.component.scss'],
  standalone: false
})
export class QRWhatsappModalComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' | 'ver' = 'crear';
  @Input() qr?: QRWhatsapp;

  // Formulario
  formData = {
    nombre: '',
    mensaje: '',
    descripcion: '',
    numeroWhatsapp: '',
    fechaExpiracion: ''
  };

  // Validaciones
  errors: any = {};
  loading = false;
  fechaMinima: string = '';

  constructor(
    private modalController: ModalController,
    private qrWhatsappService: QRWhatsappService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.fechaMinima = this.formatearFechaParaInput(new Date().toISOString());
    
    if (this.modo === 'editar' || this.modo === 'ver') {
      this.cargarDatosQR();
    } else {
      this.establecerFechaMinima();
    }
  }

  /**
   * Carga los datos del código QR para edición
   */
  cargarDatosQR() {
    if (this.qr) {
      this.formData = {
        nombre: this.qr.nombre,
        mensaje: this.qr.mensaje,
        descripcion: this.qr.descripcion || '',
        numeroWhatsapp: this.qr.numeroWhatsapp || '',
        fechaExpiracion: this.formatearFechaParaInput(this.qr.fechaExpiracion)
      };
    }
  }

  /**
   * Establece la fecha mínima como hoy
   */
  establecerFechaMinima() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1); // Mínimo mañana
    this.formData.fechaExpiracion = this.formatearFechaParaInput(hoy.toISOString());
  }

  /**
   * Formatea una fecha para el input datetime-local
   */
  formatearFechaParaInput(fecha: string): string {
    const date = new Date(fecha);
    return date.toISOString().slice(0, 16);
  }

  /**
   * Valida el formulario
   */
  validarFormulario(): boolean {
    this.errors = {};

    if (!this.formData.nombre.trim()) {
      this.errors.nombre = 'El nombre es requerido';
    } else if (this.formData.nombre.length > 100) {
      this.errors.nombre = 'El nombre no puede exceder los 100 caracteres';
    }

    if (!this.formData.mensaje.trim()) {
      this.errors.mensaje = 'El mensaje es requerido';
    } else if (this.formData.mensaje.length > 1000) {
      this.errors.mensaje = 'El mensaje no puede exceder los 1000 caracteres';
    }

    if (!this.formData.fechaExpiracion) {
      this.errors.fechaExpiracion = 'La fecha de expiración es requerida';
    } else {
      const fechaExp = new Date(this.formData.fechaExpiracion);
      const hoy = new Date();
      if (fechaExp <= hoy) {
        this.errors.fechaExpiracion = 'La fecha de expiración debe ser futura';
      }
    }

    if (this.formData.numeroWhatsapp && !this.validarNumeroWhatsapp(this.formData.numeroWhatsapp)) {
      this.errors.numeroWhatsapp = 'Formato de número inválido';
    }

    return Object.keys(this.errors).length === 0;
  }

  /**
   * Valida el formato del número de WhatsApp
   */
  validarNumeroWhatsapp(numero: string): boolean {
    // Remover espacios y caracteres especiales
    const numeroLimpio = numero.replace(/\D/g, '');
    // Debe tener entre 7 y 15 dígitos
    return numeroLimpio.length >= 7 && numeroLimpio.length <= 15;
  }

  /**
   * Guarda el código QR
   */
  async guardar() {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    const loading = await this.loadingController.create({
      message: this.modo === 'crear' ? 'Creando código QR...' : 'Actualizando código QR...'
    });
    await loading.present();

    try {
      if (this.modo === 'crear') {
        await this.crearQR();
      } else if (this.modo === 'editar') {
        await this.actualizarQR();
      }
    } catch (error) {
      console.error('Error guardando QR:', error);
      this.mostrarAlerta('Error', 'No se pudo guardar el código QR');
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  /**
   * Crea un nuevo código QR
   */
  async crearQR() {
    const request: CrearQRRequest = {
      nombre: this.formData.nombre.trim(),
      mensaje: this.formData.mensaje.trim(),
      descripcion: this.formData.descripcion.trim() || undefined,
      numeroWhatsapp: this.formData.numeroWhatsapp.trim() || undefined,
      fechaExpiracion: new Date(this.formData.fechaExpiracion).toISOString()
    };

    const response = await this.qrWhatsappService.crearQR(request).toPromise();
    if (response?.success) {
      this.mostrarAlerta('Éxito', 'Código QR creado exitosamente');
      this.modalController.dismiss({ success: true, qr: response.data });
    } else {
      throw new Error(response?.message || 'Error creando código QR');
    }
  }

  /**
   * Actualiza un código QR existente
   */
  async actualizarQR() {
    if (!this.qr?.id) {
      throw new Error('ID del código QR no encontrado');
    }

    const request: ActualizarQRRequest = {
      nombre: this.formData.nombre.trim(),
      mensaje: this.formData.mensaje.trim(),
      descripcion: this.formData.descripcion.trim() || undefined,
      numeroWhatsapp: this.formData.numeroWhatsapp.trim() || undefined,
      fechaExpiracion: new Date(this.formData.fechaExpiracion).toISOString()
    };

    const response = await this.qrWhatsappService.actualizarQR(this.qr.id, request).toPromise();
    if (response?.success) {
      this.mostrarAlerta('Éxito', 'Código QR actualizado exitosamente');
      this.modalController.dismiss({ success: true, qr: response.data });
    } else {
      throw new Error(response?.message || 'Error actualizando código QR');
    }
  }

  /**
   * Cierra el modal
   */
  cerrar() {
    this.modalController.dismiss();
  }

  /**
   * Descarga el código QR
   */
  descargarQR() {
    if (this.qr?.qrDataUrl) {
      this.qrWhatsappService.descargarQR(this.qr.qrDataUrl, this.qr.nombre);
    }
  }

  /**
   * Copia el enlace de WhatsApp
   */
  async copiarEnlace() {
    if (this.qr) {
      const enlace = this.qrWhatsappService.generarEnlaceWhatsapp(this.qr.mensaje, this.qr.numeroWhatsapp);
      
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(enlace);
          this.mostrarAlerta('Éxito', 'Enlace copiado al portapapeles');
        } catch (error) {
          console.error('Error copiando al portapapeles:', error);
          this.mostrarAlerta('Error', 'No se pudo copiar el enlace');
        }
      }
    }
  }

  /**
   * Verifica si el código QR está expirado
   */
  isExpirado(): boolean {
    return this.qr ? this.qrWhatsappService.isExpirado(this.qr.fechaExpiracion) : false;
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    return this.qrWhatsappService.formatearFecha(fecha);
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
