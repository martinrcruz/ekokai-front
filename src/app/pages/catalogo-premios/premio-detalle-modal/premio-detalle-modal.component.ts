import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Premio } from 'src/app/services/premio.service';

@Component({
  selector: 'app-premio-detalle-modal',
  templateUrl: './premio-detalle-modal.component.html',
  styleUrls: ['./premio-detalle-modal.component.scss'],
  standalone: false
})
export class PremioDetalleModalComponent {
  @Input() premio!: Premio;

  constructor(private modalCtrl: ModalController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  canjearPremio() {
    this.modalCtrl.dismiss({ canjear: true });
  }

  getImagenPremio(): string {
    // Si el premio ya tiene una imagen personalizada, usarla
    if (this.premio.imagen) {
      return this.premio.imagen;
    }

    // Mapeo inteligente de imágenes basado en el nombre del premio
    const nombreLower = this.premio.nombre.toLowerCase();
    const categoriaLower = this.premio.categoria.toLowerCase();

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
    if (categoriaLower.includes('juego') || categoriaLower.includes('juguete') || categoriaLower.includes('entretenimiento')) {
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
}
