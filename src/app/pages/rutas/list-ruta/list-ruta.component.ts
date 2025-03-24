import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-ruta',
  standalone: false,
  templateUrl: './list-ruta.component.html',
  styleUrls: ['./list-ruta.component.scss']
})
export class ListRutaComponent implements OnInit {
  rutas: any[] = [];
  filteredRutas: any[] = [];

  constructor(
    private apiService: ApiService,
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
      const req = await this.apiService.getRutas();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.rutas = res.rutas;
          this.filteredRutas = [...this.rutas];
        }
      });
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredRutas = [...this.rutas];
      return;
    }
    this.filteredRutas = this.rutas.filter(r => {
      const nombre = r.name?.name?.toLowerCase() || r.name?.toLowerCase() || '';
      const state  = r.state?.toLowerCase() || '';
      return nombre.includes(txt) || state.includes(txt);
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
}
