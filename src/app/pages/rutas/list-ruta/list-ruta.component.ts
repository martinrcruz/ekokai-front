import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { RutasService } from 'src/app/services/rutas.service';

@Component({
  selector: 'app-list-ruta',
  standalone:false,
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

  // Método para cargar las rutas
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

  // Método para aplicar filtros
  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.applyFilters();
      return;
    }
    this.filteredRutas = this.rutas.filter(r => {
      const nombre = r.name?.name?.toLowerCase() || '';
      const state = r.state?.toLowerCase() || '';
      return nombre.includes(txt) || state.includes(txt);
    });
  }

  // Aplicar filtros de estado y fecha
  applyFilters() {
    this.filteredRutas = this.rutas.filter(r => {
      const matchesStatus = !this.selectedStatus || r.state === this.selectedStatus;
      const matchesDate = !this.selectedDate || r.date === this.selectedDate;
      return matchesStatus && matchesDate;
    });
  }

  // Función para ir a la página de crear ruta
  nuevaRuta() {
    this.navCtrl.navigateForward('/rutas/create');
  }

  // Función para editar una ruta
  editarRuta(id: string) {
    this.navCtrl.navigateForward(`/rutas/edit/${id}`);
  }

  // Función para eliminar una ruta (simulada)
  async eliminarRuta(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta ruta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const req = await this._rutas.deleteRuta(id);
              req.subscribe((res: any) => {
                if (res.ok) {
                  this.mostrarToast('Ruta eliminada correctamente.');
                  this.cargarRutas(); // Recargar la lista
                } else {
                  this.mostrarToast('Error al eliminar la ruta.');
                }
              }, (error: any) => {
                console.error('Error al eliminar ruta:', error);
                this.mostrarToast('Error al eliminar la ruta.');
              });
            } catch (error) {
              console.error('Error al eliminar ruta:', error);
              this.mostrarToast('Error al eliminar la ruta.');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Mostrar toast de eliminación
  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  // Filtrar por fecha
  onDateChange(event: any) {
    this.selectedDate = event;
    this.applyFilters();
  }
}
