import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrazabilidadService, TrazabilidadEvento, TrazabilidadEstadisticas } from '../../../services/trazabilidad.service';
import { FiltrosEstandarizadosComponent, FiltroConfig } from '../../../shared/components/global-filter/filtros-estandarizados.component';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.scss'],
  standalone: false
})
export class TrazabilidadComponent implements OnInit {
  eventos: TrazabilidadEvento[] = [];
  eventosFiltrados: TrazabilidadEvento[] = [];
  estadisticas: TrazabilidadEstadisticas | null = null;
  loading = false;
  error: string | null = null;
  
  // Filtros
  filtroUsuario = '';
  filtroTelefono = '';
  filtroStep = '';
  filtroQR = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 20;
  
  // Estados
  pestanaActiva = 'eventos'; // 'eventos' | 'estadisticas' | 'usuarios'
  showFiltros = false;
  showDetalleModal = false;
  eventoSeleccionado: TrazabilidadEvento | null = null;

  // Configuración de filtros estandarizados
  filtrosConfig: FiltroConfig[] = [
    {
      tipo: 'texto',
      icono: 'bi-person',
      titulo: 'Usuario',
      placeholder: 'ID del usuario',
      valor: '',
      nombre: 'usuario'
    },
    {
      tipo: 'texto',
      icono: 'bi-phone',
      titulo: 'Teléfono',
      placeholder: 'Número de teléfono',
      valor: '',
      nombre: 'telefono'
    },
    {
      tipo: 'select',
      icono: 'bi-arrow-right',
      titulo: 'Paso',
      placeholder: 'Seleccionar paso',
      valor: '',
      nombre: 'step',
      opciones: [
        { valor: '', etiqueta: 'Todos los pasos' },
        { valor: 'qr_scanned', etiqueta: 'QR Escaneado' },
        { valor: 'user_identified', etiqueta: 'Usuario Identificado' },
        { valor: 'weight_measured', etiqueta: 'Peso Medido' },
        { valor: 'photo_taken', etiqueta: 'Foto Tomada' },
        { valor: 'exchange_completed', etiqueta: 'Canje Completado' },
        { valor: 'exchange_failed', etiqueta: 'Canje Fallido' }
      ]
    },
    {
      tipo: 'texto',
      icono: 'bi-qr-code',
      titulo: 'Código QR',
      placeholder: 'Código QR',
      valor: '',
      nombre: 'qr'
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

  constructor(private trazabilidadService: TrazabilidadService) {}

  ngOnInit() {
    this.cargarEventos();
    this.cargarEstadisticas();
    this.actualizarOpcionesFiltros();
  }

  async cargarEventos() {
    this.loading = true;
    this.error = null;
    try {
      this.trazabilidadService.listarEventos({
        limite: 100,
        pagina: 1
      }).subscribe({
        next: (response) => {
          this.eventos = response.data;
          this.aplicarFiltros();
          console.log('Eventos de trazabilidad cargados:', this.eventos.length);
        },
        error: (error) => {
          console.error('Error al cargar eventos de trazabilidad:', error);
          this.error = 'Error al cargar eventos de trazabilidad';
        }
      });
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      this.error = 'Error al cargar los eventos de trazabilidad';
    } finally {
      this.loading = false;
    }
  }

  async cargarEstadisticas() {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 30); // Últimos 30 días
      
      this.trazabilidadService.obtenerEstadisticas(fechaInicio, new Date()).subscribe({
        next: (estadisticas) => {
          this.estadisticas = estadisticas;
          console.log('Estadísticas de trazabilidad cargadas:', estadisticas);
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
        }
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
    }
  }

  get eventosPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.eventosFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.eventosFiltrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getStepColor(step: string): string {
    switch (step) {
      case 'qr_scanned':
        return 'primary';
      case 'user_identified':
        return 'secondary';
      case 'weight_measured':
        return 'tertiary';
      case 'photo_taken':
        return 'success';
      case 'exchange_completed':
        return 'success';
      case 'exchange_failed':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getStepTexto(step: string): string {
    switch (step) {
      case 'qr_scanned':
        return 'QR Escaneado';
      case 'user_identified':
        return 'Usuario Identificado';
      case 'weight_measured':
        return 'Peso Medido';
      case 'photo_taken':
        return 'Foto Tomada';
      case 'exchange_completed':
        return 'Canje Completado';
      case 'exchange_failed':
        return 'Canje Fallido';
      default:
        return step;
    }
  }

  getStepIcon(step: string): string {
    switch (step) {
      case 'qr_scanned':
        return 'qr-code-outline';
      case 'user_identified':
        return 'person-outline';
      case 'weight_measured':
        return 'scale-outline';
      case 'photo_taken':
        return 'camera-outline';
      case 'exchange_completed':
        return 'checkmark-circle-outline';
      case 'exchange_failed':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  formatearFecha(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Métodos para estadísticas
  getTotalEventos(): number {
    return this.eventosFiltrados.length;
  }

  getEventosPorStep(step: string): number {
    return this.eventosFiltrados.filter(e => e.step === step).length;
  }

  getUsuariosUnicos(): number {
    const usuariosUnicos = new Set(this.eventosFiltrados.map(e => e.userId).filter(Boolean));
    return usuariosUnicos.size;
  }

  getTelefonosUnicos(): number {
    const telefonosUnicos = new Set(this.eventosFiltrados.map(e => e.phoneNumber).filter(Boolean));
    return telefonosUnicos.size;
  }

  getQRsUnicos(): number {
    const qrsUnicos = new Set(this.eventosFiltrados.map(e => e.qr_code).filter(Boolean));
    return qrsUnicos.size;
  }

  // Métodos para acciones
  verDetalle(evento: TrazabilidadEvento) {
    this.eventoSeleccionado = evento;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.eventoSeleccionado = null;
  }

  private actualizarOpcionesFiltros() {
    // Aquí se pueden agregar más opciones si es necesario
  }

  onFiltroChange(evento: any) {
    switch (evento.nombre) {
      case 'usuario':
        this.filtroUsuario = evento.valor;
        break;
      case 'telefono':
        this.filtroTelefono = evento.valor;
        break;
      case 'step':
        this.filtroStep = evento.valor;
        break;
      case 'qr':
        this.filtroQR = evento.valor;
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
    this.eventosFiltrados = this.eventos.filter(evento => {
      const usuarioMatch = !this.filtroUsuario ||
        evento.userId?.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      
      const telefonoMatch = !this.filtroTelefono ||
        evento.phoneNumber?.toLowerCase().includes(this.filtroTelefono.toLowerCase());
      
      const stepMatch = !this.filtroStep || evento.step === this.filtroStep;
      
      const qrMatch = !this.filtroQR ||
        evento.qr_code?.toLowerCase().includes(this.filtroQR.toLowerCase());
      
      const fechaDesdeMatch = !this.filtroFechaDesde ||
        new Date(evento.timestamp) >= new Date(this.filtroFechaDesde);
      
      const fechaHastaMatch = !this.filtroFechaHasta ||
        new Date(evento.timestamp) <= new Date(this.filtroFechaHasta);
      
      return usuarioMatch && telefonoMatch && stepMatch && qrMatch && fechaDesdeMatch && fechaHastaMatch;
    });

    // Ordenar por timestamp más reciente
    this.eventosFiltrados.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroTelefono = '';
    this.filtroStep = '';
    this.filtroQR = '';
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
