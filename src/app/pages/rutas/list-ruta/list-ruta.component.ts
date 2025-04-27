import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { RutasService } from 'src/app/services/rutas.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-list-ruta',
  standalone: false,
  templateUrl: './list-ruta.component.html',
  styleUrls: ['./list-ruta.component.scss']
})
export class ListRutaComponent implements OnInit {
  rutas: any[] = [];
  filteredRutas: any[] = [];
  selectedStatus: string = '';
  selectedDate: string = '';

  constructor(
    private _rutas: RutasService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarRutas();
  }

  getTipoRutaClass(tipo: string): string {
    switch (tipo) {
      case 'Mantenimiento': return 'tag-mant';
      case 'Correctivo':    return 'tag-corr';
      case 'Visitas':       return 'tag-visit';
      default:              return 'tag-other';
    }
  }

  async cargarRutas() {
    try {
      const req = await this._rutas.getRutas();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.rutas = res.rutas;
          this.applyFilters();
        }
      });
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.applyFilters();
      return;
    }
    this.filteredRutas = this.rutas.filter(r => {
      const nombre = r.name?.name?.toLowerCase() || r.name?.toLowerCase() || '';
      const state = r.state?.toLowerCase() || '';
      return nombre.includes(txt) || state.includes(txt);
    });
  }

  applyFilters() {
    this.filteredRutas = this.rutas.filter(r => {
      const matchesStatus = !this.selectedStatus || r.state === this.selectedStatus;
      const matchesDate = !this.selectedDate || r.date === this.selectedDate;
      return matchesStatus && matchesDate;
    });
  }

  nuevaRuta() {
    this.navCtrl.navigateForward('/rutas/create');
  }

  editarRuta(id: string) {
    this.navCtrl.navigateForward(`/rutas/edit/${id}`);
  }

  async eliminarRuta(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta ruta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // Llama al endpoint de eliminar
            this.mostrarToast('Ruta eliminada (simulado).');
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

  onDateChange(event: any) {
    this.selectedDate = event;
    this.applyFilters();
  }
}
