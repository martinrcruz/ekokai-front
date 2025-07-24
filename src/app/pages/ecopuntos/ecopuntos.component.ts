import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { EcopuntosService } from 'src/app/services/ecopuntos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-ecopuntos',
  templateUrl: './ecopuntos.component.html',
  styleUrls: ['./ecopuntos.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgChartsModule, FormsModule]
})
export class EcopuntosComponent implements OnInit {
  ecopuntos: any[] = [];
  encargados: any[] = [];
  loading = false;
  saving = false;
  filtroNombre = '';
  filtroZona = '';
  zonas: string[] = [];
  
  // Modal de creación
  showCreateModal = false;
  nuevoEcopunto = {
    nombre: '',
    direccion: '',
    zona: '',
    horarioApertura: '08:00',
    horarioCierre: '20:00',
    capacidadMaxima: 1000,
    descripcion: ''
  };

  // Modal de enrolamiento
  showEnrolarModal = false;
  ecopuntoSeleccionado: any = null;
  encargadoSeleccionado: string = '';
  enrolando = false;

  // Modal de edición
  showEditModal = false;
  ecopuntoEditando: any = null;
  editando = false;

  // Gráfico de rendimiento por ecopunto
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Kg por ecopunto', backgroundColor: '#4CAF50' }
    ]
  };

  showDetalleModal = false;
  ecopuntoDetalle: any = null;

  constructor(
    private ecopuntosService: EcopuntosService,
    private usuariosService: UsuariosService,
    private estadisticasService: EstadisticasService
  ) {}

  ngOnInit() {
    this.cargarEcopuntos();
    this.cargarEncargados();
  }

  cargarEcopuntos() {
    this.loading = true;
    this.ecopuntosService.getEcopuntos().subscribe({
      next: (ecopuntos) => {
        console.log('[Ecopuntos] Datos recibidos:', ecopuntos);
        this.ecopuntos = Array.isArray(ecopuntos) ? ecopuntos : [];
        
        // Extraer zonas únicas
        this.zonas = [...new Set(this.ecopuntos.map(e => e.zona || 'Sin zona'))];
        
        // Preparar datos para gráfico
        const ecopuntosTop = this.ecopuntos
          .sort((a, b) => (b.kilosMes || 0) - (a.kilosMes || 0))
          .slice(0, 10);
        
        this.barChartData.labels = ecopuntosTop.map(e => e.nombre);
        this.barChartData.datasets[0].data = ecopuntosTop.map(e => e.kilosMes || 0);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('[Ecopuntos] Error al cargar:', error);
        this.ecopuntos = [];
        this.zonas = [];
        this.loading = false;
        this.loading = false;
      }
    });
  }

  cargarEncargados() {
    this.usuariosService.getEncargados().subscribe({
      next: (encargados) => {
        console.log('[Ecopuntos] Encargados cargados:', encargados);
        this.encargados = encargados;
      },
      error: (error) => {
        console.error('[Ecopuntos] Error al cargar encargados:', error);
      }
    });
  }

  crearEcopunto() {
    this.showCreateModal = true;
  }

  guardarEcopunto() {
    if (this.validarFormulario()) {
      console.log('Guardando ecopunto:', this.nuevoEcopunto);
      
      this.saving = true; // Activar loading
      
      // Enviar al backend
      this.ecopuntosService.crearEcopunto(this.nuevoEcopunto).subscribe({
        next: (ecopuntoCreado) => {
          console.log('[Ecopuntos] Ecopunto creado exitosamente:', ecopuntoCreado);
          
          // Agregar a la lista local
          this.ecopuntos.unshift(ecopuntoCreado);
          
          // Cerrar modal y recargar datos
          this.cerrarModal();
          this.cargarEcopuntos();
          this.saving = false; // Desactivar loading
        },
        error: (error) => {
          console.error('[Ecopuntos] Error al crear ecopunto:', error);
          this.saving = false; // Desactivar loading
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.nuevoEcopunto.nombre.trim()) {
      console.error('El nombre es obligatorio');
      return false;
    }
    if (!this.nuevoEcopunto.direccion.trim()) {
      console.error('La dirección es obligatoria');
      return false;
    }
    return true;
  }

  cerrarModal() {
    this.showCreateModal = false;
    // Resetear formulario
    this.nuevoEcopunto = {
      nombre: '',
      direccion: '',
      zona: '',
      horarioApertura: '08:00',
      horarioCierre: '20:00',
      capacidadMaxima: 1000,
      descripcion: ''
    };
  }

  // Funcionalidad de enrolamiento
  abrirModalEnrolar(ecopunto: any) {
    this.ecopuntoSeleccionado = ecopunto;
    this.encargadoSeleccionado = '';
    this.showEnrolarModal = true;
  }

  cerrarModalEnrolar() {
    this.showEnrolarModal = false;
    this.ecopuntoSeleccionado = null;
    this.encargadoSeleccionado = '';
  }

  enrolarEncargado() {
    if (!this.encargadoSeleccionado) {
      console.error('Debe seleccionar un encargado');
      return;
    }

    this.enrolando = true;
    
    this.ecopuntosService.enrolarEncargado(
      this.ecopuntoSeleccionado._id, 
      this.encargadoSeleccionado
    ).subscribe({
      next: (response) => {
        console.log('[Ecopuntos] Encargado enrolado exitosamente:', response);
        
        // Actualizar el ecopunto en la lista local
        const index = this.ecopuntos.findIndex(e => e._id === this.ecopuntoSeleccionado._id);
        if (index !== -1) {
          this.ecopuntos[index] = { ...this.ecopuntos[index], ...response };
        }
        
        this.cerrarModalEnrolar();
        this.cargarEcopuntos(); // Recargar para obtener datos actualizados
        this.enrolando = false;
        
        // Mostrar mensaje de éxito
        this.mostrarMensajeExito();
      },
      error: (error) => {
        console.error('[Ecopuntos] Error al enrolar encargado:', error);
        this.enrolando = false;
      }
    });
  }

  async mostrarMensajeExito(mensaje: string = '¡Encargado enrolado exitosamente!') {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 3000;
    toast.color = 'success';
    toast.position = 'top';
    
    document.body.appendChild(toast);
    await toast.present();
    
    const { role } = await toast.onDidDismiss();
    if (role === 'confirm') {
      console.log('Toast confirmado');
    }
  }

  async mostrarMensajeError(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 3000;
    toast.color = 'danger';
    toast.position = 'top';
    
    document.body.appendChild(toast);
    await toast.present();
    
    const { role } = await toast.onDidDismiss();
    if (role === 'confirm') {
      console.log('Toast confirmado');
    }
  }

  getEncargadosDisponibles() {
    return this.encargados.filter(encargado => !encargado.ecopuntoId);
  }

  editarEcopunto(ecopunto: any) {
    console.log('Editar ecopunto:', ecopunto);
    this.ecopuntoEditando = { ...ecopunto };
    this.showEditModal = true;
  }

  cerrarModalEdicion() {
    this.showEditModal = false;
    this.ecopuntoEditando = null;
    this.editando = false;
  }

  guardarEdicion() {
    if (!this.validarFormularioEdicion()) {
      return;
    }

    this.editando = true;
    
    this.ecopuntosService.actualizarEcopunto(
      this.ecopuntoEditando._id, 
      this.ecopuntoEditando
    ).subscribe({
      next: (response) => {
        console.log('[Ecopuntos] Ecopunto actualizado exitosamente:', response);
        
        // Actualizar el ecopunto en la lista local
        const index = this.ecopuntos.findIndex(e => e._id === this.ecopuntoEditando._id);
        if (index !== -1) {
          this.ecopuntos[index] = { ...this.ecopuntos[index], ...response };
        }
        
        this.cerrarModalEdicion();
        this.cargarEcopuntos(); // Recargar para obtener datos actualizados
        
        // Mostrar mensaje de éxito
        this.mostrarMensajeExito('¡Ecopunto actualizado exitosamente!');
      },
      error: (error) => {
        console.error('[Ecopuntos] Error al actualizar ecopunto:', error);
        this.editando = false;
        this.mostrarMensajeError('Error al actualizar ecopunto');
      }
    });
  }

  validarFormularioEdicion(): boolean {
    if (!this.ecopuntoEditando.nombre || !this.ecopuntoEditando.direccion || !this.ecopuntoEditando.zona) {
      this.mostrarMensajeError('Por favor complete todos los campos requeridos');
      return false;
    }
    return true;
  }

  eliminarEcopunto(ecopunto: any) {
    console.log('Eliminar ecopunto:', ecopunto);
    
    // Mostrar confirmación
    if (confirm(`¿Está seguro que desea eliminar el ecopunto "${ecopunto.nombre}"? Esta acción no se puede deshacer.`)) {
      this.ecopuntosService.eliminarEcopunto(ecopunto._id).subscribe({
        next: (response) => {
          console.log('[Ecopuntos] Ecopunto eliminado exitosamente:', response);
          
          // Remover el ecopunto de la lista local
          this.ecopuntos = this.ecopuntos.filter(e => e._id !== ecopunto._id);
          
          // Mostrar mensaje de éxito
          this.mostrarMensajeExito('¡Ecopunto eliminado exitosamente!');
        },
        error: (error) => {
          console.error('[Ecopuntos] Error al eliminar ecopunto:', error);
          this.mostrarMensajeError('Error al eliminar ecopunto');
        }
      });
    }
  }

  verMetricas(ecopunto: any) {
    this.ecopuntoDetalle = ecopunto;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.ecopuntoDetalle = null;
  }

  get ecopuntosFiltrados() {
    if (!this.ecopuntos || !Array.isArray(this.ecopuntos)) {
      return [];
    }
    return this.ecopuntos.filter(ecopunto => {
      const nombreMatch = !this.filtroNombre || 
        ecopunto.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const zonaMatch = !this.filtroZona || 
        (ecopunto.zona || 'Sin zona') === this.filtroZona;
      return nombreMatch && zonaMatch;
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroZona = '';
  }
} 