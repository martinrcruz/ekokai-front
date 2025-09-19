import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrazabilidadService, TrazabilidadEvento } from '../../../services/trazabilidad.service';
import { FiltrosEstandarizadosComponent, FiltroConfig } from '../../../shared/components/global-filter/filtros-estandarizados.component';

export interface ReciclajeSession {
  sessionId: string;
  phoneNumber: string;
  userId?: string;
  qrCode?: string;
  estado: 'iniciado' | 'primera_imagen_validada' | 'completado' | 'fallido';
  fechaInicio: Date;
  fechaCompletado?: Date;
  intentos: ReciclajeIntento[];
  tokensGenerados?: number;
  cuponGeneradoId?: string;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  metadata?: any;
}

export interface ReciclajeIntento {
  numeroIntento: number;
  timestamp: Date;
  image_path?: string;
  validation_result?: {
    esBolsaBasura: boolean;
    confianza: number;
    razon?: string;
    detalles?: any;
  };
  error_info?: any;
}

@Component({
  selector: 'app-trazabilidad-reciclaje',
  templateUrl: './trazabilidad-reciclaje.component.html',
  styleUrls: ['./trazabilidad-reciclaje.component.scss'],
  standalone: false
})
export class TrazabilidadReciclajeComponent implements OnInit {
  sesionesReciclaje: ReciclajeSession[] = [];
  sesionesFiltradas: ReciclajeSession[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  filtroUsuario = '';
  filtroTelefono = '';
  filtroEstado = '';
  filtroQR = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  
  // Estados
  pestanaActiva = 'sesiones'; // 'sesiones' | 'estadisticas' | 'detalle'
  showFiltros = false;
  showDetalleModal = false;
  sesionSeleccionada: ReciclajeSession | null = null;

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
      titulo: 'Estado',
      placeholder: 'Seleccionar estado',
      valor: '',
      nombre: 'estado',
      opciones: [
        { valor: '', etiqueta: 'Todos los estados' },
        { valor: 'iniciado', etiqueta: 'Iniciado' },
        { valor: 'primera_imagen_validada', etiqueta: 'Primera Imagen Validada' },
        { valor: 'completado', etiqueta: 'Completado' },
        { valor: 'fallido', etiqueta: 'Fallido' }
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
    this.cargarSesionesReciclaje();
  }

  async cargarSesionesReciclaje() {
    this.loading = true;
    this.error = null;
    try {
      // Obtener sesiones de reciclaje directamente del endpoint específico
      this.trazabilidadService.obtenerSesionesReciclaje({
        limite: 100,
        pagina: 1
      }).subscribe({
        next: (response) => {
          this.sesionesReciclaje = response.data;
          this.aplicarFiltros();
          console.log('Sesiones de reciclaje cargadas:', this.sesionesReciclaje.length);
        },
        error: (error) => {
          console.error('Error al cargar sesiones de reciclaje:', error);
          this.error = 'Error al cargar sesiones de reciclaje';
        }
      });
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
      this.error = 'Error al cargar las sesiones de reciclaje';
    } finally {
      this.loading = false;
    }
  }


  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
    }
  }

  get sesionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.sesionesFiltradas.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.sesionesFiltradas.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'iniciado':
        return 'primary';
      case 'primera_imagen_validada':
        return 'secondary';
      case 'completado':
        return 'success';
      case 'fallido':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'iniciado':
        return 'Iniciado';
      case 'primera_imagen_validada':
        return 'Primera Imagen Validada';
      case 'completado':
        return 'Completado';
      case 'fallido':
        return 'Fallido';
      default:
        return estado;
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'iniciado':
        return 'play-circle-outline';
      case 'primera_imagen_validada':
        return 'checkmark-circle-outline';
      case 'completado':
        return 'checkmark-done-circle-outline';
      case 'fallido':
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
  getTotalSesiones(): number {
    return this.sesionesFiltradas.length;
  }

  getSesionesPorEstado(estado: string): number {
    return this.sesionesFiltradas.filter(s => s.estado === estado).length;
  }

  getUsuariosUnicos(): number {
    const usuariosUnicos = new Set(this.sesionesFiltradas.map(s => s.userId).filter(Boolean));
    return usuariosUnicos.size;
  }

  getTelefonosUnicos(): number {
    const telefonosUnicos = new Set(this.sesionesFiltradas.map(s => s.phoneNumber).filter(Boolean));
    return telefonosUnicos.size;
  }

  getSesionesExitosas(): number {
    return this.sesionesFiltradas.filter(s => s.estado === 'completado').length;
  }

  getSesionesFallidas(): number {
    return this.sesionesFiltradas.filter(s => s.estado === 'fallido').length;
  }

  getTasaExito(): number {
    const total = this.getTotalSesiones();
    if (total === 0) return 0;
    return Math.round((this.getSesionesExitosas() / total) * 100);
  }

  // Métodos para acciones
  verDetalle(sesion: ReciclajeSession) {
    this.sesionSeleccionada = sesion;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.sesionSeleccionada = null;
  }

  onFiltroChange(evento: any) {
    switch (evento.nombre) {
      case 'usuario':
        this.filtroUsuario = evento.valor;
        break;
      case 'telefono':
        this.filtroTelefono = evento.valor;
        break;
      case 'estado':
        this.filtroEstado = evento.valor;
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
    // Si hay filtros activos, recargar datos del servidor
    if (this.filtroUsuario || this.filtroTelefono || this.filtroEstado || this.filtroQR || this.filtroFechaDesde || this.filtroFechaHasta) {
      this.cargarSesionesConFiltros();
    } else {
      // Sin filtros, usar datos locales
      this.sesionesFiltradas = [...this.sesionesReciclaje];
      this.paginaActual = 1;
    }
  }

  private cargarSesionesConFiltros() {
    this.loading = true;
    const filtros: any = {
      limite: 100,
      pagina: 1
    };

    if (this.filtroUsuario) filtros.userId = this.filtroUsuario;
    if (this.filtroTelefono) filtros.phoneNumber = this.filtroTelefono;
    if (this.filtroEstado) filtros.estado = this.filtroEstado;
    if (this.filtroQR) filtros.qrCode = this.filtroQR;
    if (this.filtroFechaDesde) filtros.fechaInicio = new Date(this.filtroFechaDesde);
    if (this.filtroFechaHasta) filtros.fechaFin = new Date(this.filtroFechaHasta);

    this.trazabilidadService.obtenerSesionesReciclaje(filtros).subscribe({
      next: (response) => {
        this.sesionesFiltradas = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al aplicar filtros:', error);
        this.error = 'Error al aplicar filtros';
        this.loading = false;
      }
    });
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroTelefono = '';
    this.filtroEstado = '';
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

  // Métodos para análisis de intentos
  getIntentosExitosos(sesion: ReciclajeSession): number {
    return sesion.intentos.filter(intento => 
      intento.validation_result?.esBolsaBasura === true
    ).length;
  }

  getIntentosFallidos(sesion: ReciclajeSession): number {
    return sesion.intentos.filter(intento => 
      intento.validation_result?.esBolsaBasura === false
    ).length;
  }

  getConfianzaPromedio(sesion: ReciclajeSession): number {
    const intentosConConfianza = sesion.intentos.filter(intento => 
      intento.validation_result?.confianza !== undefined
    );
    
    if (intentosConConfianza.length === 0) return 0;
    
    const sumaConfianza = intentosConConfianza.reduce((sum, intento) => 
      sum + (intento.validation_result?.confianza || 0), 0
    );
    
    return Math.round(sumaConfianza / intentosConConfianza.length);
  }

  getRazonFallo(sesion: ReciclajeSession): string {
    const ultimoIntento = sesion.intentos[sesion.intentos.length - 1];
    return ultimoIntento?.validation_result?.razon || 'No especificada';
  }
}
