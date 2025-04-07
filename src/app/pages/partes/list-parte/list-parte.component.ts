import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-parte',
  standalone: false,
  templateUrl: './list-parte.component.html',
  styleUrls: ['./list-parte.component.scss']
})
export class ListParteComponent implements OnInit {

  partes: any[] = [];
  filteredPartes: any[] = [];

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarPartes();
  }

  async cargarPartes() {
    try {
      const req = await this.apiService.getPartes(); // GET /partes
      req.subscribe((res: any) => {
        if (res.ok) {
          this.partes = res.partes;
          this.filteredPartes = [...this.partes];
        }
      });
    } catch (error) {
      console.error('Error al cargar partes:', error);
    }
  }

  filtrar(event: any) {
    const texto = (event.detail.value || '').toLowerCase();
    if (!texto.trim()) {
      this.filteredPartes = [...this.partes];
      return;
    }
    this.filteredPartes = this.partes.filter(p => {
      const desc = p.description?.toLowerCase() || '';
      const type = p.type?.toLowerCase() || '';
      const state= p.state?.toLowerCase() || '';
      const customer = p.customer?.name?.toLowerCase() || '';
      return (
        desc.includes(texto) ||
        type.includes(texto) ||
        state.includes(texto) ||
        customer.includes(texto)
      );
    });
  }

  nuevaParte() {
    this.navCtrl.navigateForward('/partes/create');
  }

  editarParte(id: string) {
    this.navCtrl.navigateForward(`/partes/edit/${id}`);
  }

  async eliminarParte(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar esta parte?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // Llama a this.apiService.deleteParte(id)
            this.mostrarToast('Parte eliminada (simulado).');
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
      position: 'bottom'
    });
    toast.present();
  }

  getTipoParteClass(tipo: string): string {
    switch (tipo) {
      case 'Mantenimiento': return 'tag-mant';
      case 'Correctivo':    return 'tag-corr';
      case 'Visitas':       return 'tag-visit';
      case 'Obra':          return 'tag-obra';
      default:              return 'tag-other';
    }
  }

  stateColor(state: string) {
    switch(state){
      case 'Finalizado': return 'finalizado';
      case 'Pendiente': return 'pendiente';
      case 'EnProceso': return 'enproceso';
      default: return '';
    }
  }
  
}
