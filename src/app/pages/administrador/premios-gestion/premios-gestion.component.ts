import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PremioService } from 'src/app/services/premio.service';
import { Premio } from 'src/app/services/premio.service';

@Component({
  selector: 'app-premios-gestion',
  templateUrl: './premios-gestion.component.html',
  styleUrls: ['./premios-gestion.component.scss'],
  standalone: false
})
export class PremiosGestionComponent implements OnInit {
  premios: Premio[] = [];
  loading = false;
  filtroNombre = '';
  filtroCategoria = '';
  showCrearModal = false;
  showEditarModal = false;
  premioForm: Partial<Premio> = {};
  premioEditando: Premio | null = null;
  guardando = false;
  estadisticas: any = {};
  pestanaActiva = 'premios'; // 'premios' | 'estadisticas'

  constructor(private premioService: PremioService) {}

  ngOnInit() {
    this.cargarPremios();
    this.cargarEstadisticas();
  }

  cargarPremios() {
    this.loading = true;
    this.premioService.getPremiosActivos().subscribe({
      next: response => { 
        if (response?.ok) {
          this.premios = response.premios; 
        }
        this.loading = false; 
      },
      error: _ => { this.loading = false; }
    });
  }

  cargarEstadisticas() {
    // Estadísticas básicas de premios
    this.estadisticas = {
      totalPremios: this.premios.length,
      premiosActivos: this.premios.filter(p => p.activo).length,
      premiosDestacados: this.premios.filter(p => p.destacado).length,
      categorias: [...new Set(this.premios.map(p => p.categoria))]
    };
  }

  cambiarPestana(pestana: string | undefined) {
    if (pestana) {
      this.pestanaActiva = pestana;
    }
  }

  abrirCrearModal() {
    this.premioForm = {
      nombre: '',
      descripcion: '',
      cuponesRequeridos: 0,
      stock: 0,
      categoria: '',
      activo: true,
      destacado: false,
      orden: 0
    };
    this.showCrearModal = true;
  }

  cerrarCrearModal() {
    this.showCrearModal = false;
  }

  crearPremio() {
    this.guardando = true;
    this.premioService.createPremio(this.premioForm as Premio).subscribe({
      next: (response: any) => { 
        this.cargarPremios(); 
        this.cargarEstadisticas();
        this.cerrarCrearModal(); 
        this.guardando = false; 
      },
      error: (error: any) => { this.guardando = false; }
    });
  }

  abrirEditarModal(premio: Premio) {
    this.premioEditando = { ...premio };
    this.showEditarModal = true;
  }

  cerrarEditarModal() {
    this.showEditarModal = false;
    this.premioEditando = null;
  }

  guardarEdicion() {
    if (!this.premioEditando?._id) return;
    this.guardando = true;
    this.premioService.updatePremio(this.premioEditando._id, this.premioEditando).subscribe({
      next: (response: any) => { 
        this.cargarPremios(); 
        this.cerrarEditarModal(); 
        this.guardando = false; 
      },
      error: (error: any) => { this.guardando = false; }
    });
  }

  eliminarPremio(premio: Premio) {
    if (!premio._id) return;
    if (!confirm('¿Seguro que deseas eliminar este premio?')) return;
    this.premioService.deletePremio(premio._id).subscribe((response: any) => {
      this.cargarPremios();
      this.cargarEstadisticas();
    });
  }

  get premiosFiltrados() {
    return this.premios.filter(p =>
      (!this.filtroNombre || p.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase())) &&
      (!this.filtroCategoria || p.categoria === this.filtroCategoria)
    );
  }

  getCategoriaColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'Electrónicos': 'primary',
      'Hogar': 'secondary',
      'Deportes': 'tertiary',
      'Libros': 'success',
      'Moda': 'warning',
      'default': 'medium'
    };
    return colores[categoria] || colores['default'];
  }

  getDestacadoColor(destacado: boolean): string {
    return destacado ? 'success' : 'medium';
  }

  getActivoColor(activo: boolean): string {
    return activo ? 'success' : 'danger';
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroCategoria = '';
  }
}
