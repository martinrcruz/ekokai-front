import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, IonicModule } from '@ionic/angular';
import { ArticuloService } from '../../../services/articulo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-articulo',
  standalone: false,
  templateUrl: './list-articulo.component.html',
  styleUrls: ['./list-articulo.component.scss'],
})
export class ListArticuloComponent implements OnInit {
  articulos: any[] = [];
  filteredArticulos: any[] = [];
  gruposUnicos: string[] = [];
  familiasUnicas: string[] = [];
  filtroGrupo: string = '';
  filtroFamilia: string = '';
  textoBusqueda: string = '';
  loading = true;
  error = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _articulos: ArticuloService
  ) {}

  async ngOnInit() {
    await this.loadArticulos();
  }

  ionViewDidEnter() {
    this.loadArticulos();
  }

  async loadArticulos() {
    try {
      this.loading = true;
      const req = await this._articulos.getArticulos();
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.articulos = res.articulos;
            this.filteredArticulos = [...this.articulos];
            this.extraerGruposYFamilias();
          }
        },
        (error) => {
          console.error('Error al cargar artículos:', error);
          this.error = 'Error al cargar los artículos';
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error al cargar los artículos';
    } finally {
      this.loading = false;
    }
  }
  
  extraerGruposYFamilias() {
    // Extraer grupos únicos
    this.gruposUnicos = [...new Set(this.articulos.map(a => a.grupo).filter(grupo => grupo))];
    
    // Extraer familias únicas
    this.familiasUnicas = [...new Set(this.articulos.map(a => a.familia).filter(familia => familia))];
  }

  filtrar(event: any) {
    this.textoBusqueda = event.detail.value?.toLowerCase() || '';
    this.aplicarFiltros();
  }
  
  aplicarFiltros() {
    // Resetear los artículos filtrados
    this.filteredArticulos = [...this.articulos];
    
    // Aplicar filtro de texto si existe
    if (this.textoBusqueda.trim()) {
      this.filteredArticulos = this.filteredArticulos.filter(a => {
        const codigo = a.codigo?.toLowerCase() || '';
        const descripcion = a.descripcionArticulo?.toLowerCase() || '';
        const grupo = a.grupo?.toLowerCase() || '';
        const familia = a.familia?.toLowerCase() || '';
        return codigo.includes(this.textoBusqueda) || 
               descripcion.includes(this.textoBusqueda) || 
               grupo.includes(this.textoBusqueda) || 
               familia.includes(this.textoBusqueda);
      });
    }
    
    // Aplicar filtro de grupo si está seleccionado
    if (this.filtroGrupo) {
      this.filteredArticulos = this.filteredArticulos.filter(a => a.grupo === this.filtroGrupo);
    }
    
    // Aplicar filtro de familia si está seleccionado
    if (this.filtroFamilia) {
      this.filteredArticulos = this.filteredArticulos.filter(a => a.familia === this.filtroFamilia);
    }
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
            this.articulos = this.articulos.filter(a => a._id !== id);
            this.filteredArticulos = this.filteredArticulos.filter(a => a._id !== id);
            this.mostrarToast('Artículo eliminado.');
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
    this.loadArticulos().then(() => {
      event.target.complete();
    });
  }
} 