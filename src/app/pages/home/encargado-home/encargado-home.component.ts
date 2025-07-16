import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { EcopuntosService } from 'src/app/services/ecopuntos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ResiduosService } from 'src/app/services/residuos.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-encargado-home',
  templateUrl: './encargado-home.component.html',
  styleUrls: ['./encargado-home.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgChartsModule, FormsModule]
})
export class EncargadoHomeComponent implements OnInit {
  // Tarjetas superiores para encargado
  totalKilos = 0;
  totalUsuarios = 0;
  tareasPendientes = 0;
  mejorEcopunto = { nombre: '', kilosMes: 0 };
  metaPorcentaje = 0;

  // Tabla de usuarios recientes
  usuariosRecientes: any[] = [];

  // Datos para el gráfico de barras
  chartLabels: string[] = [];
  chartData: number[] = [];

  // Gráfico de barras (distribución mensual)
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
  barChartLegend = false;
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Kg reciclados', backgroundColor: '#FF6B35' }
    ]
  };

  // Gráfico doughnut (meta mensual)
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    }
  };
  doughnutChartType: 'doughnut' = 'doughnut';
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Progreso', 'Restante'],
    datasets: [
      { data: [0, 100], backgroundColor: ['#FF6B35', '#e0e0e0'] }
    ]
  };

  // Filtros
  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];
  filtroMes: number | '' = '';
  filtroUsuario: string = '';
  usuariosRecientesFiltrados: any[] = [];

  constructor(
    private ecopuntosService: EcopuntosService,
    private usuariosService: UsuariosService,
    private residuosService: ResiduosService,
    private estadisticasService: EstadisticasService
  ) {}

  ngOnInit() {
    this.cargarDashboardEncargado();
    this.usuariosRecientesFiltrados = this.usuariosRecientes;
  }

  cargarDashboardEncargado() {
    // Total kilos reciclados
    this.estadisticasService.getTotalKilos().subscribe(data => {
      console.log('[Encargado Dashboard] Total kilos recibidos:', data);
      this.totalKilos = data.totalKg || 0;
    });

    // Tareas pendientes (mock data por ahora)
    this.tareasPendientes = 5;

    // Mejor sucursal
    this.estadisticasService.getSucursalTop().subscribe(data => {
      console.log('[Encargado Dashboard] Mejor sucursal recibida:', data);
      this.mejorEcopunto = {
        nombre: data.sucursal || '',
        kilosMes: data.totalKg || 0
      };
    });

    // Usuarios (solo vecinos para encargado)
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      console.log('[Encargado Dashboard] Usuarios recibidos:', usuarios);
      // Filtrar solo vecinos para el encargado
      const vecinos = usuarios.filter(u => u.rol === 'vecino');
      this.totalUsuarios = vecinos.length;
      // Ordenar por fechaCreacion descendente y tomar los 5 más recientes
      this.usuariosRecientes = vecinos
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .slice(0, 5)
        .map(u => ({
          ...u,
          activo: u.activo !== undefined ? u.activo : false
        }));
      console.log('[Encargado Dashboard] Vecinos recientes para tabla:', this.usuariosRecientes);
      console.log('[Encargado Dashboard] Total vecinos para tarjeta:', this.totalUsuarios);
    });

    // Gráfico de kilos por mes
    this.estadisticasService.getKilosPorMes().subscribe(data => {
      console.log('[Encargado Dashboard] Kilos por mes recibidos:', data);
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const year = new Date().getFullYear();
      const kilosPorMes = Array(12).fill(0);
      data.forEach((item: any) => {
        const [anio, mes] = item.mes.split('-');
        if (parseInt(anio) === year) {
          kilosPorMes[parseInt(mes) - 1] = item.totalKg;
        }
      });
      this.chartLabels = meses;
      this.chartData = kilosPorMes;
      this.barChartData.labels = this.chartLabels;
      this.barChartData.datasets[0].data = this.chartData;
    });

    // Meta mensual
    this.estadisticasService.getMetaMensual().subscribe(data => {
      console.log('[Encargado Dashboard] Meta mensual recibida:', data);
      this.metaPorcentaje = Math.round((data.porcentaje || 0) * 100);
      // Actualizar datos del gráfico doughnut
      this.doughnutChartData.datasets[0].data = [this.metaPorcentaje, 100 - this.metaPorcentaje];
    });
  }

  aplicarFiltros() {}
} 