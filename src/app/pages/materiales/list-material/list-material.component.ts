import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-material',
  standalone: false,
  templateUrl: './list-material.component.html',
  styleUrls: ['./list-material.component.scss'],
})
export class ListMaterialComponent  implements OnInit {

  materials: any[] = [];
  filteredMaterials: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarMateriales();
  }

  async cargarMateriales() {
    try {
      const req = await this.apiService.getMaterials();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.materials = res.materials;
          this.filteredMaterials = [...this.materials];
        }
      });
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredMaterials = [...this.materials];
      return;
    }
    this.filteredMaterials = this.materials.filter(m => {
      const name = m.name?.toLowerCase() || '';
      const code = m.code?.toLowerCase() || '';
      return name.includes(txt) || code.includes(txt);
    });
  }

  nuevoMaterial() {
    this.navCtrl.navigateForward('/materials/create');
  }

  editarMaterial(id: string) {
    this.navCtrl.navigateForward(`/materials/edit/${id}`);
  }

  async eliminarMaterial(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este material?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // this.apiService.deleteMaterial(id) ...
            this.mostrarToast('Material eliminado (simulado).');
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
