import { Component, OnInit } from '@angular/core';
import { EcopuntosService } from 'src/app/services/ecopuntos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ResiduosService } from 'src/app/services/residuos.service';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Tarjetas superiores
  totalKilos = 0;
  totalUsuarios = 0;
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
      { data: [], label: 'Kg reciclados', backgroundColor: '#4CAF50' }
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
      { data: [0, 100], backgroundColor: ['#4CAF50', '#e0e0e0'] }
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
    this.cargarDashboard();
  }

  cargarDashboard() {
    // Total kilos reciclados
    this.estadisticasService.getTotalKilos().subscribe(data => {
      console.log('[Estadisticas] Total kilos recibidos:', data);
      this.totalKilos = data.totalKg || 0;
    });
    // Mejor sucursal
    this.estadisticasService.getSucursalTop().subscribe(data => {
      console.log('[Estadisticas] Mejor sucursal recibida:', data);
      this.mejorEcopunto = {
        nombre: data.sucursal || '',
        kilosMes: data.totalKg || 0
      };
    });
    // Usuarios
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      console.log('[Ecopard] Usuarios recibidos:', usuarios);
      this.totalUsuarios = usuarios.length;
      // Ordenar por fechaCreacion descendente y tomar los 5 más recientes
      this.usuariosRecientes = usuarios
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .slice(0, 5)
        .map(u => ({
          ...u,
          activo: u.activo !== undefined ? u.activo : false
        }));
      console.log('[Ecopard] Usuarios recientes para tabla:', this.usuariosRecientes);
      console.log('[Ecopard] Total usuarios para tarjeta:', this.totalUsuarios);
      this.aplicarFiltros(); // Aplicar filtros después de cargar usuarios
    });

    // Gráfico de kilos por mes
    this.estadisticasService.getKilosPorMes().subscribe(data => {
      console.log('[Estadisticas] Kilos por mes recibidos:', data);
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
      console.log('[Estadisticas] Meta mensual recibida:', data);
      this.metaPorcentaje = Math.round((data.porcentaje || 0) * 100);
      // Actualizar datos del gráfico doughnut
      this.doughnutChartData.datasets[0].data = [this.metaPorcentaje, 100 - this.metaPorcentaje];
    });
  }

  aplicarFiltros() {
    console.log('🔍 Aplicando filtros - Mes:', this.filtroMes, 'Usuario:', this.filtroUsuario);
    
    this.usuariosRecientesFiltrados = this.usuariosRecientes.filter(usuario => {
      // Filtro por usuario (nombre o email)
      const cumpleUsuario = !this.filtroUsuario || 
        usuario.nombre?.toLowerCase().includes(this.filtroUsuario.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(this.filtroUsuario.toLowerCase());

      // Filtro por mes de creación
      let cumpleMes = true;
      if (this.filtroMes) {
        const fechaCreacion = new Date(usuario.fechaCreacion);
        const mesUsuario = fechaCreacion.getMonth() + 1; // getMonth() retorna 0-11
        cumpleMes = mesUsuario === this.filtroMes;
      }

      return cumpleUsuario && cumpleMes;
    });

    console.log('🔍 Usuarios filtrados:', this.usuariosRecientesFiltrados.length);
  }

  verUsuario(usuario: any) {
    console.log('Ver usuario:', usuario);
    // Aquí puedes implementar la lógica para ver detalles del usuario
    // Por ejemplo, navegar a una página de detalles o abrir un modal
  }

  editarUsuario(usuario: any) {
    console.log('Editar usuario:', usuario);
    // Aquí puedes implementar la lógica para editar el usuario
    // Por ejemplo, navegar a la página de gestión de usuarios o abrir un modal
  }

  // Métodos para manejar cambios en filtros
  onFiltroMesChange() {
    this.aplicarFiltros();
  }

  onFiltroUsuarioChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtroMes = '';
    this.filtroUsuario = '';
    this.aplicarFiltros();
  }
  
}