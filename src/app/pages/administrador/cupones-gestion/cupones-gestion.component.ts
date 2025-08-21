import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CuponService } from 'src/app/services/cupon.service';
import { Cupon, Canje } from 'src/app/models/cupon.model';

@Component({
  selector: 'app-cupones-gestion',
  templateUrl: './cupones-gestion.component.html',
  styleUrls: ['./cupones-gestion.component.scss'],
  standalone: false
})
export class CuponesGestionComponent implements OnInit {
  cupones: Cupon[] = [];
  canjes: Canje[] = [];
  loading = false;
  filtroNombre = '';
  filtroEstado = '';
  showCrearModal = false;
  showEditarModal = false;
  showGenerarMasivosModal = false;
  showAsociarModal = false;
  showCanjesModal = false;
  cuponForm: Partial<Cupon> = {};
  cuponEditando: Cupon | null = null;
  cuponSeleccionado: Cupon | null = null;
  guardando = false;
  estadisticas: any = {};
  pestanaActiva = 'cupones'; // 'cupones' | 'canjes' | 'estadisticas'

  constructor(private cuponService: CuponService) {}

  ngOnInit() {
    this.cargarCupones();
    this.cargarEstadisticas();
  }

  cargarCupones() {
    this.loading = true;
    this.cuponService.listar().subscribe({
      next: cupones => { this.cupones = cupones; this.loading = false; },
      error: _ => { this.loading = false; }
    });
  }

  cargarCanjes() {
    this.loading = true;
    const filtros: any = {};
    if (this.filtroEstado) filtros.estado = this.filtroEstado;
    
    this.cuponService.listarCanjes(filtros).subscribe({
      next: canjes => { this.canjes = canjes; this.loading = false; },
      error: _ => { this.loading = false; }
    });
  }

  cargarEstadisticas() {
    this.cuponService.obtenerEstadisticas().subscribe({
      next: estadisticas => this.estadisticas = estadisticas,
      error: _ => {}
    });
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
      if (pestana === 'canjes') {
        this.cargarCanjes();
      }
    }
  }

  abrirCrearModal() {
    this.cuponForm = {
      tipo: 'general',
      activo: true,
      maxUsosPorUsuario: 1,
      requiereAprobacion: false
    };
    this.showCrearModal = true;
  }

  cerrarCrearModal() {
    this.showCrearModal = false;
  }

  crearCupon() {
    this.guardando = true;
    this.cuponService.crear(this.cuponForm as Cupon).subscribe({
      next: _ => { 
        this.cargarCupones(); 
        this.cargarEstadisticas();
        this.cerrarCrearModal(); 
        this.guardando = false; 
      },
      error: _ => { this.guardando = false; }
    });
  }

  abrirGenerarMasivosModal() {
    this.cuponForm = {
      tipo: 'masivo',
      activo: true,
      maxUsosPorUsuario: 1,
      requiereAprobacion: false
    };
    this.showGenerarMasivosModal = true;
  }

  cerrarGenerarMasivosModal() {
    this.showGenerarMasivosModal = false;
  }

  generarCuponesMasivos() {
    if (!this.cuponForm.cantidadDisponible || this.cuponForm.cantidadDisponible < 1) {
      alert('Debe especificar una cantidad válida');
      return;
    }

    this.guardando = true;
    this.cuponService.generarCuponesMasivos(this.cuponForm as Cupon, this.cuponForm.cantidadDisponible!).subscribe({
      next: _ => { 
        this.cargarCupones(); 
        this.cargarEstadisticas();
        this.cerrarGenerarMasivosModal(); 
        this.guardando = false; 
      },
      error: _ => { this.guardando = false; }
    });
  }

  abrirEditarModal(cupon: Cupon) {
    this.cuponEditando = { ...cupon };
    this.showEditarModal = true;
  }

  cerrarEditarModal() {
    this.showEditarModal = false;
    this.cuponEditando = null;
  }

  guardarEdicion() {
    if (!this.cuponEditando?._id) return;
    this.guardando = true;
    this.cuponService.actualizar(this.cuponEditando._id, this.cuponEditando).subscribe({
      next: _ => { 
        this.cargarCupones(); 
        this.cerrarEditarModal(); 
        this.guardando = false; 
      },
      error: _ => { this.guardando = false; }
    });
  }

  eliminarCupon(cupon: Cupon) {
    if (!cupon._id) return;
    if (!confirm('¿Seguro que deseas eliminar este cupón?')) return;
    this.cuponService.eliminar(cupon._id).subscribe(_ => {
      this.cargarCupones();
      this.cargarEstadisticas();
    });
  }

  abrirAsociarModal(cupon: Cupon) {
    this.cuponSeleccionado = cupon;
    this.showAsociarModal = true;
  }

  cerrarAsociarModal() {
    this.showAsociarModal = false;
    this.cuponSeleccionado = null;
  }

  asociarUsuario(usuarioId: string) {
    if (!this.cuponSeleccionado?._id) return;
    this.cuponService.asociarUsuario(this.cuponSeleccionado._id, usuarioId).subscribe({
      next: _ => { 
        this.cargarCupones(); 
        this.cerrarAsociarModal(); 
      },
      error: _ => {}
    });
  }

  desasociarUsuario(usuarioId: string) {
    if (!this.cuponSeleccionado?._id) return;
    this.cuponService.desasociarUsuario(this.cuponSeleccionado._id, usuarioId).subscribe({
      next: _ => { this.cargarCupones(); },
      error: _ => {}
    });
  }

  asociarComercio(comercioId: string) {
    if (!this.cuponSeleccionado?._id) return;
    this.cuponService.asociarComercio(this.cuponSeleccionado._id, comercioId).subscribe({
      next: _ => { 
        this.cargarCupones(); 
        this.cerrarAsociarModal(); 
      },
      error: _ => {}
    });
  }

  desasociarComercio(comercioId: string) {
    if (!this.cuponSeleccionado?._id) return;
    this.cuponService.desasociarComercio(this.cuponSeleccionado._id, comercioId).subscribe({
      next: _ => { this.cargarCupones(); },
      error: _ => {}
    });
  }

  abrirCanjesModal() {
    this.showCanjesModal = true;
    this.cargarCanjes();
  }

  cerrarCanjesModal() {
    this.showCanjesModal = false;
  }

  aprobarCanje(canje: Canje) {
    if (!canje._id) return;
    const observaciones = prompt('Observaciones (opcional):');
    this.cuponService.aprobarCanje(canje._id, observaciones || '').subscribe({
      next: _ => { this.cargarCanjes(); },
      error: _ => {}
    });
  }

  rechazarCanje(canje: Canje) {
    if (!canje._id) return;
    const observaciones = prompt('Motivo del rechazo:');
    if (!observaciones) return;
    
    this.cuponService.rechazarCanje(canje._id, observaciones).subscribe({
      next: _ => { this.cargarCanjes(); },
      error: _ => {}
    });
  }

  get cuponesFiltrados() {
    return this.cupones.filter(c =>
      (!this.filtroNombre || c.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase()))
    );
  }

  get canjesFiltrados() {
    return this.canjes.filter(c =>
      (!this.filtroEstado || c.estado === this.filtroEstado)
    );
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'aprobado': return 'success';
      case 'rechazado': return 'danger';
      case 'completado': return 'primary';
      default: return 'medium';
    }
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'general': return 'primary';
      case 'personalizado': return 'secondary';
      case 'masivo': return 'tertiary';
      default: return 'medium';
    }
  }
}
