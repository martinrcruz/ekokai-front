import { Component } from '@angular/core';
import { EcopuntosService } from 'src/app/services/ecopuntos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-ecopuntos',
  standalone: false,
  templateUrl: './ecopuntos.component.html',
  styleUrls: ['./ecopuntos.component.scss']
})
export class EcopuntosComponent {
  filtroNombre = '';
  filtroZona = '';
  filtroEstado = '';
  zonas: string[] = [];

  ecopuntos: any[] = [];
  get ecopuntosFiltrados(): any[] {
    const nombre = this.filtroNombre.trim().toLowerCase();
    const zona = this.filtroZona.trim().toLowerCase();
    const estado = this.filtroEstado.trim().toLowerCase();
    return this.ecopuntos.filter(e =>
      (!nombre || (e?.nombre || '').toLowerCase().includes(nombre)) &&
      (!zona || (e?.zona || '').toLowerCase() === zona) &&
      (!estado || (e?.activo ? 'activo' : 'inactivo') === estado)
    );
  }

  // Chart
  barChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  };
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: 'rgba(76,175,80,.35)', borderColor: 'rgba(76,175,80,.9)', borderWidth: 1, maxBarThickness: 28 }]
  };

  // Modals state
  showCreateModal = false;
  editMode = false;
  saving = false;
  nuevoEcopunto: any = {};

  showEnrolarModal = false;
  enrolando = false;
  ecopuntoSeleccionado: any = null;
  encargadoSeleccionado: string | null = null;
  usuarios: any[] = [];

  showDetalleModal = false;
  ecopuntoDetalle: any = null;

  // Nuevas funcionalidades
  showMetasModal = false;
  metasModalData: any = {};
  guardandoMeta = false;
  showEstadisticasModal = false;
  estadisticasData: any = {};
  cargandoEstadisticas = false;

  constructor(private ecopuntosService: EcopuntosService, private usuariosService: UsuariosService) {
    this.cargarEcopuntos();
    this.cargarUsuarios();
  }

  cargarEcopuntos() {
    this.ecopuntosService.getEcopuntos().subscribe({
      next: (list) => {
        this.ecopuntos = Array.isArray(list) ? list : [];
        this.zonas = Array.from(new Set(this.ecopuntos.map(e => e?.zona).filter(Boolean))).sort();
        this.actualizarChart();
      }
    });
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({ next: (arr) => this.usuarios = Array.isArray(arr) ? arr : [] });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroZona = '';
    this.filtroEstado = '';
  }

  actualizarChart() {
    const labels = this.ecopuntosFiltrados.map(e => e?.nombre || '');
    const data = this.ecopuntosFiltrados.map(e => Number(e?.kilosMes || 0));
    this.barChartData = { ...this.barChartData, labels, datasets: [{ ...this.barChartData.datasets[0], data }] };
  }

  crearEcopunto() {
    this.editMode = false;
    this.nuevoEcopunto = { 
      nombre: '', 
      direccion: '', 
      zona: '', 
      descripcion: '', 
      horarioApertura: '08:00', 
      horarioCierre: '20:00', 
      capacidadMaxima: 1000,
      activo: true 
    };
    this.showCreateModal = true;
  }

  editarEcopunto(e: any) {
    this.editMode = true;
    this.nuevoEcopunto = { ...e };
    this.showCreateModal = true;
  }

  cerrarModal() {
    this.showCreateModal = false;
    this.editMode = false;
  }

  guardarEcopunto() {
    this.saving = true;
    const payload = { ...this.nuevoEcopunto };
    const req$ = this.editMode && payload?._id
      ? this.ecopuntosService.actualizarEcopunto(payload._id, payload)
      : this.ecopuntosService.crearEcopunto(payload);

    req$.subscribe({
      next: () => { this.cargarEcopuntos(); this.cerrarModal(); },
      complete: () => this.saving = false,
      error: () => this.saving = false
    });
  }

  eliminarEcopunto(e: any) {
    if (!e?._id) return;
    this.ecopuntosService.eliminarEcopunto(e._id).subscribe({ next: () => this.cargarEcopuntos() });
  }

  toggleEstado(e: any) {
    if (!e?._id) return;
    const payload = { ...e, activo: !e.activo };
    this.ecopuntosService.actualizarEcopunto(e._id, payload).subscribe({
      next: () => this.cargarEcopuntos()
    });
  }

  // Enrolar
  abrirModalEnrolar(e: any) {
    this.ecopuntoSeleccionado = e;
    this.encargadoSeleccionado = null;
    this.showEnrolarModal = true;
  }
  cerrarModalEnrolar() { this.showEnrolarModal = false; }
  getEncargadosDisponibles(): any[] {
    const usados = new Set(this.ecopuntos.map(e => e?.encargado?._id).filter(Boolean));
    return this.usuarios.filter(u => u?.rol === 'encargado' && !usados.has(u?._id));
  }
  enrolarEncargado() {
    if (!this.ecopuntoSeleccionado?._id || !this.encargadoSeleccionado) return;
    this.enrolando = true;
    this.ecopuntosService.enrolarEncargado(this.ecopuntoSeleccionado._id, this.encargadoSeleccionado).subscribe({
      next: () => { this.cargarEcopuntos(); this.cerrarModalEnrolar(); },
      complete: () => this.enrolando = false,
      error: () => this.enrolando = false
    });
  }

  verMetricas(e: any) {
    this.ecopuntoDetalle = e;
    this.showDetalleModal = true;
  }
  cerrarDetalleModal() { this.showDetalleModal = false; this.ecopuntoDetalle = null; }

  // Nuevas funcionalidades
  abrirModalMetas(e: any) {
    this.metasModalData = {
      ecopuntoId: e._id,
      ecopuntoNombre: e.nombre,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      objetivoKg: 0
    };
    this.showMetasModal = true;
    this.cargarMetaActual();
  }

  cerrarModalMetas() {
    this.showMetasModal = false;
    this.metasModalData = {};
  }

  cargarMetaActual() {
    if (!this.metasModalData.ecopuntoId) return;
    this.ecopuntosService.getMetaMensualPorId(
      this.metasModalData.ecopuntoId,
      this.metasModalData.year,
      this.metasModalData.month
    ).subscribe({
      next: (meta) => {
        if (meta?.objetivoKg) {
          this.metasModalData.objetivoKg = meta.objetivoKg;
        }
      }
    });
  }

  guardarMeta() {
    if (!this.metasModalData.ecopuntoId || !this.metasModalData.objetivoKg) return;
    
    this.guardandoMeta = true;
    this.ecopuntosService.upsertMetaMensualPorId(
      this.metasModalData.ecopuntoId,
      {
        year: this.metasModalData.year,
        month: this.metasModalData.month,
        objetivoKg: this.metasModalData.objetivoKg
      }
    ).subscribe({
      next: () => {
        this.cerrarModalMetas();
        this.cargarEcopuntos();
      },
      complete: () => this.guardandoMeta = false,
      error: () => this.guardandoMeta = false
    });
  }

  eliminarMeta() {
    if (!this.metasModalData.ecopuntoId) return;
    
    this.guardandoMeta = true;
    this.ecopuntosService.deleteMetaMensualPorId(
      this.metasModalData.ecopuntoId,
      this.metasModalData.year,
      this.metasModalData.month
    ).subscribe({
      next: () => {
        this.cerrarModalMetas();
        this.cargarEcopuntos();
      },
      complete: () => this.guardandoMeta = false,
      error: () => this.guardandoMeta = false
    });
  }

  abrirModalEstadisticas(e: any) {
    this.estadisticasData = {
      ecopunto: e,
      kilosMensuales: [],
      entregasDetalle: [],
      metaMensual: null
    };
    this.showEstadisticasModal = true;
    this.cargarEstadisticas(e);
  }

  cerrarModalEstadisticas() {
    this.showEstadisticasModal = false;
    this.estadisticasData = {};
  }

  cargarEstadisticas(ecopunto: any) {
    if (!ecopunto?._id) return;
    
    this.cargandoEstadisticas = true;
    
    // Cargar kilos mensuales
    this.ecopuntosService.getKilosMensualesPorId(ecopunto._id).subscribe({
      next: (kilos) => {
        this.estadisticasData.kilosMensuales = kilos;
        // Actualizar el gráfico con los datos del ecopunto específico
        this.actualizarChartEstadisticas(kilos);
      }
    });

    // Cargar entregas detalle
    this.ecopuntosService.getEntregasDetallePorId(ecopunto._id, 20).subscribe({
      next: (entregas) => {
        this.estadisticasData.entregasDetalle = entregas;
      }
    });

    // Cargar meta del mes actual
    const now = new Date();
    this.ecopuntosService.getMetaMensualPorId(
      ecopunto._id,
      now.getFullYear(),
      now.getMonth() + 1
    ).subscribe({
      next: (meta) => {
        this.estadisticasData.metaMensual = meta;
        this.cargandoEstadisticas = false;
      },
      error: () => this.cargandoEstadisticas = false
    });
  }

  actualizarChartEstadisticas(kilosMensuales: number[]) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.barChartData = {
      labels: meses,
      datasets: [{
        data: kilosMensuales,
        backgroundColor: 'rgba(76,175,80,.35)',
        borderColor: 'rgba(76,175,80,.9)',
        borderWidth: 1,
        maxBarThickness: 28
      }]
    };
  }

  getNombreMes(mes: number): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes] || '';
  }

  getProgresoMeta(objetivo: number, actual: number): number {
    if (!objetivo || objetivo <= 0) return 0;
    return Math.min((actual / objetivo) * 100, 100);
  }

  getKilosMesActual(): number {
    return this.estadisticasData.kilosMensuales[new Date().getMonth()] || 0;
  }

  getProgresoMetaActual(): number {
    if (!this.estadisticasData.metaMensual?.objetivoKg) return 0;
    const kilosActuales = this.getKilosMesActual();
    return this.getProgresoMeta(this.estadisticasData.metaMensual.objetivoKg, kilosActuales);
  }

  getAnioActual(): number {
    return new Date().getFullYear();
  }
}


