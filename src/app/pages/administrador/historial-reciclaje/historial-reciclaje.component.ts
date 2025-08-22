import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EntregaResiduo, EntregaResiduoService } from 'src/app/services/entrega-residuo.service';



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

  constructor(private entregaService: EntregaResiduoService) {}

  ngOnInit() {
    this.cargarHistorial();
    this.cargarEstadisticas();
  }

  async cargarHistorial() {
    this.loading = true;
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
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      this.loading = false;
    }
  }

  async cargarEstadisticas() {
    try {
      const response = await this.entregaService.obtenerEstadisticas().toPromise();
      if (response?.ok) {
        this.estadisticas = response.estadisticas;
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
    }
  }

  aplicarFiltros() {
    this.historialFiltrado = [...this.historial];
    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroEcopunto = '';
    this.filtroTipoResiduo = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.aplicarFiltros();
  }

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
    return `${peso.toFixed(2)} kg`;
  }

  exportarHistorial() {
    // Implementar exportación a CSV/Excel
    console.log('Exportando historial...');
  }

  // Métodos para estadísticas
  getKilosTotales(): number {
    return this.historialFiltrado.reduce((total, entrega) => total + (entrega.pesoKg || 0), 0);
  }

  getUsuariosUnicos(): number {
    const usuariosUnicos = new Set(this.historialFiltrado.map(e => e.usuario._id));
    return usuariosUnicos.size;
  }

  getEcopuntosUnicos(): number {
    const ecopuntosUnicos = new Set(this.historialFiltrado.map(e => e.ecopunto._id));
    return ecopuntosUnicos.size;
  }

  getEntregasCompletadas(): number {
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
    const usuariosMap = new Map<string, { nombre: string, totalKilos: number }>();
    
    this.historialFiltrado.forEach(entrega => {
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
    console.log('Ver detalle de entrega:', entrega);
    // Implementar modal de detalle
  }

  editarEntrega(entrega: EntregaResiduo) {
    console.log('Editar entrega:', entrega);
    // Implementar modal de edición
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
}
