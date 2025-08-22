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

  getImagenPremio(premio: Premio): string {
    // Si el premio ya tiene una imagen personalizada, usarla
    if (premio.imagen) {
      return premio.imagen;
    }

    // Mapeo inteligente de imágenes basado en el nombre del premio
    const nombreLower = premio.nombre.toLowerCase();
    const categoriaLower = premio.categoria.toLowerCase();

    // Mapeo por nombre específico del premio
    if (nombreLower.includes('audífono') || nombreLower.includes('audifono') || nombreLower.includes('headphone') || nombreLower.includes('auricular')) {
      return 'assets/premios/audifonos.svg';
    }
    if (nombreLower.includes('celular') || nombreLower.includes('teléfono') || nombreLower.includes('telefono') || nombreLower.includes('smartphone') || nombreLower.includes('iphone')) {
      return 'assets/premios/celular.svg';
    }
    if (nombreLower.includes('laptop') || nombreLower.includes('notebook') || nombreLower.includes('computadora') || nombreLower.includes('portátil')) {
      return 'assets/premios/laptop.svg';
    }
    if (nombreLower.includes('tablet') || nombreLower.includes('ipad')) {
      return 'assets/premios/tablet.svg';
    }
    if (nombreLower.includes('café') || nombreLower.includes('cafe') || nombreLower.includes('coffee')) {
      return 'assets/premios/cafe.svg';
    }
    if (nombreLower.includes('libro') || nombreLower.includes('book')) {
      return 'assets/premios/libro.svg';
    }
    if (nombreLower.includes('pelota') || nombreLower.includes('ball') || nombreLower.includes('fútbol') || nombreLower.includes('futbol')) {
      return 'assets/premios/pelota.svg';
    }
    if (nombreLower.includes('remera') || nombreLower.includes('camiseta') || nombreLower.includes('shirt') || nombreLower.includes('tshirt')) {
      return 'assets/premios/remera.svg';
    }
    if (nombreLower.includes('gorra') || nombreLower.includes('cap') || nombreLower.includes('sombrero')) {
      return 'assets/premios/gorra.svg';
    }
    if (nombreLower.includes('mochila') || nombreLower.includes('backpack') || nombreLower.includes('bolso')) {
      return 'assets/premios/mochila.svg';
    }
    if (nombreLower.includes('taza') || nombreLower.includes('mug') || nombreLower.includes('vaso')) {
      return 'assets/premios/taza.svg';
    }
    if (nombreLower.includes('planta') || nombreLower.includes('maceta') || nombreLower.includes('flower') || nombreLower.includes('jardín')) {
      return 'assets/premios/planta.svg';
    }
    if (nombreLower.includes('juego') || nombreLower.includes('juguete') || nombreLower.includes('toy') || nombreLower.includes('game')) {
      return 'assets/premios/juego.svg';
    }
    if (nombreLower.includes('música') || nombreLower.includes('musica') || nombreLower.includes('music') || nombreLower.includes('instrumento')) {
      return 'assets/premios/musica.svg';
    }
    if (nombreLower.includes('arte') || nombreLower.includes('pintura') || nombreLower.includes('dibujo') || nombreLower.includes('manualidad')) {
      return 'assets/premios/arte.svg';
    }
    if (nombreLower.includes('mascota') || nombreLower.includes('perro') || nombreLower.includes('gato') || nombreLower.includes('pet')) {
      return 'assets/premios/mascota.svg';
    }
    if (nombreLower.includes('herramienta') || nombreLower.includes('martillo') || nombreLower.includes('destornillador') || nombreLower.includes('tool')) {
      return 'assets/premios/herramienta.svg';
    }
    if (nombreLower.includes('belleza') || nombreLower.includes('cosmético') || nombreLower.includes('cosmetico') || nombreLower.includes('crema')) {
      return 'assets/premios/belleza.svg';
    }
    if (nombreLower.includes('deporte') || nombreLower.includes('gimnasio') || nombreLower.includes('fitness') || nombreLower.includes('ejercicio')) {
      return 'assets/premios/deporte.svg';
    }
    if (nombreLower.includes('hogar') || nombreLower.includes('casa') || nombreLower.includes('doméstico') || nombreLower.includes('domestico')) {
      return 'assets/premios/hogar.svg';
    }
    if (nombreLower.includes('auto') || nombreLower.includes('carro') || nombreLower.includes('vehículo') || nombreLower.includes('vehiculo')) {
      return 'assets/premios/auto.svg';
    }

    // Mapeo por categoría si no se encontró por nombre
    if (categoriaLower.includes('electrónic') || categoriaLower.includes('tech') || categoriaLower.includes('digital')) {
      return 'assets/premios/electronico.svg';
    }
    if (categoriaLower.includes('hogar') || categoriaLower.includes('casa') || categoriaLower.includes('doméstic')) {
      return 'assets/premios/hogar.svg';
    }
    if (categoriaLower.includes('deporte') || categoriaLower.includes('fitness') || categoriaLower.includes('ejercicio')) {
      return 'assets/premios/deporte.svg';
    }
    if (categoriaLower.includes('ropa') || categoriaLower.includes('vestimenta') || categoriaLower.includes('accesorio')) {
      return 'assets/premios/ropa.svg';
    }
    if (categoriaLower.includes('libro') || categoriaLower.includes('lectura') || categoriaLower.includes('educación')) {
      return 'assets/premios/libro.svg';
    }
    if (categoriaLower.includes('comida') || categoriaLower.includes('alimento') || categoriaLower.includes('bebida')) {
      return 'assets/premios/comida.svg';
    }
    if (categoriaLower.includes('belleza') || categoriaLower.includes('cosmético') || categoriaLower.includes('cuidado')) {
      return 'assets/premios/belleza.svg';
    }
    if (categoriaLower.includes('juego') || nombreLower.includes('juguete') || nombreLower.includes('entretenimiento')) {
      return 'assets/premios/juego.svg';
    }
    if (categoriaLower.includes('jardín') || categoriaLower.includes('planta') || categoriaLower.includes('naturaleza')) {
      return 'assets/premios/planta.svg';
    }
    if (categoriaLower.includes('música') || categoriaLower.includes('instrumento') || categoriaLower.includes('audio')) {
      return 'assets/premios/musica.svg';
    }
    if (categoriaLower.includes('arte') || categoriaLower.includes('manualidad') || categoriaLower.includes('creatividad')) {
      return 'assets/premios/arte.svg';
    }
    if (categoriaLower.includes('mascota') || categoriaLower.includes('animal') || categoriaLower.includes('veterinaria')) {
      return 'assets/premios/mascota.svg';
    }
    if (categoriaLower.includes('auto') || categoriaLower.includes('vehículo') || categoriaLower.includes('transporte')) {
      return 'assets/premios/auto.svg';
    }
    if (categoriaLower.includes('herramienta') || categoriaLower.includes('construcción') || categoriaLower.includes('bricolaje')) {
      return 'assets/premios/herramienta.svg';
    }

    // Imagen por defecto si no se encontró coincidencia
    return 'assets/icon/favicon.png';
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroCategoria = '';
  }

  // Métodos para estadísticas
  getPremiosActivos(): number {
    return this.premios.filter(p => p.activo).length;
  }

  getPremiosDestacados(): number {
    return this.premios.filter(p => p.destacado).length;
  }

  getPremiosPorCategoria(categoria: string): number {
    return this.premios.filter(p => p.categoria === categoria).length;
  }

  getTopPremios(): Premio[] {
    return [...this.premios]
      .sort((a, b) => b.cuponesRequeridos - a.cuponesRequeridos)
      .slice(0, 10);
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return 'trophy';
    if (rank === 2) return 'medal';
    if (rank === 3) return 'ribbon';
    return 'star';
  }
}
