import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CanjeService, CanjeReciclaje, CanjeRecompensa } from '../../../services/canje.service';
import { FiltrosEstandarizadosComponent, FiltroConfig } from '../../../shared/components/global-filter/filtros-estandarizados.component';

@Component({
  selector: 'app-historial-canjes',
  templateUrl: './historial-canjes.component.html',
  styleUrls: ['./historial-canjes.component.scss'],
  standalone: false
})
export class HistorialCanjesComponent implements OnInit {
  canjesReciclaje: CanjeReciclaje[] = [];
  canjesRecompensa: CanjeRecompensa[] = [];
  canjesFiltrados: any[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  filtroUsuario = '';
  filtroEstado = '';
  filtroTipoCanje = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 20;
  
  // Estados
  pestanaActiva = 'reciclaje'; // 'reciclaje' | 'recompensa' | 'todos'
  showFiltros = false;
  showDetalleModal = false;
  canjeSeleccionado: any = null;

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
      tipo: 'select',
      icono: 'bi-check-circle',
      titulo: 'Estado',
      placeholder: 'Seleccionar estado',
      valor: '',
      nombre: 'estado',
      opciones: [
        { valor: '', etiqueta: 'Todos los estados' },
        { valor: 'pendiente', etiqueta: 'Pendiente' },
        { valor: 'completado', etiqueta: 'Completado' },
        { valor: 'fallido', etiqueta: 'Fallido' },
        { valor: 'aprobado', etiqueta: 'Aprobado' },
        { valor: 'rechazado', etiqueta: 'Rechazado' }
      ]
    },
    {
      tipo: 'select',
      icono: 'bi-arrow-repeat',
      titulo: 'Tipo de Canje',
      placeholder: 'Seleccionar tipo',
      valor: '',
      nombre: 'tipoCanje',
      opciones: [
        { valor: '', etiqueta: 'Todos los tipos' },
        { valor: 'reciclaje', etiqueta: 'Reciclaje' },
        { valor: 'recompensa', etiqueta: 'Recompensa' }
      ]
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

  constructor(private canjeService: CanjeService) {}

  ngOnInit() {
    this.cargarHistorial();
    this.actualizarOpcionesFiltros();
  }

  async cargarHistorial() {
    this.loading = true;
    this.error = null;
    try {
      // Cargar canjes de reciclaje
      this.canjeService.obtenerHistorialCanjesReciclaje('').subscribe({
        next: (canjes) => {
          this.canjesReciclaje = canjes;
          this.aplicarFiltros();
          console.log('Canjes de reciclaje cargados:', this.canjesReciclaje.length);
        },
        error: (error) => {
          console.error('Error al cargar canjes de reciclaje:', error);
          this.error = 'Error al cargar canjes de reciclaje';
        }
      });

      // Cargar canjes de recompensa
      this.canjeService.obtenerHistorialCanjesRecompensa('').subscribe({
        next: (canjes) => {
          this.canjesRecompensa = canjes;
          this.aplicarFiltros();
          console.log('Canjes de recompensa cargados:', this.canjesRecompensa.length);
        },
        error: (error) => {
          console.error('Error al cargar canjes de recompensa:', error);
          this.error = 'Error al cargar canjes de recompensa';
        }
      });

    } catch (error) {
      console.error('Error al cargar historial:', error);
      this.error = 'Error al cargar el historial de canjes';
    } finally {
      this.loading = false;
    }
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
      this.aplicarFiltros();
    }
  }

  get canjesPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.canjesFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.canjesFiltrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completado':
      case 'aprobado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'fallido':
      case 'rechazado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'Completado';
      case 'pendiente':
        return 'Pendiente';
      case 'fallido':
        return 'Fallido';
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'completado':
      case 'aprobado':
        return 'checkmark-circle';
      case 'pendiente':
        return 'time';
      case 'fallido':
      case 'rechazado':
        return 'close-circle';
      default:
        return 'help-circle';
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
    return `${Number(peso).toFixed(3)} kg`;
  }

  // Métodos para estadísticas
  getTotalCanjes(): number {
    return this.canjesFiltrados.length;
  }

  getTotalTokensGenerados(): number {
    return this.canjesFiltrados
      .filter(c => c.tipo === 'reciclaje')
      .reduce((total, canje) => total + (canje.tokensGenerados || 0), 0);
  }

  getTotalTokensGastados(): number {
    return this.canjesFiltrados
      .filter(c => c.tipo === 'recompensa')
      .reduce((total, canje) => total + (canje.tokensGastados || 0), 0);
  }

  getCanjesCompletados(): number {
    return this.canjesFiltrados.filter(c => 
      c.estado === 'completado' || c.estado === 'aprobado'
    ).length;
  }

  getCanjesPendientes(): number {
    return this.canjesFiltrados.filter(c => c.estado === 'pendiente').length;
  }

  // Métodos para acciones
  verDetalle(canje: any) {
    this.canjeSeleccionado = canje;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.canjeSeleccionado = null;
  }

  private actualizarOpcionesFiltros() {
    // Aquí se pueden agregar más opciones si es necesario
  }

  onFiltroChange(evento: any) {
    switch (evento.nombre) {
      case 'usuario':
        this.filtroUsuario = evento.valor;
        break;
      case 'estado':
        this.filtroEstado = evento.valor;
        break;
      case 'tipoCanje':
        this.filtroTipoCanje = evento.valor;
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
    let canjesCombinados: any[] = [];

    // Combinar canjes de reciclaje y recompensa
    if (this.pestanaActiva === 'reciclaje' || this.pestanaActiva === 'todos') {
      canjesCombinados = canjesCombinados.concat(
        this.canjesReciclaje.map(canje => ({ ...canje, tipo: 'reciclaje' }))
      );
    }

    if (this.pestanaActiva === 'recompensa' || this.pestanaActiva === 'todos') {
      canjesCombinados = canjesCombinados.concat(
        this.canjesRecompensa.map(canje => ({ ...canje, tipo: 'recompensa' }))
      );
    }

    // Aplicar filtros
    this.canjesFiltrados = canjesCombinados.filter(canje => {
      const usuarioMatch = !this.filtroUsuario ||
        canje.usuario?.nombre?.toLowerCase().includes(this.filtroUsuario.toLowerCase()) ||
        canje.usuarioId?.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      
      const estadoMatch = !this.filtroEstado || canje.estado === this.filtroEstado;
      
      const tipoMatch = !this.filtroTipoCanje || canje.tipo === this.filtroTipoCanje;
      
      const fechaDesdeMatch = !this.filtroFechaDesde ||
        new Date(canje.fechaInicio || canje.fechaCanje) >= new Date(this.filtroFechaDesde);
      
      const fechaHastaMatch = !this.filtroFechaHasta ||
        new Date(canje.fechaInicio || canje.fechaCanje) <= new Date(this.filtroFechaHasta);
      
      return usuarioMatch && estadoMatch && tipoMatch && fechaDesdeMatch && fechaHastaMatch;
    });

    // Ordenar por fecha más reciente
    this.canjesFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fechaInicio || a.fechaCanje);
      const fechaB = new Date(b.fechaInicio || b.fechaCanje);
      return fechaB.getTime() - fechaA.getTime();
    });

    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroEstado = '';
    this.filtroTipoCanje = '';
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
