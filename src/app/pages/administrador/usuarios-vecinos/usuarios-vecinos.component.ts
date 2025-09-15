import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FiltroConfig } from 'src/app/shared/components/global-filter/filtros-estandarizados.component';

@Component({
  selector: 'app-usuarios-vecinos',
  templateUrl: './usuarios-vecinos.component.html',
  styleUrls: ['./usuarios-vecinos.component.scss'],
  standalone: false
})
export class UsuariosVecinosComponent implements OnInit {
  vecinos: any[] = [];
  loading = false;
  filtroNombre = '';
  filtroEstado = '';
  filtroTelefono = '';
  estados: string[] = ['Activo', 'Inactivo'];

  // Modal y formulario para crear vecino
  showCrearVecinoModal = false;
  vecinoForm = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: '',
    zona: '',
    pais: 'Chile'
  };
  creandoVecino = false;

  // Modal y formulario para editar vecino
  showEditarVecinoModal = false;
  vecinoEditando: any = {};
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
      tipo: 'texto',
      icono: 'bi-telephone',
      titulo: 'Buscar por teléfono',
      placeholder: 'Ingrese número de teléfono',
      valor: '',
      nombre: 'filtroTelefono'
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
    this.cargarVecinos();
  }

  ngOnInit() {
    this.actualizarOpcionesFiltros();
  }

  cargarVecinos() {
    this.loading = true;
    this.usuariosService.getVecinos().subscribe({
      next: (vecinos) => {
        this.vecinos = Array.isArray(vecinos) ? vecinos : [];
        this.loading = false;
        console.log(`✅ [UsuariosVecinos] Cargados ${this.vecinos.length} vecinos`);
      },
      error: (error) => {
        console.error('❌ [UsuariosVecinos] Error al cargar vecinos:', error);
        this.loading = false;
        this.mostrarToast('Error al cargar vecinos', 'danger');
      }
    });
  }

  crearVecino() {
    this.showCrearVecinoModal = true;
    this.vecinoForm = {
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      email: '',
      direccion: '',
      zona: '',
      pais: 'Chile'
    };
  }

  cerrarCrearVecinoModal() {
    this.showCrearVecinoModal = false;
    this.creandoVecino = false;
    this.vecinoForm = {
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      email: '',
      direccion: '',
      zona: '',
      pais: 'Chile'
    };
  }

  guardarVecino() {
    if (!this.vecinoForm.nombre || !this.vecinoForm.apellido || !this.vecinoForm.dni || !this.vecinoForm.telefono) {
      this.mostrarToast('Nombre, apellido, DNI y teléfono son obligatorios', 'warning');
      return;
    }

    this.creandoVecino = true;
    this.usuariosService.registrarVecino(this.vecinoForm).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosVecinos] Vecino creado:', response);
        this.mostrarToast('Vecino creado exitosamente', 'success');
        this.cerrarCrearVecinoModal();
        this.cargarVecinos();
      },
      error: (error) => {
        console.error('❌ [UsuariosVecinos] Error al crear vecino:', error);
        this.mostrarToast('Error al crear vecino: ' + (error.error?.error || error.message), 'danger');
        this.creandoVecino = false;
      }
    });
  }

  editarVecino(vecino: any) {
    this.vecinoEditando = { ...vecino };
    this.showEditarVecinoModal = true;
  }

  cerrarEditarVecinoModal() {
    this.showEditarVecinoModal = false;
    this.guardandoCambios = false;
    this.vecinoEditando = {};
  }

  guardarCambiosVecino() {
    if (!this.vecinoEditando.nombre || !this.vecinoEditando.apellido || !this.vecinoEditando.dni || !this.vecinoEditando.telefono) {
      this.mostrarToast('Nombre, apellido, DNI y teléfono son obligatorios', 'warning');
      return;
    }

    this.guardandoCambios = true;
    this.usuariosService.actualizarUsuario(this.vecinoEditando._id, this.vecinoEditando).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosVecinos] Vecino actualizado:', response);
        this.mostrarToast('Vecino actualizado exitosamente', 'success');
        this.cerrarEditarVecinoModal();
        this.cargarVecinos();
      },
      error: (error) => {
        console.error('❌ [UsuariosVecinos] Error al actualizar vecino:', error);
        this.mostrarToast('Error al actualizar vecino: ' + (error.error?.error || error.message), 'danger');
        this.guardandoCambios = false;
      }
    });
  }

  async eliminarVecino(vecino: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar al vecino ${vecino.nombre} ${vecino.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.ejecutarEliminacion(vecino);
          }
        }
      ]
    });

    await alert.present();
  }

  private ejecutarEliminacion(vecino: any) {
    this.usuariosService.eliminarUsuario(vecino._id).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosVecinos] Vecino eliminado:', response);
        this.mostrarToast('Vecino eliminado exitosamente', 'success');
        this.cargarVecinos();
      },
      error: (error) => {
        console.error('❌ [UsuariosVecinos] Error al eliminar vecino:', error);
        this.mostrarToast('Error al eliminar vecino: ' + (error.error?.error || error.message), 'danger');
      }
    });
  }

  verHistorial(vecino: any) {
    this.router.navigate(['/administrador/usuarios/historial', vecino._id]);
  }

  async toggleEstado(vecino: any) {
    const nuevoEstado = !vecino.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    const alert = await this.alertController.create({
      header: `Confirmar ${accion}`,
      message: `¿Está seguro de que desea ${accion} al vecino ${vecino.nombre} ${vecino.apellido}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: accion.charAt(0).toUpperCase() + accion.slice(1),
          handler: () => {
            this.ejecutarCambioEstado(vecino, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  private ejecutarCambioEstado(vecino: any, nuevoEstado: boolean) {
    this.usuariosService.cambiarEstadoUsuario(vecino._id, nuevoEstado).subscribe({
      next: (response) => {
        console.log('✅ [UsuariosVecinos] Estado cambiado:', response);
        this.mostrarToast(`Vecino ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`, 'success');
        this.cargarVecinos();
      },
      error: (error) => {
        console.error('❌ [UsuariosVecinos] Error al cambiar estado:', error);
        this.mostrarToast('Error al cambiar estado: ' + (error.error?.error || error.message), 'danger');
      }
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroEstado = '';
    this.filtroTelefono = '';
    this.filtrosConfig.forEach(filtro => {
      filtro.valor = '';
    });
  }

  get vecinosFiltrados() {
    return this.vecinos.filter(vecino => {
      const cumpleNombre = !this.filtroNombre || 
        vecino.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        vecino.apellido?.toLowerCase().includes(this.filtroNombre.toLowerCase());
      
      const cumpleTelefono = !this.filtroTelefono || 
        vecino.telefono?.includes(this.filtroTelefono);
      
      const cumpleEstado = !this.filtroEstado || 
        (this.filtroEstado === 'Activo' && vecino.activo) ||
        (this.filtroEstado === 'Inactivo' && !vecino.activo);
      
      return cumpleNombre && cumpleTelefono && cumpleEstado;
    });
  }

  get estadisticas() {
    return {
      total: this.vecinos.length,
      activos: this.vecinos.filter(v => v.activo).length,
      inactivos: this.vecinos.filter(v => !v.activo).length,
      totalTokens: this.vecinos.reduce((total, v) => total + (v.tokensAcumulados || 0), 0)
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
      case 'filtroTelefono':
        this.filtroTelefono = evento.valor;
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
    // Los filtros se aplican automáticamente a través del getter vecinosFiltrados
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
