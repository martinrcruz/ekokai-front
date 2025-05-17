import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
    private _usuarios: UserService,
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
  const req = await this._usuarios.getAllUsers();
  req.subscribe(({ ok, data }) => {
    if (ok && data.users) {
      this.usuarios = data.users;
      this.applyFilters();
    }
  });
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

 async eliminarUsuario(id: string) {
  const alert = await this.alertCtrl.create({
    header: 'Confirmar',
    message: '¿Eliminar este usuario?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          const del$ = await this._usuarios.deleteUser(id);
          del$.subscribe(({ ok }) => {
            if (ok) {
              this.usuarios = this.usuarios.filter(u => u._id !== id);
              this.applyFilters();
              this.mostrarToast('Usuario eliminado.');
            }
          });
        }
      }
    ]
  });
  alert.present();
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
