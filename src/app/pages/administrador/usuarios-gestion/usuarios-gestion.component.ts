import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios-gestion',
  templateUrl: './usuarios-gestion.component.html',
  styleUrls: ['./usuarios-gestion.component.scss'],
  standalone: false
})
export class UsuariosGestionComponent implements OnInit {
  usuarios: any[] = [];
  loading = false;
  filtroNombre = '';
  filtroRol = '';
  filtroEstado = '';
  roles: string[] = [];
  estados: string[] = ['Activo', 'Inactivo'];

  // Modal y formulario para crear encargado
  showCrearEncargadoModal = false;
  encargadoForm = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    telefono: ''
  };
  creandoEncargado = false;

  // Modal y formulario para crear vecino
  showCrearVecinoModal = false;
  vecinoForm = {
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: ''
  };
  creandoVecino = false;

  // ✅ Modal y formulario para editar usuario
  showEditarUsuarioModal = false;
  usuarioEditando: any = {};
  guardandoCambios = false;

  // Gráfico de usuarios por rol
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#222', font: { size: 14, weight: 'bold' } } },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const dataArr = context.dataset.data as number[];
            const total = dataArr.reduce((a, b) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} usuarios (${percent}%)`;
          }
        }
      }
    }
  };
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#FF6B35', '#3498db', '#9b59b6', '#e74c3c', '#fbc02d', '#00bcd4'],
        label: 'Usuarios por rol'
      }
    ]
  };

  // Gráfico de usuarios top
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.x} kg`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#222', font: { size: 13 } },
        grid: { color: '#e0e0e0' }
      },
      y: {
        ticks: { color: '#222', font: { size: 13 } },
        grid: { color: '#e0e0e0' }
      }
    }
  };
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Kg reciclados', backgroundColor: '#2E7D32', borderRadius: 8, barThickness: 18 }
    ]
  };

  constructor(
    private usuariosService: UsuariosService, 
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.cargarUsuarios();
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      console.log('[Usuarios Gestión] Datos recibidos:', usuarios);
      this.usuarios = usuarios;

      this.roles = [...new Set(usuarios.map(u => u.rol || 'Sin rol'))];

      const rolesCount = this.roles.map(rol =>
        usuarios.filter(u => (u.rol || 'Sin rol') === rol).length
      );

      this.pieChartData.labels = this.roles;
      this.pieChartData.datasets[0].data = rolesCount;

      const usuariosTop = usuarios
        .sort((a, b) => (b.kilosTotal || 0) - (a.kilosTotal || 0))
        .slice(0, 10);

      this.barChartData.labels = usuariosTop.map(u => `${u.nombre} ${u.apellido}`);
      this.barChartData.datasets[0].data = usuariosTop.map(u => u.kilosTotal || 0);

      this.loading = false;
    });
  }

  crearUsuario(tipo: 'vecino' | 'encargado') {
    if (tipo === 'vecino') {
      this.showCrearVecinoModal = true;
    } else if (tipo === 'encargado') {
      this.showCrearEncargadoModal = true;
    }
  }

  cerrarCrearEncargadoModal() {
    this.showCrearEncargadoModal = false;
    this.encargadoForm = {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      password: '',
      telefono: ''
    };
  }

  cerrarCrearVecinoModal() {
    this.showCrearVecinoModal = false;
    this.vecinoForm = {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: ''
    };
  }

  guardarEncargado() {
    if (!this.encargadoForm.nombre.trim() || !this.encargadoForm.apellido.trim() || !this.encargadoForm.dni.trim() || !this.encargadoForm.email.trim() || !this.encargadoForm.password.trim() || !this.encargadoForm.telefono.trim()) {
      alert('Completa todos los campos');
      return;
    }
    this.creandoEncargado = true;
    this.usuariosService.registrarEncargado(this.encargadoForm).subscribe({
      next: () => {
        this.creandoEncargado = false;
        this.cerrarCrearEncargadoModal();
        this.cargarUsuarios();
      },
      error: () => {
        this.creandoEncargado = false;
        alert('Error al crear encargado');
      }
    });
  }

  guardarVecino() {
    if (!this.vecinoForm.nombre.trim() || !this.vecinoForm.apellido.trim() || !this.vecinoForm.dni.trim() || !this.vecinoForm.email.trim() || !this.vecinoForm.telefono.trim()) {
      alert('Completa todos los campos');
      return;
    }
    this.creandoVecino = true;
    this.usuariosService.registrarVecino(this.vecinoForm).subscribe({
      next: () => {
        this.creandoVecino = false;
        this.cerrarCrearVecinoModal();
        this.cargarUsuarios();
      },
      error: () => {
        this.creandoVecino = false;
        alert('Error al crear vecino');
      }
    });
  }

  // ✅ Editar usuario
  editarUsuario(usuario: any) {
    console.log('Editar usuario:', usuario);
    this.usuariosService.obtenerUsuario(usuario._id).subscribe({
      next: (data: any) => {
        this.usuarioEditando = { ...data };
        this.showEditarUsuarioModal = true;
      },
      error: (err: any) => {
        console.error('Error al obtener usuario', err);
      }
    });
  }

  cerrarEditarUsuarioModal() {
    this.showEditarUsuarioModal = false;
    this.usuarioEditando = {};
  }

  guardarCambiosUsuario() {
    this.guardandoCambios = true;
    this.usuariosService.actualizarUsuario(this.usuarioEditando._id, this.usuarioEditando).subscribe({
      next: () => {
        this.guardandoCambios = false;
        this.cerrarEditarUsuarioModal();
        this.cargarUsuarios();
      },
      error: (err: any) => {
        this.guardandoCambios = false;
        console.error('Error al guardar cambios', err);
      }
    });
  }

  // ✅ Eliminar usuario
  async eliminarUsuario(usuario: any) {
    console.log('🗑️ Eliminando usuario:', usuario);
    const confirmacion = await this.presentAlert(usuario);
    
    if (confirmacion) {
      this.usuariosService.eliminarUsuario(usuario._id).subscribe({
        next: async () => {
          console.log('✅ Usuario eliminado correctamente');
          
          // Mostrar mensaje de éxito
          const toast = await this.toastController.create({
            message: `Usuario ${usuario.nombre} ${usuario.apellido} eliminado exitosamente`,
            duration: 3000,
            position: 'top',
            color: 'success',
            icon: 'checkmark-circle'
          });
          await toast.present();
          
          // Recargar lista de usuarios
          this.cargarUsuarios();
        },
        error: async (err: any) => {
          console.error('❌ Error al eliminar usuario', err);
          
          // Mostrar mensaje de error
          const toast = await this.toastController.create({
            message: 'Error al eliminar el usuario',
            duration: 3000,
            position: 'top',
            color: 'danger',
            icon: 'alert-circle'
          });
          await toast.present();
        }
      });
    }
  }

  verHistorial(usuario: any) {
    this.router.navigate(['/administrador/usuarios/historial', usuario._id]);
  }

  async toggleEstado(usuario: any) {
    console.log('🔄 Cambiando estado de usuario:', usuario);
    
    const nuevoEstado = !usuario.activo;
    const mensaje = `¿Estás seguro de ${nuevoEstado ? 'activar' : 'desactivar'} a ${usuario.nombre} ${usuario.apellido}?`;
    
    const alert = await this.alertController.create({
      header: 'Confirmar cambio de estado',
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: nuevoEstado ? 'Activar' : 'Desactivar',
          role: 'confirm',
          handler: () => {
            this.ejecutarCambioEstado(usuario, nuevoEstado);
          },
        },
      ],
    });
    
    await alert.present();
  }

  private ejecutarCambioEstado(usuario: any, nuevoEstado: boolean) {
    this.usuariosService.cambiarEstadoUsuario(usuario._id, nuevoEstado).subscribe({
      next: async (response) => {
        console.log('✅ Estado cambiado exitosamente:', response);
        
        // Actualizar el usuario en la lista local
        const index = this.usuarios.findIndex(u => u._id === usuario._id);
        if (index !== -1) {
          this.usuarios[index].activo = nuevoEstado;
        }
        
        // Mostrar mensaje de éxito
        const toast = await this.toastController.create({
          message: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
          duration: 3000,
          position: 'top',
          color: 'success',
          icon: nuevoEstado ? 'checkmark-circle' : 'pause-circle'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('❌ Error al cambiar estado:', error);
        
        const toast = await this.toastController.create({
          message: 'Error al cambiar el estado del usuario',
          duration: 3000,
          position: 'top',
          color: 'danger',
          icon: 'alert-circle'
        });
        await toast.present();
      }
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroRol = '';
    this.filtroEstado = '';
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(usuario => {
      const nombreMatch = !this.filtroNombre ||
        `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const rolMatch = !this.filtroRol ||
        (usuario.rol || 'Sin rol') === this.filtroRol;
      const estadoMatch = !this.filtroEstado ||
        (usuario.activo ? 'Activo' : 'Inactivo') === this.filtroEstado;
      return nombreMatch && rolMatch && estadoMatch;
    });
  }

  get estadisticas() {
    const total = this.usuarios.length;
    const activos = this.usuarios.filter(u => u.activo).length;
    const totalKilos = this.usuarios.reduce((sum, u) => sum + (u.kilosTotal || 0), 0);
    const totalTokens = this.usuarios.reduce((sum, u) => sum + (u.tokens || 0), 0);
    return { total, activos, totalKilos, totalTokens };
  }


  // 🔹 variables para la paginación
currentPage: number = 1;
itemsPerPage: number = 4;

// 👉 calcula el total de páginas dinámicamente
get totalPages(): number {
  return Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
}

// 👉 devuelve los usuarios de la página actual
get usuariosPaginados() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.usuariosFiltrados.slice(startIndex, endIndex);
}

// 👉 métodos para cambiar de página
irAPagina(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPages) {
    this.currentPage = pagina;
  }
}

paginaSiguiente() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

paginaAnterior() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

  async presentAlert(usuario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar permanentemente a ${usuario.nombre} ${usuario.apellido}?\n\nEsta acción no se puede deshacer y se perderán todos los datos del usuario.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'danger',
          handler: () => {
            return true;
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'destructive';
  }

  // Métodos para estadísticas y utilidades
  getUsuariosActivos(): number {
    return this.usuarios.filter(u => u.activo).length;
  }

  getTotalKilos(): number {
    return this.usuarios.reduce((total, usuario) => total + (usuario.kilosTotal || 0), 0);
  }

  getTotalTokens(): number {
    return this.usuarios.reduce((total, usuario) => total + (usuario.tokens || 0), 0);
  }

  getAvatarClass(rol: string): string {
    switch (rol) {
      case 'administrador':
        return 'avatar-administrador';
      case 'encargado':
        return 'avatar-encargado';
      case 'vecino':
        return 'avatar-vecino';
      default:
        return 'avatar-default';
    }
  }

  getIniciales(nombre: string, apellido: string): string {
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicialNombre + inicialApellido;
  }

  getRolBadgeClass(rol: string): string {
    switch (rol) {
      case 'administrador':
        return 'rol-admin';
      case 'encargado':
        return 'rol-encargado';
      case 'vecino':
        return 'rol-vecino';
      default:
        return 'rol-default';
    }
  }

}
