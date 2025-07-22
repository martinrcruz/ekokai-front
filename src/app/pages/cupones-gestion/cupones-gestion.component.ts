import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CuponService } from 'src/app/services/cupon.service';
import { Cupon } from 'src/app/models/cupon.model';

@Component({
  selector: 'app-cupones-gestion',
  templateUrl: './cupones-gestion.component.html',
  styleUrls: ['./cupones-gestion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CuponesGestionComponent implements OnInit {
  cupones: Cupon[] = [];
  loading = false;
  filtroNombre = '';
  showCrearModal = false;
  showEditarModal = false;
  cuponForm: Partial<Cupon> = {};
  cuponEditando: Cupon | null = null;
  guardando = false;

  constructor(private cuponService: CuponService) {}

  ngOnInit() {
    this.cargarCupones();
  }

  cargarCupones() {
    this.loading = true;
    this.cuponService.listar().subscribe({
      next: cupones => { this.cupones = cupones; this.loading = false; },
      error: _ => { this.loading = false; }
    });
  }

  abrirCrearModal() {
    this.cuponForm = {};
    this.showCrearModal = true;
  }

  cerrarCrearModal() {
    this.showCrearModal = false;
  }

  crearCupon() {
    this.guardando = true;
    this.cuponService.crear(this.cuponForm as Cupon).subscribe({
      next: _ => { this.cargarCupones(); this.cerrarCrearModal(); this.guardando = false; },
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
      next: _ => { this.cargarCupones(); this.cerrarEditarModal(); this.guardando = false; },
      error: _ => { this.guardando = false; }
    });
  }

  eliminarCupon(cupon: Cupon) {
    if (!cupon._id) return;
    if (!confirm('¿Seguro que deseas eliminar este cupón?')) return;
    this.cuponService.eliminar(cupon._id).subscribe(_ => this.cargarCupones());
  }

  get cuponesFiltrados() {
    return this.cupones.filter(c =>
      (!this.filtroNombre || c.nombre?.toLowerCase().includes(this.filtroNombre.toLowerCase()))
    );
  }
} 