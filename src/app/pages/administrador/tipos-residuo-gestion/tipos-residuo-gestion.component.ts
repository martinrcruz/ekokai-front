import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ResiduosService } from 'src/app/services/residuos.service';

@Component({
  selector: 'app-tipos-residuo-gestion',
  templateUrl: './tipos-residuo-gestion.component.html',
  styleUrls: ['./tipos-residuo-gestion.component.scss'],
  standalone:false
})
export class TiposResiduoGestionComponent implements OnInit {
  residuos: any[] = [];
  residuosFiltrados: any[] = [];
  loading = false;
  showEditarModal = false;
  residuoEditando: any = null;
  guardando = false;
  showCrearModal = false;
  nuevoResiduo: any = { nombre: '', descripcion: '', tokensPorKg: '' };
  eliminando = false;

  // Filtros
  filtroNombre = '';
  filtroTokens = '';

  // Estadísticas
  promedioTokens = 0;
  maxTokens = 0;

  constructor(private residuosService: ResiduosService) {}

  ngOnInit() {
    this.cargarResiduos();
  }

  // Watchers para filtros
  onFiltroNombreChange() {
    this.aplicarFiltros();
  }

  onFiltroTokensChange() {
    this.aplicarFiltros();
  }

  cargarResiduos() {
    this.loading = true;
    this.residuosService.getResiduos().subscribe({
      next: (res) => {
        console.log('📋 [COMPONENT] Residuos cargados:', res);
        this.residuos = res || [];
        this.calcularEstadisticas();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [COMPONENT] Error al cargar residuos:', error);
        this.residuos = [];
        this.residuosFiltrados = [];
        this.loading = false;
        alert('Error al cargar los tipos de residuo');
      }
    });
  }

  calcularEstadisticas() {
    if (this.residuos.length === 0) {
      this.promedioTokens = 0;
      this.maxTokens = 0;
      return;
    }

    const tokens = this.residuos.map(r => r.tokensPorKg || 0);
    this.promedioTokens = tokens.reduce((sum, token) => sum + token, 0) / tokens.length;
    this.maxTokens = Math.max(...tokens);
  }

  aplicarFiltros() {
    this.residuosFiltrados = this.residuos.filter(residuo => {
      const cumpleNombre = !this.filtroNombre ||
        residuo.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        residuo.descripcion.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const cumpleTokens = !this.filtroTokens || this.cumpleFiltroTokens(residuo.tokensPorKg);

      return cumpleNombre && cumpleTokens;
    });
  }

  cumpleFiltroTokens(tokens: number): boolean {
    switch (this.filtroTokens) {
      case 'bajo': return tokens >= 0 && tokens <= 10;
      case 'medio': return tokens >= 11 && tokens <= 20;
      case 'alto': return tokens >= 21;
      default: return true;
    }
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroTokens = '';
    this.aplicarFiltros();
  }

  getTokenCategory(tokens: number): string {
    if (tokens >= 0 && tokens <= 10) return 'Bajo';
    if (tokens >= 11 && tokens <= 20) return 'Medio';
    return 'Alto';
  }

  editarResiduo(residuo: any) {
    this.residuoEditando = { ...residuo };
    this.showEditarModal = true;
  }

  guardarEdicion() {
    if (!this.residuoEditando) return;

    console.log('🟡 [COMPONENT] Intentando actualizar residuo:', this.residuoEditando);

    // Validar datos requeridos
    if (!this.residuoEditando.nombre || this.residuoEditando.nombre.trim() === '') {
      alert('Por favor ingresa el nombre del tipo de residuo');
      return;
    }

    if (!this.residuoEditando.descripcion || this.residuoEditando.descripcion.trim() === '') {
      alert('Por favor ingresa la descripción del tipo de residuo');
      return;
    }

    // Validar tokens
    if (!this.residuoEditando.tokensPorKg || this.residuoEditando.tokensPorKg === '') {
      alert('Por favor ingresa un valor para los tokens por kilogramo');
      return;
    }

    // Convertir a número
    const tokensPorKg = parseFloat(this.residuoEditando.tokensPorKg);
    if (isNaN(tokensPorKg) || tokensPorKg < 0) {
      alert('Por favor ingresa un número válido mayor o igual a 0 para los tokens por kilogramo');
      return;
    }

    const datosResiduo = {
      nombre: this.residuoEditando.nombre.trim(),
      descripcion: this.residuoEditando.descripcion.trim(),
      tokensPorKg: tokensPorKg
    };

    console.log('📋 [COMPONENT] Datos a enviar para actualización:', datosResiduo);

    this.guardando = true;
    this.residuosService.actualizarResiduo(this.residuoEditando._id, datosResiduo).subscribe({
      next: (response) => {
        console.log('✅ [COMPONENT] Residuo actualizado:', response);
        this.guardando = false;
        this.showEditarModal = false;
        this.cargarResiduos();
        alert('Tipo de residuo actualizado exitosamente');
      },
      error: (error) => {
        console.error('❌ [COMPONENT] Error al actualizar:', error);
        this.guardando = false;
        alert(error?.error?.message || 'Error al guardar los cambios');
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
    this.nuevoResiduo = { nombre: '', descripcion: '', tokensPorKg: '' };
    this.showCrearModal = true;
  }

  crearResiduo() {
    console.log('🟡 [COMPONENT] Intentando crear residuo:', this.nuevoResiduo);

    // Validar datos requeridos
    if (!this.nuevoResiduo.nombre || this.nuevoResiduo.nombre.trim() === '') {
      alert('Por favor ingresa el nombre del tipo de residuo');
      return;
    }

    if (!this.nuevoResiduo.descripcion || this.nuevoResiduo.descripcion.trim() === '') {
      alert('Por favor ingresa la descripción del tipo de residuo');
      return;
    }

    // Validar tokens
    if (!this.nuevoResiduo.tokensPorKg || this.nuevoResiduo.tokensPorKg === '') {
      alert('Por favor ingresa un valor para los tokens por kilogramo');
      return;
    }

    // Convertir a número
    const tokensPorKg = parseFloat(this.nuevoResiduo.tokensPorKg);
    if (isNaN(tokensPorKg) || tokensPorKg < 0) {
      alert('Por favor ingresa un número válido mayor o igual a 0 para los tokens por kilogramo');
      return;
    }

    const datosResiduo = {
      nombre: this.nuevoResiduo.nombre.trim(),
      descripcion: this.nuevoResiduo.descripcion.trim(),
      tokensPorKg: tokensPorKg
    };

    console.log('📋 [COMPONENT] Datos a enviar:', datosResiduo);

    this.guardando = true;
    this.residuosService.crearResiduo(datosResiduo).subscribe({
      next: (response) => {
        console.log('✅ [COMPONENT] Residuo creado:', response);
        this.guardando = false;
        this.showCrearModal = false;
        this.cargarResiduos();
        alert('Tipo de residuo creado exitosamente');
      },
      error: (error) => {
        console.error('❌ [COMPONENT] Error al crear:', error);
        this.guardando = false;
        alert(error?.error?.message || 'Error al crear el tipo de residuo');
      }
    });
  }

  cancelarCreacion() {
    this.showCrearModal = false;
    this.nuevoResiduo = { nombre: '', descripcion: '', tokensPorKg: '' };
  }





  eliminarResiduo(residuo: any) {
    if (!confirm(`¿Seguro que deseas eliminar el tipo de residuo "${residuo.nombre}"?`)) return;
    this.eliminando = true;
    this.residuosService.eliminarResiduo(residuo._id).subscribe({
      next: (response) => {
        console.log('✅ [COMPONENT] Residuo eliminado:', response);
        this.eliminando = false;
        this.cargarResiduos();
        alert('Tipo de residuo eliminado exitosamente');
      },
      error: (error) => {
        console.error('❌ [COMPONENT] Error al eliminar:', error);
        this.eliminando = false;
        alert(error?.error?.message || 'Error al eliminar el tipo de residuo');
      }
    });
  }
}
