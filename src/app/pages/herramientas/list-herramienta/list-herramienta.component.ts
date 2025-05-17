import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { HerramientasService } from '../../../services/herramientas.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-list-herramienta',
  standalone: false,
  templateUrl: './list-herramienta.component.html',
  styleUrls: ['./list-herramienta.component.scss'],
})
export class ListHerramientaComponent implements OnInit {
  herramientas: any[] = [];
  filteredHerramientas: any[] = [];
  selectedStatus: string = '';
  selectedDate: string = '';
  loading = true;
  error = '';

  constructor(
    private _herramientas: HerramientasService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarHerramientas();
  }

  ionViewDidEnter(){
   this.cargarHerramientas();
  }

  async cargarHerramientas() {
    try {
      this.loading = true;
      const req = await this._herramientas.getHerramientas();
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.herramientas = res.data.herramientas;
            this.applyFilters();
          }
        },
        (error) => {
          console.error('Error al cargar herramientas:', error);
          this.error = 'Error al cargar las herramientas';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar las herramientas';
    } finally {
      this.loading = false;
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.applyFilters();
      return;
    }
    this.filteredHerramientas = this.herramientas.filter(h => {
      const nombre = h.name?.toLowerCase() || '';
      const codigo = h.code?.toLowerCase() || '';
      const descripcion = h.description?.toLowerCase() || '';
      return nombre.includes(txt) || codigo.includes(txt) || descripcion.includes(txt);
    });
  }

  applyFilters() {
    this.filteredHerramientas = this.herramientas.filter(h => {
      const matchesStatus = !this.selectedStatus || h.status === this.selectedStatus;
      const matchesDate = !this.selectedDate || h.lastMaintenance === this.selectedDate;
      return matchesStatus && matchesDate;
    });
  }

  nuevaHerramienta() {
    this.navCtrl.navigateForward('/herramientas/create');
  }

  editarHerramienta(id: string) {
    this.navCtrl.navigateForward(`/herramientas/edit/${id}`);
  }

  async eliminarHerramienta(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta herramienta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteHerramienta(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteHerramienta(id: string) {
    try {
      const req = await this._herramientas.deleteHerramienta(id);
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.herramientas = this.herramientas.filter(h => h._id !== id);
            this.mostrarToast('Herramienta eliminada.');
            this.cargarHerramientas();
          }
        },
        (error) => {
          console.error('Error al eliminar herramienta:', error);
          this.error = 'Error al eliminar la herramienta';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al eliminar la herramienta';
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  doRefresh(event: any) {
    this.cargarHerramientas().then(() => {
      event.target.complete();
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event;
    this.applyFilters();
  }
}
