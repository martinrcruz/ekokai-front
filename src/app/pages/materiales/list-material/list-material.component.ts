import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { MaterialesService } from '../../../services/materiales.service';

@Component({
  selector: 'app-list-material',
  standalone: false,
  templateUrl: './list-material.component.html',
  styleUrls: ['./list-material.component.scss'],
})
export class ListMaterialComponent implements OnInit {
  materiales: any[] = [];
  filteredMaterials: any[] = [];
  loading = true;
  error = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _materiales: MaterialesService
  ) {}

  async ngOnInit() {
    await this.loadMateriales();
  }

  async loadMateriales() {
    try {
      this.loading = true;
      const req = await this._materiales.getMaterials();
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.materiales = res.materials;
            this.filteredMaterials = [...this.materiales];
          }
        },
        (error) => {
          console.error('Error al cargar materiales:', error);
          this.error = 'Error al cargar los materiales';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar los materiales';
    } finally {
      this.loading = false;
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredMaterials = [...this.materiales];
      return;
    }
    this.filteredMaterials = this.materiales.filter(m => {
      const name = m.name?.toLowerCase() || '';
      const code = m.code?.toLowerCase() || '';
      return name.includes(txt) || code.includes(txt);
    });
  }

  nuevoMaterial() {
    this.navCtrl.navigateForward('/materiales/create');
  }

  editarMaterial(id: string) {
    this.navCtrl.navigateForward(`/materiales/edit/${id}`);
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
            this.deleteMaterial(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteMaterial(id: string) {
    try {
      const req = await this._materiales.deleteMaterial(id);
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.materiales = this.materiales.filter(m => m._id !== id);
            this.filteredMaterials = this.filteredMaterials.filter(m => m._id !== id);
            this.mostrarToast('Material eliminado.');
          }
        },
        (error) => {
          console.error('Error al eliminar material:', error);
          this.error = 'Error al eliminar el material';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al eliminar el material';
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
    this.loadMateriales().then(() => {
      event.target.complete();
    });
  }
}
