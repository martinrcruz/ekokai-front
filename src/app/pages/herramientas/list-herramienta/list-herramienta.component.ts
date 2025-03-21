import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-herramienta',
  standalone: false,
  templateUrl: './list-herramienta.component.html',
  styleUrls: ['./list-herramienta.component.scss'],
})
export class ListHerramientaComponent  implements OnInit {

  herramientas: any[] = [];
  filteredHerr: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarHerramientas();
  }

  async cargarHerramientas() {
    try {
      // Ajusta si existe un getHerramientas en tu ApiService
      const req = await this.apiService.getHerramientas();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.herramientas = res.herramientas;
          this.filteredHerr = [...this.herramientas];
        }
      });
    } catch (error) {
      console.error('Error al cargar herramientas:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredHerr = [...this.herramientas];
      return;
    }
    this.filteredHerr = this.herramientas.filter(h => {
      const name = h.name?.toLowerCase() || '';
      const code = h.code?.toLowerCase() || '';
      return name.includes(txt) || code.includes(txt);
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
            // this.apiService.deleteHerramienta(id)...
            this.mostrarToast('Herramienta eliminada (simulado).');
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
