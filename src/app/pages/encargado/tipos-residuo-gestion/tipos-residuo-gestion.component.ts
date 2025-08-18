import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResiduosService } from 'src/app/services/residuos.service';
import { IonicModule } from '@ionic/angular';

type EstadoFiltro = '' | 'activo' | 'inactivo';

export interface Residuo {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  tokens: number;
  activo: boolean;
  updatedAt: string; // ISO
}

@Component({
  selector: 'app-tipos-residuo-gestion',
  standalone: false,
  templateUrl: './tipos-residuo-gestion.component.html',
  styleUrls: ['./tipos-residuo-gestion.component.scss'],
})
export class TiposResiduoGestionComponent implements OnInit {
  // ----------- DATA -----------
  residuos: Residuo[] = [];

  // ----------- FILTROS -----------
  filtroBusqueda = '';
  filtroCategoria = '';
  filtroEstado: EstadoFiltro = '';

  categorias: string[] = ['General', 'Plástico', 'Papel/Cartón', 'Vidrio', 'Metal', 'Orgánico', 'Ropa'];

  // ----------- PAGINACIÓN -----------
  pageSize = 10;
  pageIndex = 1; // 1-based

  // ----------- MODALES -----------
  isCreateOpen = false;
  isEditOpen = false;
  formCreate!: FormGroup;
  formEdit!: FormGroup;
  editingId: string | null = null;
  creating = false;
  updating = false;

  constructor(private fb: FormBuilder, private residuosService: ResiduosService) {}

  ngOnInit(): void {
    this.formCreate = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      categoria: ['', Validators.required],
      unidad: ['kilos', Validators.required],
      tokens: [0, [Validators.required, Validators.min(0)]],
      activo: [true, Validators.required]
    });

    this.formEdit = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      categoria: ['', Validators.required],
      unidad: ['kilos', Validators.required],
      tokens: [0, [Validators.required, Validators.min(0)]],
      activo: [true, Validators.required]
    });

    this.cargarResiduos();
  }

  // -----------------------------------
  // CARGA DE DATOS (backend)
  // -----------------------------------
  cargarResiduos(): void {
    this.residuosService.getResiduos().subscribe({
      next: (data: any[]) => {
        const mapped: Residuo[] = (Array.isArray(data) ? data : []).map((r: any) => {
          const id = r?._id || r?.id || String(Date.now());
          const nombre = r?.nombre || '';
          const categoria = r?.categoria || r?.tipo || r?.categoriaNombre || '-';
          const unidad = r?.unidad || 'kilos';
          const tokens = Number(r?.tokens ?? r?.tokensPorKg ?? r?.valor ?? 0) || 0;
          const activo = typeof r?.activo === 'boolean' ? r.activo : true;
          const updatedAt = r?.updatedAt || r?.ultimaModificacion || r?.createdAt || new Date().toISOString();
          return { id, nombre, categoria, unidad, tokens, activo, updatedAt } as Residuo;
        });
        this.residuos = mapped;
        this.pageIndex = 1;
      },
      error: (err) => {
        console.error('[TiposResiduoGestion] Error cargando residuos:', err);
        this.residuos = [];
      }
    });
  }

  // -----------------------------------
  // FILTROS
  // -----------------------------------
  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroCategoria = '';
    this.filtroEstado = '';
    this.pageIndex = 1;
  }

  get residuosFiltrados(): Residuo[] {
    const texto = this.filtroBusqueda.trim().toLowerCase();
    return this.residuos.filter(r => {
      const matchTexto =
        !texto ||
        r.nombre.toLowerCase().includes(texto) ||
        r.categoria.toLowerCase().includes(texto) ||
        r.unidad.toLowerCase().includes(texto);
      const matchCategoria = !this.filtroCategoria || r.categoria === this.filtroCategoria;
      const matchEstado =
        this.filtroEstado === '' ||
        (this.filtroEstado === 'activo' && r.activo) ||
        (this.filtroEstado === 'inactivo' && !r.activo);
      return matchTexto && matchCategoria && matchEstado;
    });
  }

  // -----------------------------------
  // PAGINACIÓN
  // -----------------------------------
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.residuosFiltrados.length / this.pageSize));
  }

  get pageItems(): Residuo[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.residuosFiltrados.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    const p = Math.min(Math.max(page, 1), this.totalPages);
    if (p !== this.pageIndex) this.pageIndex = p;
  }

  firstPage(): void { this.goToPage(1); }
  prevPage(): void { this.goToPage(this.pageIndex - 1); }
  nextPage(): void { this.goToPage(this.pageIndex + 1); }
  lastPage(): void { this.goToPage(this.totalPages); }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
  }

  pagesToShow(): number[] {
    const pages: number[] = [];
    const last = this.totalPages;
    const current = this.pageIndex;

    const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };

    add(1);
    if (current - 1 > 2) add(current - 1);
    if (current > 1 && current < last) add(current);
    if (current + 1 < last - 1) add(current + 1);
    add(last);

    return pages.filter(p => p >= 1 && p <= last).sort((a, b) => a - b);
  }

  // -----------------------------------
  // MODAL: CREAR
  // -----------------------------------
  openCreate(): void {
    this.formCreate.reset({
      nombre: '',
      descripcion: '',
      categoria: '',
      unidad: 'kilos',
      tokens: 0,
      activo: true
    });
    this.isCreateOpen = true;
  }

  closeCreate(): void {
    this.isCreateOpen = false;
  }

  saveCreate(): void {
    if (this.formCreate.invalid) return;
    const v = this.formCreate.value;
    const payload: any = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria,
      unidad: v.unidad,
      tokensPorKg: Number(v.tokens) || 0,
      activo: !!v.activo
    };

    this.creating = true;
    this.residuosService.crearResiduo(payload).subscribe({
      next: () => {
        this.cargarResiduos();
        this.closeCreate();
      },
      error: (err) => {
        console.error('[TiposResiduoGestion] Error creando residuo:', err);
      },
      complete: () => {
        this.creating = false;
      }
    });
  }

  // -----------------------------------
  // MODAL: EDITAR
  // -----------------------------------
  openEdit(residuo: Residuo): void {
    this.editingId = residuo.id;
    this.formEdit.reset({
      nombre: residuo.nombre,
      descripcion: (residuo as any).descripcion || '',
      categoria: residuo.categoria,
      unidad: residuo.unidad || 'kilos',
      tokens: residuo.tokens,
      activo: residuo.activo
    });
    this.isEditOpen = true;
  }

  closeEdit(): void {
    this.isEditOpen = false;
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editingId || this.formEdit.invalid) return;
    const v = this.formEdit.value;
    const payload: any = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria,
      unidad: v.unidad,
      tokensPorKg: Number(v.tokens) || 0,
      activo: !!v.activo
    };

    this.updating = true;
    this.residuosService.actualizarResiduo(this.editingId, payload).subscribe({
      next: () => {
        this.cargarResiduos();
        this.closeEdit();
      },
      error: (err) => {
        console.error('[TiposResiduoGestion] Error actualizando residuo:', err);
      },
      complete: () => {
        this.updating = false;
      }
    });
  }

  // -----------------------------------
  // UTILS
  // -----------------------------------
  trackById = (_: number, r: Residuo) => r.id;

  estadoLabel(r: Residuo): string {
    return r.activo ? 'Activo' : 'Inactivo';
  }

  fechaCorta(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
  }
}
