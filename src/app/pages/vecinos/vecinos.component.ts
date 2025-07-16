import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastController } from '@ionic/angular';

interface VecinoForm {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
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
    password: '',
    telefono: ''
  };
  loading = false;

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  async crearVecino() {
    this.loading = true;
    const payload = {
      ...this.nuevoVecino,
      rol: 'vecino'
    };
    try {
      const res: any = await this.http.post(`${environment.apiUrl}/usuarios/registrar`, payload).toPromise();
      this.loading = false;
      if (res && res.ok) {
        this.showToast('Vecino creado correctamente');
        this.cerrarFormulario();
      } else {
        this.showToast('Error al crear vecino');
      }
    } catch (err) {
      this.loading = false;
      this.showToast('Error al crear vecino');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }
} 