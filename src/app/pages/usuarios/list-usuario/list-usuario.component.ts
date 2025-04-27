import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-list-usuario',
  standalone: false,
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss'],
})
export class ListUsuarioComponent  implements OnInit {
  
  usuarios: any[] = [];          // lista original
  filteredUsuarios: any[] = [];  // lista filtrada para la vista
  selectedStatus: string = '';

  constructor(
    private _usuarios: UsuariosService,
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
      const req = await this._usuarios.getUsers();
      req.subscribe((res: any) => {
        if (res.ok) {
          this.usuarios = res.users;
          this.applyFilters();
        }
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  filtrar(event: any) {
    const txt = event.detail.value?.toLowerCase() || '';
    if (!txt.trim()) {
      this.applyFilters();
      return;
    }
    this.filteredUsuarios = this.usuarios.filter(u => {
      const nombre = u.name?.toLowerCase() || '';
      const email = u.email?.toLowerCase() || '';
      const role = u.role?.toLowerCase() || '';
      return nombre.includes(txt) || email.includes(txt) || role.includes(txt);
    });
  }

  applyFilters() {
    this.filteredUsuarios = this.usuarios.filter(u => {
      const matchesStatus = !this.selectedStatus || u.status === this.selectedStatus;
      return matchesStatus;
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
      message: '¿Eliminar este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // Llama al endpoint de eliminar
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
