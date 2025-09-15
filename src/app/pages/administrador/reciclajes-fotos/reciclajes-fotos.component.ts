import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EntregaResiduoService, EntregaResiduo } from '../../../services/entrega-residuo.service';
import { CanjeService, CanjeReciclaje } from '../../../services/canje.service';
import { FiltrosEstandarizadosComponent, FiltroConfig } from '../../../shared/components/global-filter/filtros-estandarizados.component';

@Component({
  selector: 'app-reciclajes-fotos',
  templateUrl: './reciclajes-fotos.component.html',
  styleUrls: ['./reciclajes-fotos.component.scss'],
  standalone: false
})
export class ReciclajesFotosComponent implements OnInit {
  entregas: EntregaResiduo[] = [];
  canjesReciclaje: CanjeReciclaje[] = [];
  reciclajesFiltrados: any[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  filtroUsuario = '';
  filtroEcopunto = '';
  filtroTipoResiduo = '';
  filtroEstado = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroConFoto = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 20;
  
  // Estados
  pestanaActiva = 'entregas'; // 'entregas' | 'canjes' | 'todos'
  showFiltros = false;
  showDetalleModal = false;
  showFotoModal = false;
  reciclajeSeleccionado: any = null;
  fotoSeleccionada: string | null = null;

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
      tipo: 'select',
      icono: 'bi-check-circle',
      titulo: 'Estado',
      placeholder: 'Seleccionar estado',
      valor: '',
      nombre: 'estado',
      opciones: [
        { valor: '', etiqueta: 'Todos los estados' },
        { valor: 'completado', etiqueta: 'Completado' },
        { valor: 'pendiente', etiqueta: 'Pendiente' },
        { valor: 'fallido', etiqueta: 'Fallido' }
      ]
    },
    {
      tipo: 'select',
      icono: 'bi-camera',
      titulo: 'Con Foto',
      placeholder: 'Filtrar por fotos',
      valor: '',
      nombre: 'conFoto',
      opciones: [
        { valor: '', etiqueta: 'Todos' },
        { valor: 'si', etiqueta: 'Con foto' },
        { valor: 'no', etiqueta: 'Sin foto' }
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

  constructor(
    private entregaService: EntregaResiduoService,
    private canjeService: CanjeService
  ) {}

  ngOnInit() {
    this.cargarReciclajes();
    this.actualizarOpcionesFiltros();
  }

  async cargarReciclajes() {
    this.loading = true;
    this.error = null;
    try {
      // Cargar entregas de residuos
      this.entregaService.obtenerHistorialCompleto({}).subscribe({
        next: (response) => {
          if (response?.ok) {
            this.entregas = response.historial;
            this.aplicarFiltros();
            console.log('Entregas cargadas:', this.entregas.length);
          } else {
            this.error = 'No se pudo cargar el historial de entregas';
          }
        },
        error: (error) => {
          console.error('Error al cargar entregas:', error);
          this.error = 'Error al cargar entregas de residuos';
        }
      });

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

    } catch (error) {
      console.error('Error al cargar reciclajes:', error);
      this.error = 'Error al cargar los datos de reciclaje';
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

  get reciclajesPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.reciclajesFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.reciclajesFiltrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'fallido':
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
      default:
        return 'Desconocido';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'checkmark-circle';
      case 'pendiente':
        return 'time';
      case 'fallido':
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
  getTotalReciclajes(): number {
    return this.reciclajesFiltrados.length;
  }

  getTotalKilos(): number {
    return this.reciclajesFiltrados.reduce((total, reciclaje) => total + (reciclaje.pesoKg || 0), 0);
  }

  getTotalTokensGenerados(): number {
    return this.reciclajesFiltrados.reduce((total, reciclaje) => total + (reciclaje.tokensGenerados || reciclaje.cuponesGenerados || 0), 0);
  }

  getReciclajesConFoto(): number {
    return this.reciclajesFiltrados.filter(r => r.imagePath || r.foto).length;
  }

  getReciclajesCompletados(): number {
    return this.reciclajesFiltrados.filter(r => r.estado === 'completado').length;
  }

  // Métodos para acciones
  verDetalle(reciclaje: any) {
    this.reciclajeSeleccionado = reciclaje;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.reciclajeSeleccionado = null;
  }

  verFoto(fotoPath: string) {
    this.fotoSeleccionada = fotoPath;
    this.showFotoModal = true;
  }

  cerrarFotoModal() {
    this.showFotoModal = false;
    this.fotoSeleccionada = null;
  }

  tieneFoto(reciclaje: any): boolean {
    return !!(reciclaje.imagePath || reciclaje.foto);
  }

  obtenerRutaFoto(reciclaje: any): string {
    return reciclaje.imagePath || reciclaje.foto || '';
  }

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
      case 'estado':
        this.filtroEstado = evento.valor;
        break;
      case 'conFoto':
        this.filtroConFoto = evento.valor;
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
    let reciclajesCombinados: any[] = [];

    // Combinar entregas y canjes de reciclaje
    if (this.pestanaActiva === 'entregas' || this.pestanaActiva === 'todos') {
      reciclajesCombinados = reciclajesCombinados.concat(
        this.entregas.map(entrega => ({ ...entrega, tipo: 'entrega' }))
      );
    }

    if (this.pestanaActiva === 'canjes' || this.pestanaActiva === 'todos') {
      reciclajesCombinados = reciclajesCombinados.concat(
        this.canjesReciclaje.map(canje => ({ ...canje, tipo: 'canje' }))
      );
    }

    // Aplicar filtros
    this.reciclajesFiltrados = reciclajesCombinados.filter(reciclaje => {
      const usuarioMatch = !this.filtroUsuario ||
        reciclaje.usuario?.nombre?.toLowerCase().includes(this.filtroUsuario.toLowerCase()) ||
        reciclaje.usuarioId?.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      
      const ecopuntoMatch = !this.filtroEcopunto ||
        reciclaje.ecopunto?.nombre?.toLowerCase().includes(this.filtroEcopunto.toLowerCase());
      
      const tipoResiduoMatch = !this.filtroTipoResiduo ||
        reciclaje.tipoResiduo?.nombre?.toLowerCase().includes(this.filtroTipoResiduo.toLowerCase());
      
      const estadoMatch = !this.filtroEstado || reciclaje.estado === this.filtroEstado;
      
      const fotoMatch = !this.filtroConFoto ||
        (this.filtroConFoto === 'si' && this.tieneFoto(reciclaje)) ||
        (this.filtroConFoto === 'no' && !this.tieneFoto(reciclaje));
      
      const fechaDesdeMatch = !this.filtroFechaDesde ||
        new Date(reciclaje.fecha || reciclaje.fechaInicio) >= new Date(this.filtroFechaDesde);
      
      const fechaHastaMatch = !this.filtroFechaHasta ||
        new Date(reciclaje.fecha || reciclaje.fechaInicio) <= new Date(this.filtroFechaHasta);
      
      return usuarioMatch && ecopuntoMatch && tipoResiduoMatch && estadoMatch && fotoMatch && fechaDesdeMatch && fechaHastaMatch;
    });

    // Ordenar por fecha más reciente
    this.reciclajesFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fecha || a.fechaInicio);
      const fechaB = new Date(b.fecha || b.fechaInicio);
      return fechaB.getTime() - fechaA.getTime();
    });

    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroUsuario = '';
    this.filtroEcopunto = '';
    this.filtroTipoResiduo = '';
    this.filtroEstado = '';
    this.filtroConFoto = '';
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
