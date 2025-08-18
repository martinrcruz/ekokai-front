import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';

interface VecinoForm {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-vecinos',
  templateUrl: './vecinos.component.html',
  styleUrls: ['./vecinos.component.scss'],
  standalone: false
})
export class VecinosComponent {
  mostrarFormulario = true;
  nuevoVecino: VecinoForm = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: ''
  };
  loading = false;

  constructor(private usuariosService: UsuariosService, private toastCtrl: ToastController) {}

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  crearVecino() {
    this.loading = true;
    const payload = {
      ...this.nuevoVecino,
      rol: 'vecino'
    };
    this.usuariosService.registrarVecino(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        const success = res?.success === true || !!res?.usuario || !!res?.data;
        if (success) {
          this.showToast('Vecino creado correctamente', 'success');
          this.cerrarFormulario();
        } else {
          const msg = res?.message || 'Error al crear vecino';
          this.showToast(msg, 'danger');
        }
      },
      error: (_err) => {
        this.loading = false;
        this.showToast('Error al crear vecino', 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
