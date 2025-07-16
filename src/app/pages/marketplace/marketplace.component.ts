import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgChartsModule, FormsModule]
})
export class MarketplaceComponent implements OnInit {
  cupones: any[] = [];
  productos: any[] = [];
  loading = false;
  filtroCategoria = '';
  filtroEstado = '';
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

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // Simular datos de cupones
    this.cupones = [
      { id: 1, nombre: 'Descuento 20% Alimentación', categoria: 'Alimentación', descuento: 20, usos: 150, maxUsos: 200, activo: true, fechaExpiracion: '2024-12-31' },
      { id: 2, nombre: '2x1 Belleza', categoria: 'Belleza', descuento: 50, usos: 89, maxUsos: 100, activo: true, fechaExpiracion: '2024-11-30' },
      { id: 3, nombre: 'Envío gratis Hogar', categoria: 'Hogar', descuento: 100, usos: 45, maxUsos: 50, activo: false, fechaExpiracion: '2024-10-15' },
      { id: 4, nombre: '15% Tecnología', categoria: 'Tecnología', descuento: 15, usos: 200, maxUsos: 200, activo: true, fechaExpiracion: '2024-12-31' }
    ];

    // Simular datos de productos
    this.productos = [
      { id: 1, nombre: 'Producto Eco 1', categoria: 'Alimentación', precio: 15.99, tokens: 50, stock: 100, vendidos: 75 },
      { id: 2, nombre: 'Producto Eco 2', categoria: 'Belleza', precio: 25.50, tokens: 80, stock: 50, vendidos: 30 },
      { id: 3, nombre: 'Producto Eco 3', categoria: 'Hogar', precio: 45.00, tokens: 120, stock: 25, vendidos: 20 },
      { id: 4, nombre: 'Producto Eco 4', categoria: 'Tecnología', precio: 99.99, tokens: 200, stock: 10, vendidos: 8 }
    ];

    // Preparar datos para gráficos
    this.prepararGraficos();
    
    this.loading = false;
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

  crearCupon() {
    console.log('Crear nuevo cupón');
    // Implementar modal o navegación
  }

  editarCupon(cupon: any) {
    console.log('Editar cupón:', cupon);
    // Implementar modal o navegación
  }

  eliminarCupon(cupon: any) {
    console.log('Eliminar cupón:', cupon);
    // Implementar confirmación y eliminación
  }

  crearProducto() {
    console.log('Crear nuevo producto');
    // Implementar modal o navegación
  }

  editarProducto(producto: any) {
    console.log('Editar producto:', producto);
    // Implementar modal o navegación
  }

  eliminarProducto(producto: any) {
    console.log('Eliminar producto:', producto);
    // Implementar confirmación y eliminación
  }

  get cuponesFiltrados() {
    return this.cupones.filter(cupon => {
      const categoriaMatch = !this.filtroCategoria || cupon.categoria === this.filtroCategoria;
      const estadoMatch = !this.filtroEstado || 
        (cupon.activo ? 'Activo' : 'Inactivo') === this.filtroEstado;
      return categoriaMatch && estadoMatch;
    });
  }

  get productosFiltrados() {
    return this.productos.filter(producto => {
      const categoriaMatch = !this.filtroCategoria || producto.categoria === this.filtroCategoria;
      return categoriaMatch;
    });
  }

  get estadisticas() {
    const totalCupones = this.cupones.length;
    const cuponesActivos = this.cupones.filter(c => c.activo).length;
    const totalUsos = this.cupones.reduce((sum, c) => sum + c.usos, 0);
    const totalVentas = this.productos.reduce((sum, p) => sum + p.vendidos, 0);
    
    return { totalCupones, cuponesActivos, totalUsos, totalVentas };
  }
} 