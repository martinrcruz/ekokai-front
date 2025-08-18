import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { AlertController, LoadingController } from '@ionic/angular';
import { CuponService } from 'src/app/services/cupon.service';
import { ArticuloService } from 'src/app/services/articulo.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
  standalone: false,
})
export class MarketplaceComponent implements OnInit {
  cupones: any[] = [];
  productos: any[] = [];
  loading = false;
  selectedTab = 'cupones';
  filtroCategoria = '';
  filtroEstado = '';
  filtroBusqueda = '';
  categorias: string[] = ['Alimentación', 'Belleza', 'Hogar', 'Tecnología', 'Otros'];
  estados: string[] = ['Activo', 'Inactivo', 'Expirado'];

  // Gráfico de ventas por categoría
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4CAF50', '#FF6B35', '#3498db', '#9b59b6', '#e74c3c'],
        label: 'Ventas por categoría'
      }
    ]
  };

  // Gráfico de cupones más populares
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  barChartType: 'bar' = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Usos', backgroundColor: '#FF6B35' }
    ]
  };

  constructor(
    private cuponService: CuponService,
    private articuloService: ArticuloService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.loading = true;

    try {
      // Cargar cupones desde el backend
      this.cuponService.listar().subscribe({
        next: (cupones) => {
          console.log('Cupones cargados:', cupones);
          this.cupones = cupones.map(cupon => ({
            id: cupon._id,
            nombre: cupon.nombre,
            categoria: cupon.descripcion || 'General',
            descuento: cupon.tokensRequeridos || 0,
            usos: 0, // Se puede agregar al modelo si es necesario
            maxUsos: 100,
            activo: cupon.activo !== undefined ? cupon.activo : true,
            fechaExpiracion: cupon.fechaExpiracion ? new Date(cupon.fechaExpiracion).toLocaleDateString() : 'Sin fecha límite',
            tokensRequeridos: cupon.tokensRequeridos || 0
          }));
          this.prepararGraficos();
        },
        error: (error) => {
          console.error('Error cargando cupones:', error);
          this.mostrarAlerta('Error', 'No se pudieron cargar los cupones. Verifica la conexión al servidor.');
          // Cargar datos de ejemplo si hay error
          this.cargarDatosEjemplo();
        }
      });

      // Cargar productos desde el backend
      this.articuloService.getArticulos().subscribe({
        next: (response) => {
          console.log('Productos cargados:', response);
          this.productos = response.articulos.map(articulo => ({
            id: articulo._id,
            nombre: articulo.descripcionArticulo,
            categoria: articulo.grupo || 'General',
            precio: articulo.precioVenta || 0,
            tokens: Math.round((articulo.precioVenta || 0) * 2),
            stock: articulo.cantidad || 0,
            vendidos: 0,
            codigo: articulo.codigo || '',
            familia: articulo.familia || ''
          }));
          this.prepararGraficos();
        },
        error: (error) => {
          console.error('Error cargando productos:', error);
          this.mostrarAlerta('Error', 'No se pudieron cargar los productos. Verifica la conexión al servidor.');
          // Cargar datos de ejemplo si hay error
          this.cargarDatosEjemplo();
        }
      });

    } catch (error) {
      console.error('Error en cargarDatos:', error);
      this.mostrarAlerta('Error', 'Error al cargar los datos');
      this.cargarDatosEjemplo();
    } finally {
      this.loading = false;
    }
  }

  cargarDatosEjemplo() {
    // Datos de ejemplo para cuando el backend no está disponible
    this.cupones = [
      { id: '1', nombre: 'Descuento 20% Alimentación', categoria: 'Alimentación', descuento: 20, usos: 150, maxUsos: 200, activo: true, fechaExpiracion: '2024-12-31', tokensRequeridos: 50 },
      { id: '2', nombre: '2x1 Belleza', categoria: 'Belleza', descuento: 50, usos: 89, maxUsos: 100, activo: true, fechaExpiracion: '2024-11-30', tokensRequeridos: 80 },
      { id: '3', nombre: 'Envío gratis Hogar', categoria: 'Hogar', descuento: 100, usos: 45, maxUsos: 50, activo: false, fechaExpiracion: '2024-10-15', tokensRequeridos: 120 },
      { id: '4', nombre: '15% Tecnología', categoria: 'Tecnología', descuento: 15, usos: 200, maxUsos: 200, activo: true, fechaExpiracion: '2024-12-31', tokensRequeridos: 100 }
    ];

    this.productos = [
      { id: '1', nombre: 'Producto Eco 1', categoria: 'Alimentación', precio: 15.99, tokens: 32, stock: 100, vendidos: 75, codigo: 'ECO001', familia: 'Orgánico' },
      { id: '2', nombre: 'Producto Eco 2', categoria: 'Belleza', precio: 25.50, tokens: 51, stock: 50, vendidos: 30, codigo: 'ECO002', familia: 'Natural' },
      { id: '3', nombre: 'Producto Eco 3', categoria: 'Hogar', precio: 45.00, tokens: 90, stock: 25, vendidos: 20, codigo: 'ECO003', familia: 'Sostenible' },
      { id: '4', nombre: 'Producto Eco 4', categoria: 'Tecnología', precio: 99.99, tokens: 200, stock: 10, vendidos: 8, codigo: 'ECO004', familia: 'Verde' }
    ];

    this.prepararGraficos();
  }

  prepararGraficos() {
    // Gráfico de ventas por categoría
    const ventasPorCategoria = this.categorias.map(cat =>
      this.productos.filter(p => p.categoria === cat).reduce((sum, p) => sum + p.vendidos, 0)
    );

    this.pieChartData.labels = this.categorias;
    this.pieChartData.datasets[0].data = ventasPorCategoria;

    // Gráfico de cupones más populares
    const cuponesTop = this.cupones
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 8);

    this.barChartData.labels = cuponesTop.map(c => c.nombre);
    this.barChartData.datasets[0].data = cuponesTop.map(c => c.usos);
  }

  async crearCupon() {
    const alert = await this.alertController.create({
      header: 'Crear Nuevo Cupón',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del cupón',
          value: ''
        },
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción',
          value: ''
        },
        {
          name: 'tokensRequeridos',
          type: 'number',
          placeholder: 'Tokens requeridos',
          value: 0
        },
        {
          name: 'fechaExpiracion',
          type: 'date',
          placeholder: 'Fecha de expiración'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.nombre || !data.tokensRequeridos) {
              this.mostrarAlerta('Error', 'Nombre y tokens son obligatorios');
              return;
            }

            const loading = await this.loadingController.create({
              message: 'Creando cupón...'
            });
            await loading.present();

            try {
              const nuevoCupon = {
                nombre: data.nombre,
                descripcion: data.descripcion,
                tokensRequeridos: parseInt(data.tokensRequeridos),
                fechaExpiracion: data.fechaExpiracion ? new Date(data.fechaExpiracion) : undefined,
                activo: true
              };

              await this.cuponService.crear(nuevoCupon).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón creado correctamente');
              this.cargarDatos();
            } catch (error) {
              console.error('Error creando cupón:', error);
              this.mostrarAlerta('Error', 'No se pudo crear el cupón');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarCupon(cupon: any) {
    const alert = await this.alertController.create({
      header: 'Editar Cupón',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del cupón',
          value: cupon.nombre
        },
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción',
          value: cupon.categoria
        },
        {
          name: 'tokensRequeridos',
          type: 'number',
          placeholder: 'Tokens requeridos',
          value: cupon.tokensRequeridos
        },
        {
          name: 'activo',
          type: 'checkbox',
          label: 'Activo',
          value: cupon.activo
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.nombre || !data.tokensRequeridos) {
              this.mostrarAlerta('Error', 'Nombre y tokens son obligatorios');
              return;
            }

            const loading = await this.loadingController.create({
              message: 'Actualizando cupón...'
            });
            await loading.present();

            try {
              const cuponActualizado = {
                nombre: data.nombre,
                descripcion: data.descripcion,
                tokensRequeridos: parseInt(data.tokensRequeridos),
                activo: data.activo
              };

              await this.cuponService.actualizar(cupon.id, cuponActualizado).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón actualizado correctamente');
              this.cargarDatos();
            } catch (error) {
              console.error('Error actualizando cupón:', error);
              this.mostrarAlerta('Error', 'No se pudo actualizar el cupón');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarCupon(cupon: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el cupón "${cupon.nombre}"?`,
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
              await this.cuponService.eliminar(cupon.id).toPromise();
              this.mostrarAlerta('Éxito', 'Cupón eliminado correctamente');
              this.cargarDatos(); // Recargar datos
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

  async crearProducto() {
    const alert = await this.alertController.create({
      header: 'Crear Nuevo Producto',
      inputs: [
        {
          name: 'descripcionArticulo',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: ''
        },
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Código del producto',
          value: ''
        },
        {
          name: 'grupo',
          type: 'text',
          placeholder: 'Categoría/Grupo',
          value: ''
        },
        {
          name: 'familia',
          type: 'text',
          placeholder: 'Familia',
          value: ''
        },
        {
          name: 'precioVenta',
          type: 'number',
          placeholder: 'Precio de venta',
          value: 0
        },
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Stock disponible',
          value: 0
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.descripcionArticulo || !data.precioVenta) {
              this.mostrarAlerta('Error', 'Nombre y precio son obligatorios');
              return;
            }

            const loading = await this.loadingController.create({
              message: 'Creando producto...'
            });
            await loading.present();

            try {
              const nuevoProducto = {
                descripcionArticulo: data.descripcionArticulo,
                codigo: data.codigo,
                grupo: data.grupo,
                familia: data.familia,
                precioVenta: parseFloat(data.precioVenta),
                cantidad: parseInt(data.cantidad)
              };

              await this.articuloService.createArticulo(nuevoProducto).toPromise();
              this.mostrarAlerta('Éxito', 'Producto creado correctamente');
              this.cargarDatos();
            } catch (error) {
              console.error('Error creando producto:', error);
              this.mostrarAlerta('Error', 'No se pudo crear el producto');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Editar Producto',
      inputs: [
        {
          name: 'descripcionArticulo',
          type: 'text',
          placeholder: 'Nombre del producto',
          value: producto.nombre
        },
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Código del producto',
          value: producto.codigo
        },
        {
          name: 'grupo',
          type: 'text',
          placeholder: 'Categoría/Grupo',
          value: producto.categoria
        },
        {
          name: 'familia',
          type: 'text',
          placeholder: 'Familia',
          value: producto.familia
        },
        {
          name: 'precioVenta',
          type: 'number',
          placeholder: 'Precio de venta',
          value: producto.precio
        },
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Stock disponible',
          value: producto.stock
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.descripcionArticulo || !data.precioVenta) {
              this.mostrarAlerta('Error', 'Nombre y precio son obligatorios');
              return;
            }

            const loading = await this.loadingController.create({
              message: 'Actualizando producto...'
            });
            await loading.present();

            try {
              const productoActualizado = {
                descripcionArticulo: data.descripcionArticulo,
                codigo: data.codigo,
                grupo: data.grupo,
                familia: data.familia,
                precioVenta: parseFloat(data.precioVenta),
                cantidad: parseInt(data.cantidad)
              };

              await this.articuloService.updateArticulo(producto.id, productoActualizado).toPromise();
              this.mostrarAlerta('Éxito', 'Producto actualizado correctamente');
              this.cargarDatos();
            } catch (error) {
              console.error('Error actualizando producto:', error);
              this.mostrarAlerta('Error', 'No se pudo actualizar el producto');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando producto...'
            });
            await loading.present();

            try {
              await this.articuloService.deleteArticulo(producto.id).toPromise();
              this.mostrarAlerta('Éxito', 'Producto eliminado correctamente');
              this.cargarDatos(); // Recargar datos
            } catch (error) {
              console.error('Error eliminando producto:', error);
              this.mostrarAlerta('Error', 'No se pudo eliminar el producto');
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

  get cuponesFiltrados() {
    return this.cupones.filter(cupon => {
      const busquedaMatch = !this.filtroBusqueda ||
        cupon.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        cupon.categoria.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const categoriaMatch = !this.filtroCategoria || cupon.categoria === this.filtroCategoria;
      const estadoMatch = !this.filtroEstado ||
        (cupon.activo ? 'Activo' : 'Inactivo') === this.filtroEstado;
      return busquedaMatch && categoriaMatch && estadoMatch;
    });
  }

  get productosFiltrados() {
    return this.productos.filter(producto => {
      const busquedaMatch = !this.filtroBusqueda ||
        producto.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const categoriaMatch = !this.filtroCategoria || producto.categoria === this.filtroCategoria;
      return busquedaMatch && categoriaMatch;
    });
  }

  limpiarFiltros() {
    this.filtroBusqueda = '';
    this.filtroCategoria = '';
    this.filtroEstado = '';
  }

  get estadisticas() {
    const totalCupones = this.cupones.length;
    const cuponesActivos = this.cupones.filter(c => c.activo).length;
    const totalUsos = this.cupones.reduce((sum, c) => sum + c.usos, 0);
    const totalVentas = this.productos.reduce((sum, p) => sum + p.vendidos, 0);
    const productosEnStock = this.productos.filter(p => p.stock > 0).length;
    const valorTotalVentas = this.productos.reduce((sum, p) => sum + (p.precio * p.vendidos), 0);

    return {
      totalCupones,
      cuponesActivos,
      totalUsos,
      totalVentas,
      productosEnStock,
      valorTotalVentas
    };
  }
}
