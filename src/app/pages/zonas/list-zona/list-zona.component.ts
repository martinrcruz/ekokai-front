import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-list-zona',
  standalone: false,
  templateUrl: './list-zona.component.html',
  styleUrls: ['./list-zona.component.scss'],
})
export class ListZonaComponent  implements OnInit {

  zonas: any[] = [];
  filteredZonas: any[] = [];
  selectedStatus: string = '';

  constructor(
    private _zonas: ZonasService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarZonas();
  }

  ionViewDidEnter(){
   this.cargarZonas();
  }

  async cargarZonas() {
    try {
      const req = await this._zonas.getZones();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.zonas = res.data.zones;
          this.applyFilters();
        }
      });
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.applyFilters();
      return;
    }
    this.filteredZonas = this.zonas.filter(z => {
      const nombre = z.name?.toLowerCase() || '';
      const descripcion = z.description?.toLowerCase() || '';
      return nombre.includes(txt) || descripcion.includes(txt);
    });
  }

  applyFilters() {
    this.filteredZonas = this.zonas.filter(z => {
      const matchesStatus = !this.selectedStatus || z.status === this.selectedStatus;
      return matchesStatus;
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
        handler: async () => {
          try {
            await this._zonas.deleteZone(id).toPromise();
            this.zonas = this.zonas.filter(z => z._id !== id);
            this.applyFilters();
            this.mostrarToast('Zona eliminada correctamente');
          } catch {
            this.mostrarToast('Error al eliminar la zona');
          }
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
