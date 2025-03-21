import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-usuario',
  standalone: false,
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss'],
})
export class ListUsuarioComponent  implements OnInit {
  
  usuarios: any[] = [];          // lista original
  filteredUsuarios: any[] = [];  // lista filtrada para la vista

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  ionViewDidEnter(){
   this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      const req = await this.apiService.getUsers();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.usuarios = res.users;
          this.filteredUsuarios = [...this.usuarios];
        }
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  filtrar(event: any) {
    const texto = event.detail.value?.toLowerCase() || '';
    if (!texto.trim()) {
      this.filteredUsuarios = [...this.usuarios];
      return;
    }
    // Ejemplo: Filtrar por name, email, code
    this.filteredUsuarios = this.usuarios.filter(u => {
      const name  = u.name?.toLowerCase()  || '';
      const email = u.email?.toLowerCase() || '';
      const code  = u.code?.toLowerCase()  || '';
      return name.includes(texto) || email.includes(texto) || code.includes(texto);
    });
  }

  // Navegar al formulario de crear
  nuevoUsuario() {
    this.navCtrl.navigateForward('/usuarios/create');
  }

  // Navegar al formulario de editar
  editarUsuario(id: string) {
    this.navCtrl.navigateForward(`/usuarios/edit/${id}`);
  }

  // Confirmar y eliminar
  async eliminarUsuario(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas eliminar este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            // Llamada real: this.apiService.deleteUser(id)...
            this.mostrarToast('Usuario eliminado (simulado).');
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
