import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ResiduosService } from 'src/app/services/residuos.service';

@Component({
  selector: 'app-tipos-residuo-gestion',
  templateUrl: './tipos-residuo-gestion.component.html',
  styleUrls: ['./tipos-residuo-gestion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TiposResiduoGestionComponent implements OnInit {
  residuos: any[] = [];
  loading = false;
  showEditarModal = false;
  residuoEditando: any = null;
  guardando = false;
  showCrearModal = false;
  nuevoResiduo: any = { nombre: '', descripcion: '', tokensPorKg: 0 };
  eliminando = false;

  constructor(private residuosService: ResiduosService) {}

  ngOnInit() {
    this.cargarResiduos();
  }

  cargarResiduos() {
    this.loading = true;
    this.residuosService.getResiduos().subscribe({
      next: (res) => {
        this.residuos = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  editarResiduo(residuo: any) {
    this.residuoEditando = { ...residuo };
    this.showEditarModal = true;
  }

  guardarEdicion() {
    if (!this.residuoEditando) return;
    this.guardando = true;
    this.residuosService.actualizarResiduo(this.residuoEditando._id, {
      tokensPorKg: this.residuoEditando.tokensPorKg
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.showEditarModal = false;
        this.cargarResiduos();
      },
      error: () => {
        this.guardando = false;
        alert('Error al guardar los cambios');
      }
    });
  }

  cancelarEdicion() {
    this.showEditarModal = false;
    this.residuoEditando = null;
  }

  cerrarEditarModal() {
    this.cancelarEdicion();
  }

  abrirCrearModal() {
    this.nuevoResiduo = { nombre: '', descripcion: '', tokensPorKg: 0 };
    this.showCrearModal = true;
  }

  crearResiduo() {
    if (!this.nuevoResiduo.nombre || this.nuevoResiduo.tokensPorKg < 0) return;
    this.guardando = true;
    this.residuosService.crearResiduo(this.nuevoResiduo).subscribe({
      next: () => {
        this.guardando = false;
        this.showCrearModal = false;
        this.cargarResiduos();
      },
      error: (err) => {
        this.guardando = false;
        alert(err?.error?.error || 'Error al crear el tipo de residuo');
      }
    });
  }

  cancelarCreacion() {
    this.showCrearModal = false;
    this.nuevoResiduo = { nombre: '', descripcion: '', tokensPorKg: 0 };
  }

  eliminarResiduo(residuo: any) {
    if (!confirm('¿Seguro que deseas eliminar este tipo de residuo?')) return;
    this.eliminando = true;
    this.residuosService.eliminarResiduo(residuo._id).subscribe({
      next: () => {
        this.eliminando = false;
        this.cargarResiduos();
      },
      error: () => {
        this.eliminando = false;
        alert('Error al eliminar el tipo de residuo');
      }
    });
  }
} 