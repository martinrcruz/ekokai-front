import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FiltroConfig } from 'src/app/shared/components/global-filter/filtros-estandarizados.component';

@Component({
  selector: 'app-usuarios-staff',
  templateUrl: './usuarios-staff.component.html',
  styleUrls: ['./usuarios-staff.component.scss'],
  standalone: false
})
export class UsuariosStaffComponent implements OnInit {
  usuarios: any[] = [];
  loading = false;
  filtroNombre = '';
  filtroRol = '';
  filtroEstado = '';
  roles: string[] = ['encargado', 'administrador'];
  estados: string[] = ['Activo', 'Inactivo'];

  // Modal y formulario para crear encargado
  showCrearEncargadoModal = false;
  encargadoForm = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    zona: '',
    pais: 'Chile'
  };
  creandoEncargado = false;

  // Modal y formulario para editar usuario
  showEditarUsuarioModal = false;
  usuarioEditando: any = {};
  guardandoCambios = false;

  // Configuración de filtros estandarizados
  filtrosConfig: FiltroConfig[] = [
    {
      tipo: 'texto',
      icono: 'bi-search',
      titulo: 'Buscar por nombre',
      placeholder: 'Ingrese nombre o apellido',
      valor: '',
      nombre: 'filtroNombre'
    },
    {
      tipo: 'select',
      icono: 'bi-person-badge',
      titulo: 'Rol',
      opciones: [
        { valor: '', etiqueta: 'Todos' },
        { valor: 'encargado', etiqueta: 'Encargado' },
        { valor: 'administrador', etiqueta: 'Administrador' }
      ],
      valor: '',
      nombre: 'filtroRol'
    },
    {
      tipo: 'select',
      icono: 'bi-toggle-on',
      titulo: 'Estado',
      opciones: [
        { valor: '', etiqueta: 'Todos' },
        { valor: 'Activo', etiqueta: 'Activo' },
        { valor: 'Inactivo', etiqueta: 'Inactivo' }
      ],
      valor: '',
      nombre: 'filtroEstado'
    }
  ];

  constructor(
    @Inject(UsuariosService) private usuariosService: UsuariosService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.cargarUsuarios();
  }

  ngOnInit() {
    this.actualizarOpcionesFiltros();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getUsuariosNoVecinos().subscribe({
      next: (usuarios) => {
        this.usuarios = Array.isArray(usuarios) ? usuarios : [];
        this.loading = false;
        console.log(`✅ [UsuariosStaff] Cargados ${this.usuarios.length} usuarios staff`);
      },
      error: (error) => {
        console.error('❌ [UsuariosStaff] Error al cargar usuarios:', error);
        this.loading = false;
        this.mostrarToast('Error al cargar usuarios', 'danger');
      }
    });
  }

  crearEncargado() {
    this.showCrearEncargadoModal = true;
    this.encargadoForm = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      zona: '',
      pais: 'Chile'
    };
  }

  cerrarCrearEncargadoModal() {
    this.showCrearEncargadoModal = false;
    this.creandoEncargado = false;
    this.encargadoForm = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      zona: '',
      pais: 'Chile'
    };
  }

  guardarEncargado() {
    if (!this.encargadoForm.nombre || !this.encargadoForm.apellido || !this.encargadoForm.email || !this.encargadoForm.password) {
      this.mostrarToast('Nombre, apellido, email y contraseña son obligatorios', 'warning');
      return;
    }

    this.creandoEncargado = true;
    this.usuariosService.registrarEncargado(this.encargadoForm).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosStaff] Encargado creado:', response);
        this.mostrarToast('Encargado creado exitosamente', 'success');
        this.cerrarCrearEncargadoModal();
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ [UsuariosStaff] Error al crear encargado:', error);
        this.mostrarToast('Error al crear encargado: ' + (error.error?.error || error.message), 'danger');
        this.creandoEncargado = false;
      }
    });
  }

  editarUsuario(usuario: any) {
    this.usuarioEditando = { ...usuario };
    // No permitir editar la contraseña desde aquí
    delete this.usuarioEditando.password;
    this.showEditarUsuarioModal = true;
  }

  cerrarEditarUsuarioModal() {
    this.showEditarUsuarioModal = false;
    this.guardandoCambios = false;
    this.usuarioEditando = {};
  }

  guardarCambiosUsuario() {
    if (!this.usuarioEditando.nombre || !this.usuarioEditando.apellido || !this.usuarioEditando.email) {
      this.mostrarToast('Nombre, apellido y email son obligatorios', 'warning');
      return;
    }

    this.guardandoCambios = true;
    this.usuariosService.actualizarUsuario(this.usuarioEditando._id, this.usuarioEditando).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosStaff] Usuario actualizado:', response);
        this.mostrarToast('Usuario actualizado exitosamente', 'success');
        this.cerrarEditarUsuarioModal();
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ [UsuariosStaff] Error al actualizar usuario:', error);
        this.mostrarToast('Error al actualizar usuario: ' + (error.error?.error || error.message), 'danger');
        this.guardandoCambios = false;
      }
    });
  }

  async eliminarUsuario(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.ejecutarEliminacion(usuario);
          }
        }
      ]
    });

    await alert.present();
  }

  private ejecutarEliminacion(usuario: any) {
    this.usuariosService.eliminarUsuario(usuario._id).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosStaff] Usuario eliminado:', response);
        this.mostrarToast('Usuario eliminado exitosamente', 'success');
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ [UsuariosStaff] Error al eliminar usuario:', error);
        this.mostrarToast('Error al eliminar usuario: ' + (error.error?.error || error.message), 'danger');
      }
    });
  }

  verHistorial(usuario: any) {
    this.router.navigate(['/administrador/usuarios/historial', usuario._id]);
  }

  async toggleEstado(usuario: any) {
    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Está seguro de que desea ${accion} al usuario ${usuario.nombre} ${usuario.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: accion.charAt(0).toUpperCase() + accion.slice(1),
          handler: () => {
            this.ejecutarCambioEstado(usuario, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  private ejecutarCambioEstado(usuario: any, nuevoEstado: boolean) {
    this.usuariosService.cambiarEstadoUsuario(usuario._id, nuevoEstado).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosStaff] Estado cambiado:', response);
        this.mostrarToast(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`, 'success');
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('❌ [UsuariosStaff] Error al cambiar estado:', error);
        this.mostrarToast('Error al cambiar estado: ' + (error.error?.error || error.message), 'danger');
      }
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroRol = '';
    this.filtroEstado = '';
    this.filtrosConfig.forEach(filtro => {
      filtro.valor = '';
    });
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(usuario => {
      const cumpleNombre = !this.filtroNombre || 
        usuario.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      const cumpleRol = !this.filtroRol || usuario.rol === this.filtroRol;
      
      const cumpleEstado = !this.filtroEstado || 
        (this.filtroEstado === 'Activo' && usuario.activo) ||
        (this.filtroEstado === 'Inactivo' && !usuario.activo);
      
      return cumpleNombre && cumpleRol && cumpleEstado;
    });
  }

  get estadisticas() {
    return {
      total: this.usuarios.length,
      encargados: this.usuarios.filter(u => u.rol === 'encargado').length,
      administradores: this.usuarios.filter(u => u.rol === 'administrador').length,
      activos: this.usuarios.filter(u => u.activo).length,
      inactivos: this.usuarios.filter(u => !u.activo).length
    };
  }

  getAvatarClass(rol: string): string {
    switch (rol) {
      case 'vecino': return 'avatar-vecino';
      case 'encargado': return 'avatar-encargado';
      case 'administrador': return 'avatar-admin';
      default: return 'avatar-default';
    }
  }

  getIniciales(nombre: string, apellido: string): string {
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicialNombre + inicialApellido;
  }

  getRolBadgeClass(rol: string): string {
    switch (rol) {
      case 'vecino': return 'badge-vecino';
      case 'encargado': return 'badge-encargado';
      case 'administrador': return 'badge-admin';
      default: return 'badge-default';
    }
  }

  private actualizarOpcionesFiltros() {
    // Aquí se pueden agregar más opciones si es necesario
  }

  onFiltroChange(evento: { nombre: string; valor: any }) {
    switch (evento.nombre) {
      case 'filtroNombre':
        this.filtroNombre = evento.valor;
        break;
      case 'filtroRol':
        this.filtroRol = evento.valor;
        break;
      case 'filtroEstado':
        this.filtroEstado = evento.valor;
        break;
    }
  }

  onLimpiarFiltros() {
    this.limpiarFiltros();
  }

  aplicarFiltros() {
    // Los filtros se aplican automáticamente a través del getter usuariosFiltrados
  }

  private async mostrarToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  obtenerRolDisplay(rol: string): string {
    switch (rol) {
      case 'vecino': return 'Vecino';
      case 'encargado': return 'Encargado';
      case 'administrador': return 'Administrador';
      default: return rol;
    }
  }
}
