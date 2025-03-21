import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-facturacion',
  standalone: false,
  templateUrl: './list-facturacion.component.html',
  styleUrls: ['./list-facturacion.component.scss'],
})
export class ListFacturacionComponent  implements OnInit {
  
  facturaciones: any[] = [];
  filteredFacturaciones: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarFacturacion();
  }

  async cargarFacturacion() {
    try {
      const req = await this.apiService.getFacturacion();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.facturaciones = res.facturacion;
          this.filteredFacturaciones = [...this.facturaciones];
        }
      });
    } catch (error) {
      console.error('Error al cargar facturación:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredFacturaciones = [...this.facturaciones];
      return;
    }
    this.filteredFacturaciones = this.facturaciones.filter(f => {
      // Filtrar por parte, ruta...
      const parte = f.parte?.toLowerCase() || '';
      const ruta = f.ruta?.toLowerCase() || '';
      return parte.includes(txt) || ruta.includes(txt);
    });
  }

  nuevoFacturacion() {
    this.navCtrl.navigateForward('/facturacion/create');
  }

  editarFacturacion(id: string) {
    this.navCtrl.navigateForward(`/facturacion/edit/${id}`);
  }

  async eliminarFacturacion(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar registro de facturación?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // this.apiService.deleteFacturacion(id)...
            this.mostrarToast('Registro de facturación eliminado (simulado).');
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }
}
