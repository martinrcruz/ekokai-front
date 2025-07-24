import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-gestion',
  templateUrl: './usuarios-gestion.component.html',
  styleUrls: ['./usuarios-gestion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgChartsModule, FormsModule]
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

  constructor(private usuariosService: UsuariosService, private router: Router) {}

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
  eliminarUsuario(usuario: any) {
    console.log('Eliminar usuario:', usuario);
    if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      this.usuariosService.eliminarUsuario(usuario._id).subscribe({
        next: () => {
          console.log('Usuario eliminado correctamente');
          this.cargarUsuarios();
        },
        error: (err: any) => {
          console.error('Error al eliminar usuario', err);
        }
      });
    }
  }

  verHistorial(usuario: any) {
    this.router.navigate(['/usuarios/historial', usuario._id]);
  }

  toggleEstado(usuario: any) {
    console.log('Cambiar estado de usuario:', usuario);
    // Aquí puedes implementar el cambio de estado si tu backend lo soporta
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

}
