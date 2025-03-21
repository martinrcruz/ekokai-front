import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-vehiculo',
  standalone: false,
  templateUrl: './list-vehiculo.component.html',
  styleUrls: ['./list-vehiculo.component.scss'],
})
export class ListVehiculoComponent  implements OnInit {

  vehicles: any[] = [];
  filteredVehicles: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  async cargarVehiculos() {
    try {
      const req = await this.apiService.getVehicles();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.vehicles = res.vehicles;
          this.filteredVehicles = [...this.vehicles];
        }
      });
    } catch (error) {
      console.error('Error al cargar vehiculos:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredVehicles = [...this.vehicles];
      return;
    }
    this.filteredVehicles = this.vehicles.filter(v => {
      const brand   = v.brand?.toLowerCase()   || '';
      const modelo  = v.modelo?.toLowerCase()  || '';
      const matricula = v.matricula?.toLowerCase() || '';
      return brand.includes(txt) || modelo.includes(txt) || matricula.includes(txt);
    });
  }

  nuevoVehiculo() {
    this.navCtrl.navigateForward('/vehicles/create');
  }

  editarVehiculo(id: string) {
    this.navCtrl.navigateForward(`/vehicles/edit/${id}`);
  }

  async eliminarVehiculo(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este vehículo?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // this.apiService.deleteVehicle(id) ...
            this.mostrarToast('Vehículo eliminado (simulado).');
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
      position: 'middle'
    });
    toast.present();
  }

}
