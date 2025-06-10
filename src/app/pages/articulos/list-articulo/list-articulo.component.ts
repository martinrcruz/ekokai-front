import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NavController, AlertController, ToastController, IonicModule, IonContent } from '@ionic/angular';
import { ArticuloService, Articulo, PaginationInfo } from '../../../services/articulo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-articulo',
  standalone: false,
  templateUrl: './list-articulo.component.html',
  styleUrls: ['./list-articulo.component.scss'],
})
export class ListArticuloComponent implements OnInit, AfterViewChecked {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  articulos: Articulo[] = [];
  gruposUnicos: string[] = [];
  familiasUnicas: string[] = [];
  
  // Filtros
  filtroGrupo: string = '';
  filtroFamilia: string = '';
  textoBusqueda: string = '';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 100;
  pagination: PaginationInfo | null = null;
  
  // Estado
  loading = false;
  loadingGruposFamilias = false;
  error = '';

  // Control para scroll automático
  private shouldScrollToTop = false;

  // Para usar Math en el template
  Math = Math;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _articulos: ArticuloService
  ) {}

  async ngOnInit() {
    await this.loadArticulos();
    await this.loadGruposYFamilias();
  }

  ionViewDidEnter() {
    this.loadArticulos();
  }

  async loadArticulos(page: number = 1) {
    try {
      this.loading = true;
      this.error = '';
      this.currentPage = page;
      
      const req = await this._articulos.getArticulos(
        page, 
        this.itemsPerPage, 
        this.textoBusqueda, 
        this.filtroGrupo, 
        this.filtroFamilia
      );
      
      req.subscribe(
        (res: any) => {
          this.loading = false;
          if (res.ok) {
            this.articulos = res.articulos || [];
            this.pagination = res.pagination;
            // Marcar que se debe hacer scroll y ejecutarlo
            console.log('Ejecutando scroll to top para página:', page);
            this.shouldScrollToTop = true;
            this.scrollToTop();
          }
        },
        (error) => {
          console.error('Error al cargar artículos:', error);
          this.error = 'Error al cargar los artículos';
          this.loading = false;
          this.articulos = [];
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar los artículos';
      this.loading = false;
      this.articulos = [];
    }
  }

  async loadGruposYFamilias() {
    try {
      this.loadingGruposFamilias = true;
      // Cargar una muestra más grande de artículos para obtener grupos y familias únicos
      const req = await this._articulos.getArticulos(1, 1000); // Primera página con 1000 elementos
      req.subscribe(
        (res: any) => {
          this.loadingGruposFamilias = false;
          if (res.ok && res.articulos) {
            this.extraerGruposYFamilias(res.articulos);
          }
        },
        (error) => {
          console.error('Error al cargar grupos y familias:', error);
          this.loadingGruposFamilias = false;
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.loadingGruposFamilias = false;
    }
  }
  
  extraerGruposYFamilias(todosLosArticulos: Articulo[]) {
    // Extraer grupos únicos
    this.gruposUnicos = [...new Set(todosLosArticulos.map(a => a.grupo).filter(grupo => grupo))];
    
    // Extraer familias únicas
    this.familiasUnicas = [...new Set(todosLosArticulos.map(a => a.familia).filter(familia => familia))];
  }

  filtrar(event: any) {
    this.textoBusqueda = event.detail.value?.toLowerCase() || '';
    this.aplicarFiltros();
  }
  
  aplicarFiltros() {
    // Resetear a la primera página cuando se aplican filtros
    this.loadArticulos(1);
  }

  onGrupoChange() {
    this.aplicarFiltros();
  }

  onFamiliaChange() {
    this.aplicarFiltros();
  }

  // Método para hacer scroll to top
  private scrollToTop() {
    
    // Mostrar toast para debug (temporal)
    
    // Método inmediato para casos donde el ViewChild está disponible
    if (this.content) {
      this.content.scrollToTop(300);
    }
    
    // Método con timeout para asegurar que el DOM se actualice
    setTimeout(() => {
      this.forceScrollToTop();
    }, 100);
    
    // Método adicional con más delay para casos lentos
    setTimeout(() => {
      this.forceScrollToTop();
    }, 300);
  }

  // Método para forzar scroll con múltiples fallbacks
  private forceScrollToTop() {
    console.log('forceScrollToTop ejecutándose');
    
    // Método 1: ViewChild (más confiable)
    if (this.content) {
      console.log('Usando ViewChild para scroll (force)');
      this.content.scrollToTop(200);
      return;
    }

    // Método 2: Buscar ion-content específico de esta página
    try {
      const ionContent = document.querySelector('.page-container')?.closest('ion-content') as any;
      if (ionContent && typeof ionContent.scrollToTop === 'function') {
        console.log('Usando ion-content específico (force)');
        ionContent.scrollToTop(200);
        return;
      }
    } catch (error) {
      console.log('Error en método 2:', error);
    }

    // Método 3: Scroll nativo del contenedor
    try {
      const pageContainer = document.querySelector('.page-container');
      if (pageContainer) {
        console.log('Usando scroll nativo del contenedor (force)');
        pageContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    } catch (error) {
      console.log('Error en método 3:', error);
    }

    // Método 4: Scroll de ventana
    try {
      console.log('Usando window scroll (force)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.log('Error en window scroll:', error);
      // Fallback final inmediato
      window.scrollTo(0, 0);
    }
  }

  // Métodos de paginación
  goToPage(page: number) {
    if (page >= 1 && this.pagination && page <= this.pagination.totalPages && page !== this.currentPage) {
      this.loadArticulos(page);
    }
  }

  nextPage() {
    if (this.pagination && this.pagination.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.pagination && this.pagination.hasPrevPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const pages: number[] = [];
    const totalPages = this.pagination.totalPages;
    const current = this.currentPage;
    
    // Mostrar hasta 5 páginas alrededor de la actual
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  nuevoArticulo() {
    this.navCtrl.navigateForward('/articulos/create');
  }

  editarArticulo(id: string) {
    this.navCtrl.navigateForward(`/articulos/edit/${id}`);
  }

  async eliminarArticulo(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este artículo?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteArticulo(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteArticulo(id: string) {
    try {
      const req = await this._articulos.deleteArticulo(id);
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.mostrarToast('Artículo eliminado.');
            // Recargar la página actual
            this.loadArticulos(this.currentPage);
          }
        },
        (error) => {
          console.error('Error al eliminar artículo:', error);
          this.error = 'Error al eliminar el artículo';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al eliminar el artículo';
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  doRefresh(event: any) {
    this.loadArticulos(this.currentPage).then(() => {
      event.target.complete();
    });
  }

  // Método para optimizar el renderizado de la lista
  trackByArticuloId(index: number, item: Articulo): string {
    return item._id || index.toString();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToTop) {
      this.scrollToTop();
      this.shouldScrollToTop = false;
    }
  }
} 