import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

export interface FiltroConfig {
  tipo: 'texto' | 'select' | 'fecha' | 'rango';
  icono: string;
  titulo: string;
  placeholder?: string;
  opciones?: Array<{ valor: string; etiqueta: string }>;
  valor?: any;
  nombre: string;
}

@Component({
  selector: 'app-filtros-estandarizados',
  templateUrl: './filtros-estandarizados.component.html',
  styleUrls: ['./filtros-estandarizados.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class FiltrosEstandarizadosComponent {
  @Input() filtros: FiltroConfig[] = [];
  @Input() titulo: string = 'Filtros de Búsqueda';
  @Input() subtitulo: string = 'Refina los resultados según tus criterios';
  @Input() mostrarBotonLimpiar: boolean = true;
  
  @Output() filtroCambiado = new EventEmitter<{ nombre: string; valor: any }>();
  @Output() limpiarFiltros = new EventEmitter<void>();

  onFiltroChange(nombre: string, valor: any) {
    this.filtroCambiado.emit({ nombre, valor });
  }

  onFiltroChangeEvent(evento: { nombre: string; valor: any }) {
    this.filtroCambiado.emit(evento);
  }

  onLimpiarFiltros() {
    this.limpiarFiltros.emit();
  }

  // Función para determinar si es un icono de Bootstrap o Ionic
  isBootstrapIcon(icono: string): boolean {
    return icono.startsWith('bi-');
  }

  // Función para obtener el nombre del icono sin el prefijo
  getIconName(icono: string): string {
    if (this.isBootstrapIcon(icono)) {
      return icono.replace('bi-', '');
    }
    return icono;
  }

  // Función para obtener la clase CSS del icono
  getIconClass(icono: string): string {
    if (this.isBootstrapIcon(icono)) {
      return `bi ${icono}`;
    }
    return '';
  }
}
