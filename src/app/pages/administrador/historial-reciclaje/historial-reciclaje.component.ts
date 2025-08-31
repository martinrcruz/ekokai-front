import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EntregaResiduo, EntregaResiduoService } from 'src/app/services/entrega-residuo.service';
import { FiltrosEstandarizadosComponent, FiltroConfig } from '../../../shared/components/global-filter/filtros-estandarizados.component';


@Component({
  selector: 'app-historial-reciclaje',
  templateUrl: './historial-reciclaje.component.html',
  styleUrls: ['./historial-reciclaje.component.scss'],
  standalone: false
})
export class HistorialReciclajeComponent implements OnInit {
  historial: EntregaResiduo[] = [];
  historialFiltrado: EntregaResiduo[] = [];
  loading = false;
  estadisticas: any = {};
  error: string | null = null;
  
  // Filtros
  filtroUsuario = '';
  filtroEcopunto = '';
  filtroTipoResiduo = '';
  filtroEstado = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 20;
  
  // Estados
  pestanaActiva = 'historial'; // 'historial' | 'estadisticas'
  showFiltros = false;
  showDetalleModal = false;
  entregaSeleccionada: EntregaResiduo | null = null;

  // Configuración de filtros estandarizados
  filtrosConfig: FiltroConfig[] = [
    {
      tipo: 'texto',
      icono: 'bi-person',
      titulo: 'Usuario',
      placeholder: 'ID o nombre del usuario',
      valor: '',
      nombre: 'usuario'
    },
    {
      tipo: 'texto',
      icono: 'bi-location',
      titulo: 'Ecopunto',
      placeholder: 'ID o nombre del ecopunto',
      valor: '',
      nombre: 'ecopunto'
    },
    {
      tipo: 'texto',
      icono: 'bi-leaf',
      titulo: 'Tipo de Residuo',
      placeholder: 'Tipo de residuo',
      valor: '',
      nombre: 'tipoResiduo'
    },
    {
      tipo: 'fecha',
      icono: 'bi-calendar',
      titulo: 'Fecha desde',
      placeholder: 'Seleccionar fecha',
      valor: '',
      nombre: 'fechaDesde'
    },
    {
      tipo: 'fecha',
      icono: 'bi-calendar',
      titulo: 'Fecha hasta',
      placeholder: 'Seleccionar fecha',
      valor: '',
      nombre: 'fechaHasta'
    }
  ];

  constructor(private entregaService: EntregaResiduoService) {}

  ngOnInit() {
    this.cargarHistorial();
    this.cargarEstadisticas();
    
    // Actualizar las opciones de filtros
    this.actualizarOpcionesFiltros();
  }

  async cargarHistorial() {
    this.loading = true;
    this.error = null;
    try {
      const filtros: any = {};
      
      if (this.filtroUsuario) filtros.usuarioId = this.filtroUsuario;
      if (this.filtroEcopunto) filtros.ecopuntoId = this.filtroEcopunto;
      if (this.filtroTipoResiduo) filtros.tipoResiduoId = this.filtroTipoResiduo;
      if (this.filtroEstado) filtros.estado = this.filtroEstado;
      if (this.filtroFechaDesde) filtros.fechaDesde = this.filtroFechaDesde;
      if (this.filtroFechaHasta) filtros.fechaHasta = this.filtroFechaHasta;

      const response = await this.entregaService.obtenerHistorialCompleto(filtros).toPromise();
      if (response?.ok) {
        this.historial = response.historial;
        this.aplicarFiltros();
        console.log('Historial cargado:', this.historial.length, 'entregas');
        console.log('Estadísticas calculadas:', {
          kilosTotales: this.getKilosTotales(),
          usuariosUnicos: this.getUsuariosUnicos(),
          ecopuntosUnicos: this.getEcopuntosUnicos(),
          entregasCompletadas: this.getEntregasCompletadas()
        });
      } else {
        this.error = 'No se pudo cargar el historial';
        console.warn('Respuesta de historial no válida:', response);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      
      // Determinar el tipo de error para mostrar un mensaje más específico
      if (error && typeof error === 'object' && 'status' in error) {
        const httpError = error as { status: number };
        if (httpError.status === 0) {
          this.error = 'No se puede conectar con el servidor. Verifique que el backend esté ejecutándose.';
        } else if (httpError.status === 401) {
          this.error = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        } else if (httpError.status === 403) {
          this.error = 'No tiene permisos para acceder a esta información.';
        } else if (httpError.status === 500) {
          this.error = 'Error interno del servidor. Intente nuevamente más tarde.';
        } else {
          this.error = 'Error al cargar el historial. Verifique su conexión e intente nuevamente.';
        }
      } else {
        this.error = 'Error al cargar el historial. Verifique su conexión e intente nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }

  async cargarEstadisticas() {
    try {
      console.log('🔄 Cargando estadísticas desde API...');
      const response = await this.entregaService.obtenerEstadisticas().toPromise();
      if (response?.ok) {
        this.estadisticas = response.estadisticas;
        console.log('✅ Estadísticas cargadas desde API:', this.estadisticas);
      } else {
        console.warn('⚠️ Respuesta de estadísticas no válida:', response);
      }
    } catch (error) {
      console.error('❌ Error al cargar estadísticas desde API:', error);
      // Fallback: usar estadísticas calculadas del historial local
      console.log('🔄 Usando estadísticas calculadas del historial local...');
    }
  }

  // Método para verificar conectividad del backend
  async verificarConectividad() {
    try {
      // Intentar hacer una petición simple para verificar conectividad
      const response = await this.entregaService.obtenerHistorialCompleto({}).toPromise();
      return true;
    } catch (error) {
      console.error('Error de conectividad:', error);
      return false;
    }
  }

  // Método para refrescar estadísticas
  async refrescarEstadisticas() {
    await this.cargarHistorial();
    await this.cargarEstadisticas();
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
    }
  }

  // aplicarFiltros() {
  //   this.historialFiltrado = [...this.historial];
  //   this.paginaActual = 1;
  //   this.error = null; // Clear any previous errors
  // }

  // limpiarFiltros() {
  //   this.filtroUsuario = '';
  //   this.filtroEcopunto = '';
  //   this.filtroTipoResiduo = '';
  //   this.filtroEstado = '';
  //   this.filtroFechaDesde = '';
  //   this.filtroFechaHasta = '';
  //   this.aplicarFiltros();
  // }

  get historialPaginado() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.historialFiltrado.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.historialFiltrado.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completado': return 'success';
      case 'pendiente': return 'warning';
      case 'rechazado': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'pendiente': return 'Pendiente';
      case 'rechazado': return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  formatearFecha(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearPeso(peso: number): string {
    return this.formatearPesoConDecimales(peso);
  }

  exportarHistorial() {
    // Implementar exportación a CSV/Excel
    console.log('Exportando historial...');
  }

  // Métodos para estadísticas
  getKilosTotales(): number {
    if (!this.historialFiltrado || this.historialFiltrado.length === 0) return 0;
    const total = this.historialFiltrado.reduce((total, entrega) => total + (entrega.pesoKg || 0), 0);
    return this.formatearDecimales(total, 3);
  }

  // Método para formatear decimales
  formatearDecimales(numero: number, decimales: number = 3): number {
    return Number(numero.toFixed(decimales));
  }

  // Método para formatear peso con 3 decimales
  formatearPesoConDecimales(peso: number): string {
    return `${this.formatearDecimales(peso, 3)} kg`;
  }

  // Método para formatear kilos del header
  getKilosTotalesFormateados(): string {
    const kilos = this.getKilosTotales();
    return this.formatearDecimales(kilos, 3).toString();
  }

  getUsuariosUnicos(): number {
    if (!this.historialFiltrado || this.historialFiltrado.length === 0) return 0;
    const usuariosUnicos = new Set(this.historialFiltrado.map(e => e.usuario?._id).filter(Boolean));
    return usuariosUnicos.size;
  }

  getEcopuntosUnicos(): number {
    if (!this.historialFiltrado || this.historialFiltrado.length === 0) return 0;
    const ecopuntosUnicos = new Set(this.historialFiltrado.map(e => e.ecopunto?._id).filter(Boolean));
    return ecopuntosUnicos.size;
  }

  getEntregasCompletadas(): number {
    if (!this.historialFiltrado || this.historialFiltrado.length === 0) return 0;
    return this.historialFiltrado.filter(e => e.estado === 'completado').length;
  }

  // Métodos para estado
  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'completado': return 'checkmark-circle';
      case 'pendiente': return 'time';
      case 'rechazado': return 'close-circle';
      default: return 'help-circle';
    }
  }

  getEstadoText(estado: string): string {
    return this.getEstadoTexto(estado);
  }

  // Métodos para top usuarios
  getTopUsuarios(): any[] {
    if (!this.historialFiltrado || this.historialFiltrado.length === 0) return [];
    
    const usuariosMap = new Map<string, { nombre: string, totalKilos: number }>();
    
    this.historialFiltrado.forEach(entrega => {
      if (!entrega.usuario?._id) return; // Skip if no user ID
      
      const usuarioId = entrega.usuario._id;
      const nombre = entrega.usuario?.nombre || 'Usuario Desconocido';
      const kilos = entrega.pesoKg || 0;
      
      if (usuariosMap.has(usuarioId)) {
        usuariosMap.get(usuarioId)!.totalKilos += kilos;
      } else {
        usuariosMap.set(usuarioId, { nombre, totalKilos: kilos });
      }
    });
    
    return Array.from(usuariosMap.values())
      .map(usuario => ({
        ...usuario,
        totalKilos: this.formatearDecimales(usuario.totalKilos, 3)
      }))
      .sort((a, b) => b.totalKilos - a.totalKilos)
      .slice(0, 10);
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return 'trophy';
    if (rank === 2) return 'medal';
    if (rank === 3) return 'ribbon';
    return 'star';
  }

  // Métodos para acciones
  verDetalle(entrega: EntregaResiduo) {
    this.entregaSeleccionada = entrega;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.entregaSeleccionada = null;
  }

  editarEntrega(entrega: EntregaResiduo) {
    console.log('Editar entrega:', entrega);
    // Implementar modal de edición
    this.cerrarDetalleModal();
  }

  eliminarEntrega(entrega: EntregaResiduo) {
    console.log('Eliminar entrega:', entrega);
    // Implementar confirmación y eliminación
  }

  // Configuración para gráficos
  lineChartType: any = 'line';
  lineChartData: any = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55],
      label: 'KG Reciclados',
      borderColor: 'rgba(76,175,80,1)',
      backgroundColor: 'rgba(76,175,80,0.1)',
      tension: 0.4
    }]
  };
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  private actualizarOpcionesFiltros() {
    // Aquí se pueden agregar más opciones si es necesario
  }

  onFiltroChange(evento: any) {
    switch (evento.nombre) {
      case 'usuario':
        this.filtroUsuario = evento.valor;
        break;
      case 'ecopunto':
        this.filtroEcopunto = evento.valor;
        break;
      case 'tipoResiduo':
        this.filtroTipoResiduo = evento.valor;
        break;
      case 'fechaDesde':
        this.filtroFechaDesde = evento.valor;
        break;
      case 'fechaHasta':
        this.filtroFechaHasta = evento.valor;
        break;
    }
    this.aplicarFiltros();
  }

  onLimpiarFiltros() {
    this.limpiarFiltros();
  }

  aplicarFiltros() {
    // Aplicar filtros al historial
    this.historialFiltrado = this.historial.filter(entrega => {
      const usuarioMatch = !this.filtroUsuario ||
        entrega.usuario?.nombre?.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      const ecopuntoMatch = !this.filtroEcopunto ||
        entrega.ecopunto?.nombre?.toLowerCase().includes(this.filtroEcopunto.toLowerCase());
      const tipoResiduoMatch = !this.filtroTipoResiduo ||
        entrega.tipoResiduo?.nombre?.toLowerCase().includes(this.filtroTipoResiduo.toLowerCase());
      const fechaDesdeMatch = !this.filtroFechaDesde ||
        new Date(entrega.fecha) >= new Date(this.filtroFechaDesde);
      const fechaHastaMatch = !this.filtroFechaHasta ||
        new Date(entrega.fecha) <= new Date(this.filtroFechaHasta);
      
      return usuarioMatch && ecopuntoMatch && tipoResiduoMatch && fechaDesdeMatch && fechaHastaMatch;
    });
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroEcopunto = '';
    this.filtroTipoResiduo = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    
    // Resetear valores en la configuración de filtros
    if (this.filtrosConfig) {
      this.filtrosConfig.forEach(filtro => {
        filtro.valor = '';
      });
    }
    
    this.aplicarFiltros();
  }
}

