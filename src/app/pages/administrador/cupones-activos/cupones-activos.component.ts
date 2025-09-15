import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CuponService, Cupon } from '../../../services/cupon.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cupones-activos',
  templateUrl: './cupones-activos.component.html',
  styleUrls: ['./cupones-activos.component.scss'],
  standalone: false
})
export class CuponesActivosComponent implements OnInit {
  cuponesActivos: Cupon[] = [];
  cuponesFiltrados: Cupon[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  filtroBusqueda = '';
  filtroEstado = '';
  filtroFechaExpiracion = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 20;
  
  // Estados
  pestanaActiva = 'activos'; // 'activos' | 'todos' | 'expirados'
  showFiltros = false;
  showDetalleModal = false;
  showCrearModal = false;
  cuponSeleccionado: Cupon | null = null;

  constructor(
    private cuponService: CuponService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarCuponesActivos();
  }

  async cargarCuponesActivos() {
    this.loading = true;
    this.error = null;
    try {
      this.cuponService.listarActivos().subscribe({
        next: (cupones) => {
          this.cuponesActivos = cupones;
          this.aplicarFiltros();
          console.log('Cupones activos cargados:', this.cuponesActivos.length);
        },
        error: (error) => {
          console.error('Error al cargar cupones activos:', error);
          this.error = 'Error al cargar cupones activos';
        }
      });
    } catch (error) {
      console.error('Error al cargar cupones activos:', error);
      this.error = 'Error al cargar los cupones activos';
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

  get cuponesPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.cuponesFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.cuponesFiltrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getEstadoColor(activo: boolean | undefined, fechaExpiracion?: Date | string): string {
    if (!activo) return 'danger';
    if (fechaExpiracion && new Date(fechaExpiracion) < new Date()) return 'warning';
    return 'success';
  }

  getEstadoTexto(activo: boolean | undefined, fechaExpiracion?: Date | string): string {
    if (!activo) return 'Inactivo';
    if (fechaExpiracion && new Date(fechaExpiracion) < new Date()) return 'Expirado';
    return 'Activo';
  }

  getEstadoIcon(activo: boolean | undefined, fechaExpiracion?: Date | string): string {
    if (!activo) return 'close-circle';
    if (fechaExpiracion && new Date(fechaExpiracion) < new Date()) return 'time';
    return 'checkmark-circle';
  }

  formatearFecha(fecha: Date | string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Métodos para estadísticas
  getTotalCupones(): number {
    return this.cuponesFiltrados.length;
  }

  getCuponesActivos(): number {
    return this.cuponesFiltrados.filter(c => c.activo).length;
  }

  getCuponesExpirados(): number {
    return this.cuponesFiltrados.filter(c => 
      c.fechaExpiracion && new Date(c.fechaExpiracion) < new Date()
    ).length;
  }

  getTotalTokensRequeridos(): number {
    return this.cuponesFiltrados.reduce((total, cupon) => total + (cupon.tokensRequeridos || 0), 0);
  }

  // Métodos para acciones
  verDetalle(cupon: Cupon) {
    this.cuponSeleccionado = cupon;
    this.showDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.cuponSeleccionado = null;
  }

  async activarCupon(cupon: Cupon) {
    const alert = await this.alertController.create({
      header: 'Confirmar activación',
      message: `¿Estás seguro de que quieres activar el cupón "${cupon.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Activar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Activando cupón...'
            });
            await loading.present();

            try {
              await this.cuponService.activar(cupon._id!).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón activado correctamente');
              this.cargarCuponesActivos();
            } catch (error) {
              console.error('Error activando cupón:', error);
              this.mostrarAlerta('Error', 'No se pudo activar el cupón');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async desactivarCupon(cupon: Cupon) {
    const alert = await this.alertController.create({
      header: 'Confirmar desactivación',
      message: `¿Estás seguro de que quieres desactivar el cupón "${cupon.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Desactivar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Desactivando cupón...'
            });
            await loading.present();

            try {
              await this.cuponService.desactivar(cupon._id!).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón desactivado correctamente');
              this.cargarCuponesActivos();
            } catch (error) {
              console.error('Error desactivando cupón:', error);
              this.mostrarAlerta('Error', 'No se pudo desactivar el cupón');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarCupon(cupon: Cupon) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el cupón "${cupon.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando cupón...'
            });
            await loading.present();

            try {
              await this.cuponService.eliminar(cupon._id!).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón eliminado correctamente');
              this.cargarCuponesActivos();
            } catch (error) {
              console.error('Error eliminando cupón:', error);
              this.mostrarAlerta('Error', 'No se pudo eliminar el cupón');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  aplicarFiltros() {
    let cuponesFiltrados = [...this.cuponesActivos];

    // Filtrar por pestaña
    switch (this.pestanaActiva) {
      case 'activos':
        cuponesFiltrados = cuponesFiltrados.filter(c => c.activo);
        break;
      case 'expirados':
        cuponesFiltrados = cuponesFiltrados.filter(c => 
          c.fechaExpiracion && new Date(c.fechaExpiracion) < new Date()
        );
        break;
      case 'todos':
        // No filtrar por estado
        break;
    }

    // Aplicar filtros de búsqueda
    if (this.filtroBusqueda) {
      const busqueda = this.filtroBusqueda.toLowerCase();
      cuponesFiltrados = cuponesFiltrados.filter(cupon =>
        cupon.nombre?.toLowerCase().includes(busqueda) ||
        cupon.descripcion?.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar filtro de estado
    if (this.filtroEstado) {
      cuponesFiltrados = cuponesFiltrados.filter(cupon => {
        switch (this.filtroEstado) {
          case 'activo':
            return cupon.activo;
          case 'inactivo':
            return !cupon.activo;
          case 'expirado':
            return cupon.fechaExpiracion && new Date(cupon.fechaExpiracion) < new Date();
          default:
            return true;
        }
      });
    }

    // Aplicar filtro de fecha de expiración
    if (this.filtroFechaExpiracion) {
      const fechaFiltro = new Date(this.filtroFechaExpiracion);
      cuponesFiltrados = cuponesFiltrados.filter(cupon =>
        cupon.fechaExpiracion && new Date(cupon.fechaExpiracion) <= fechaFiltro
      );
    }

    this.cuponesFiltrados = cuponesFiltrados;
    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroBusqueda = '';
    this.filtroEstado = '';
    this.filtroFechaExpiracion = '';
    this.aplicarFiltros();
  }

  refrescarCupones() {
    this.cargarCuponesActivos();
  }
}
