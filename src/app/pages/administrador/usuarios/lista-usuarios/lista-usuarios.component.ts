import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  loading = true;
  filtroNombre = '';
  filtroRol = '';
  filtroEstado = '';
  roles: string[] = ['vecino', 'encargado', 'admin'];
  estados: string[] = ['Activo', 'Inactivo'];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      this.usuariosService.getUsuarios().subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.showToast('Error al cargar usuarios', 'danger');
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.loading = false;
    }
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(usuario => {
      const cumpleNombre = !this.filtroNombre || 
        usuario.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      const cumpleRol = !this.filtroRol || usuario.rol === this.filtroRol;
      const cumpleEstado = !this.filtroEstado || 
        (this.filtroEstado === 'Activo' ? usuario.activo : !usuario.activo);
      
      return cumpleNombre && cumpleRol && cumpleEstado;
    });
  }

  getUsuariosActivos() {
    return this.usuarios.filter(u => u.activo).length;
  }

  crearUsuario() {
    this.router.navigate(['/administrador/usuarios/crear']);
  }

  editarUsuario(usuario: any) {
    this.router.navigate(['/administrador/usuarios/editar', usuario._id]);
  }

  verHistorial(usuario: any) {
    this.router.navigate(['/administrador/usuarios/historial', usuario._id]);
  }

  async cambiarEstadoUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar cambio de estado',
      message: `¿Estás seguro de que quieres ${usuario.activo ? 'desactivar' : 'activar'} a ${usuario.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.ejecutarCambioEstado(usuario);
          }
        }
      ]
    });

    await alert.present();
  }

  private async ejecutarCambioEstado(usuario: any) {
    try {
      this.usuariosService.cambiarEstadoUsuario(usuario._id, !usuario.activo).subscribe({
        next: (response) => {
          if (response.ok) {
            usuario.activo = !usuario.activo;
            this.showToast(
              `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente`,
              'success'
            );
          } else {
            this.showToast('Error al cambiar el estado del usuario', 'danger');
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.showToast('Error al cambiar el estado del usuario', 'danger');
        }
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      this.showToast('Error inesperado', 'danger');
    }
  }

  async eliminarUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.ejecutarEliminacion(usuario);
          }
        }
      ]
    });

    await alert.present();
  }

  private async ejecutarEliminacion(usuario: any) {
    try {
      this.usuariosService.eliminarUsuario(usuario._id).subscribe({
        next: (response) => {
          if (response.ok) {
            this.usuarios = this.usuarios.filter(u => u._id !== usuario._id);
            this.showToast('Usuario eliminado exitosamente', 'success');
          } else {
            this.showToast('Error al eliminar el usuario', 'danger');
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.showToast('Error al eliminar el usuario', 'danger');
        }
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      this.showToast('Error inesperado', 'danger');
    }
  }

  volverAUsuariosGestion() {
    this.router.navigate(['/administrador/usuarios-gestion']);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  obtenerRolDisplay(rol: string): string {
    const rolesMap: { [key: string]: string } = {
      'vecino': 'Vecino',
      'encargado': 'Encargado',
      'admin': 'Administrador',
      'administrador': 'Administrador'
    };
    return rolesMap[rol] || rol;
  }
}
