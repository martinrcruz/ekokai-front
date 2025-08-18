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
  zonas: string[] = [];

  ecopuntos: any[] = [];
  get ecopuntosFiltrados(): any[] {
    const nombre = this.filtroNombre.trim().toLowerCase();
    const zona = this.filtroZona.trim().toLowerCase();
    return this.ecopuntos.filter(e =>
      (!nombre || (e?.nombre || '').toLowerCase().includes(nombre)) &&
      (!zona || (e?.zona || '').toLowerCase() === zona)
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
  }

  actualizarChart() {
    const labels = this.ecopuntosFiltrados.map(e => e?.nombre || '');
    const data = this.ecopuntosFiltrados.map(e => Number(e?.kilosMes || 0));
    this.barChartData = { ...this.barChartData, labels, datasets: [{ ...this.barChartData.datasets[0], data }] };
  }

  crearEcopunto() {
    this.editMode = false;
    this.nuevoEcopunto = { nombre: '', direccion: '', zona: '', descripcion: '', horarioApertura: '', horarioCierre: '', capacidadMaxima: 1000 };
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
}


