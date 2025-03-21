import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-zona',
  standalone: false,
  templateUrl: './list-zona.component.html',
  styleUrls: ['./list-zona.component.scss'],
})
export class ListZonaComponent  implements OnInit {

  zonas: any[] = [];
  filteredZonas: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarZonas();
  }

  async cargarZonas() {
    try {
      const req = await this.apiService.getZones();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.zonas = res.zone;
          this.filteredZonas = [...this.zonas];
        }
      });
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredZonas = [...this.zonas];
      return;
    }
    this.filteredZonas = this.zonas.filter(z => {
      const name = z.name?.toLowerCase() || '';
      const code = z.code?.toLowerCase() || '';
      return name.includes(txt) || code.includes(txt);
    });
  }

  nuevaZona() {
    this.navCtrl.navigateForward('/zonas/create');
  }

  editarZona(id: string) {
    this.navCtrl.navigateForward(`/zonas/edit/${id}`);
  }

  async eliminarZona(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta zona?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // this.apiService.deleteZone(id) ...
            this.mostrarToast('Zona eliminada (simulado).');
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
}
