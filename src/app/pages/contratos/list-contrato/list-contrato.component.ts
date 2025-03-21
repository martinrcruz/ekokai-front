import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-contrato',
  standalone: false,
  templateUrl: './list-contrato.component.html',
  styleUrls: ['./list-contrato.component.scss'],
})
export class ListContratoComponent  implements OnInit {

  contracts: any[] = [];
  filteredContracts: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarContratos();
  }

  async cargarContratos() {
    try {
      const req = await this.apiService.getContracts();
      req.subscribe((res: any) => {
        // Ajusta si tu backend retorna { ok:true, contracts: [...] }
        this.contracts = res;
        this.filteredContracts = [...this.contracts];
      });
    } catch (error) {
      console.error('Error al cargar contratos:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.filteredContracts = [...this.contracts];
      return;
    }
    // Filtrar por code, name o lo que necesites
    this.filteredContracts = this.contracts.filter(c => {
      const code = c.code?.toLowerCase() || '';
      const name = c.name?.toLowerCase() || '';
      return code.includes(txt) || name.includes(txt);
    });
  }

  nuevoContrato() {
    this.navCtrl.navigateForward('/contracts/create');
  }

  editarContrato(id: string) {
    this.navCtrl.navigateForward(`/contracts/edit/${id}`);
  }

  async eliminarContrato(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar este contrato?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // this.apiService.deleteContract(id)...
            this.mostrarToast('Contrato eliminado (simulado).');
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
