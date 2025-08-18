import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { EcopuntosService } from 'src/app/services/ecopuntos.service';
import { AuthService } from 'src/app/services/auth.service';

interface RegistroReciente {
  fecha: Date;
  vecinoNombre: string;
  kilos: number;
}

@Component({
  selector: 'app-encargado-home',
  standalone: false,
  templateUrl: './encargado-home.component.html',
  styleUrls: ['./encargado-home.component.scss'],
})
export class EncargadoHomeComponent implements OnInit {
  assignedEcopuntoNombre = 'Ecopunto Central';
  encargadoNombre = '';
  totalKilos = 0;
  vecinosCount = 0;
  tareasPendientes = 0;
  metaPorcentaje = 0;
  metaObjetivoKg = 0;

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { beginAtZero: true, ticks: { stepSize: 0.1, font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.06)' } }
    }
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    datasets: [{
      label: 'Kilos recibidos',
      data: [0,0,0,0,0,0,0,0,0,0,0,0],
      borderRadius: 6,
      barThickness: 'flex',
      maxBarThickness: 28,
      minBarLength: 2,
      backgroundColor: 'rgba(76, 175, 80, 0.35)',
      borderColor: 'rgba(76, 175, 80, 0.9)',
      borderWidth: 1
    }]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { enabled: true } }
  };

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Progreso', 'Pendiente'],
    datasets: [{ data: [this.metaPorcentaje, Math.max(0, 100 - this.metaPorcentaje)], backgroundColor: ['#28b463', '#e9ecef'], borderWidth: 0 }]
  };

  registrosRecientes: RegistroReciente[] = [];

  trackByRegistro = (_: number, r: RegistroReciente) =>
    (r.fecha?.toString?.() ?? String(r.fecha)) + '_' + r.vecinoNombre + '_' + r.kilos;

  refrescarRegistros(): void {}
  actualizarMetaPorcentaje(v: number) {
    this.metaPorcentaje = Math.max(0, Math.min(100, Math.round(v)));
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [{ data: [this.metaPorcentaje, Math.max(0, 100 - this.metaPorcentaje)], backgroundColor: ['#28b463', '#e9ecef'], borderWidth: 0 }]
    };
  }
  private actualizarMetaDesdeObjetivo(objetivoKg: number, kilosDelMes: number) {
    this.metaObjetivoKg = Math.max(0, Number(objetivoKg) || 0);
    const avance = this.metaObjetivoKg > 0 ? (Number(kilosDelMes) || 0) / this.metaObjetivoKg * 100 : 0;
    this.actualizarMetaPorcentaje(avance);
  }
  actualizarKilosPorMes(arr: number[]) {
    const data = (Array.isArray(arr) && arr.length === 12) ? arr : new Array(12).fill(0);
    console.log('[EncargadoHome] updating bar chart with data:', data);
    this.barChartData = { ...this.barChartData, datasets: [{ ...this.barChartData.datasets[0], data }] };
  }

  constructor(
    private ecopuntosService: EcopuntosService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.authService.ensureUserFromToken();
    const user = this.authService.getUser();
    this.encargadoNombre = [user?.nombre, user?.apellido].filter(Boolean).join(' ') || user?.email || 'Encargado';
    const ecopuntoId = user?.ecopuntoId || user?.ecopunto?.id || user?.ecopunto?._id;
    const userId = user?._id;
    console.log('[EncargadoHome] user:', user);
    console.log('[EncargadoHome] resolved ecopuntoId from token/user:', ecopuntoId);

    // Si ya tenemos el ecopuntoId del encargado, usamos solo ese (sin listar todos)
    if (ecopuntoId) {
      const resolvedId = ecopuntoId;
      console.log('[EncargadoHome] using ecopuntoId from token:', resolvedId);
      // Datos numéricos
      this.ecopuntosService.getTotalKgPorId(resolvedId).subscribe({
        next: (total: number) => this.totalKilos = total || 0,
        error: () => this.totalKilos = 0
      });
      this.ecopuntosService.getTotalVecinosPorId(resolvedId).subscribe({
        next: (total: number) => this.vecinosCount = total || 0,
        error: () => this.vecinosCount = 0
      });
      this.ecopuntosService.getKilosMensualesPorId(resolvedId).subscribe({
        next: (arr: number[]) => {
          this.actualizarKilosPorMes(arr);
          // Meta mensual: calcular avance con el valor del mes actual
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1; // 1-12
          const kilosMesActual = Array.isArray(arr) ? (Number(arr[month - 1]) || 0) : 0;
          this.ecopuntosService.getMetaMensualPorId(resolvedId, year, month).subscribe({
            next: (meta) => this.actualizarMetaDesdeObjetivo(meta?.objetivoKg || 0, kilosMesActual),
            error: (err) => {
              console.error('[EncargadoHome] error meta mensual(id):', err);
              this.actualizarMetaDesdeObjetivo(0, kilosMesActual);
            }
          });
        },
        error: (err) => {
          console.error('[EncargadoHome] error kilos mensuales(id):', err);
          this.actualizarKilosPorMes([]);
        }
      });
      // Nombre de sucursal y tabla
      this.ecopuntosService.getEcopuntos().subscribe({
        next: (ecopuntos: any[]) => {
          const found = (Array.isArray(ecopuntos) ? ecopuntos : []).find((e: any) => e?._id === resolvedId || e?.id === resolvedId);
          if (found?.nombre) this.assignedEcopuntoNombre = found.nombre;
        }
      });
      this.ecopuntosService.getEntregasDetallePorId(resolvedId, 10).subscribe({
        next: (rows) => {
          console.log('[EncargadoHome] entregas detalle (rows):', rows);
          this.registrosRecientes = rows || [];
        },
        error: (err) => {
          console.error('[EncargadoHome] error entregas detalle(id):', err);
          this.registrosRecientes = [];
        }
      });
      return;
    }

    // Fallback: obtener ID buscando el ecopunto donde el usuario es encargado
    this.ecopuntosService.getEcopuntos().subscribe({
      next: (ecopuntos: any[]) => {
        console.log('[EncargadoHome] ecopuntos list:', ecopuntos);
        const list = Array.isArray(ecopuntos) ? ecopuntos : [];
        let selected = list.find((e: any) => e?._id === ecopuntoId || e?.id === ecopuntoId);
        if (!selected && userId) {
          selected = list.find((e: any) => e?.encargado?._id === userId || e?.encargadoId === userId);
        }
        console.log('[EncargadoHome] selected ecopunto:', selected);
        if (selected?.nombre) {
          this.assignedEcopuntoNombre = selected.nombre;
        }
        const resolvedId = selected?._id || selected?.id || ecopuntoId;
        console.log('[EncargadoHome] resolvedId to fetch total-kg:', resolvedId);
        if (resolvedId) {
          this.ecopuntosService.getTotalKgPorId(resolvedId).subscribe({
            next: (total: number) => this.totalKilos = total || 0,
            error: () => this.totalKilos = 0
          });
          this.ecopuntosService.getTotalVecinosPorId(resolvedId).subscribe({
            next: (total: number) => this.vecinosCount = total || 0,
            error: () => this.vecinosCount = 0
          });
          this.ecopuntosService.getKilosMensualesPorId(resolvedId).subscribe({
            next: (arr: number[]) => this.actualizarKilosPorMes(arr),
            error: (err) => {
              console.error('[EncargadoHome] error kilos mensuales(id):', err);
              this.actualizarKilosPorMes([]);
            }
          });
          // Cargar últimas entregas para la tabla
          this.ecopuntosService.getEntregasDetallePorId(resolvedId, 10).subscribe({
            next: (rows) => {
              console.log('[EncargadoHome] entregas detalle (rows):', rows);
              this.registrosRecientes = rows || [];
            },
            error: (err) => {
              console.error('[EncargadoHome] error entregas detalle(id):', err);
              this.registrosRecientes = [];
            }
          });
        }
      },
      error: (err) => {
        console.error('[EncargadoHome] error loading ecopuntos list:', err);
        // Si falla el listado pero tenemos ecopuntoId, al menos intentamos el total
        if (ecopuntoId) {
          console.log('[EncargadoHome] fallback calling total-kg with ecopuntoId:', ecopuntoId);
          this.ecopuntosService.getTotalKgPorId(ecopuntoId).subscribe({
            next: (total: number) => this.totalKilos = total || 0,
            error: () => this.totalKilos = 0
          });
          this.ecopuntosService.getTotalVecinosPorId(ecopuntoId).subscribe({
            next: (total: number) => this.vecinosCount = total || 0,
            error: () => this.vecinosCount = 0
          });
          this.ecopuntosService.getKilosMensualesPorId(ecopuntoId).subscribe({
            next: (arr: number[]) => {
              this.actualizarKilosPorMes(arr);
              const now = new Date();
              const year = now.getFullYear();
              const month = now.getMonth() + 1; // 1-12
              const kilosMesActual = Array.isArray(arr) ? (Number(arr[month - 1]) || 0) : 0;
              this.ecopuntosService.getMetaMensualPorId(ecopuntoId, year, month).subscribe({
                next: (meta) => this.actualizarMetaDesdeObjetivo(meta?.objetivoKg || 0, kilosMesActual),
                error: (err) => {
                  console.error('[EncargadoHome] error meta mensual(fallback id):', err);
                  this.actualizarMetaDesdeObjetivo(0, kilosMesActual);
                }
              });
            },
            error: (err) => {
              console.error('[EncargadoHome] error kilos mensuales(fallback id):', err);
              this.actualizarKilosPorMes([]);
            }
          });
          this.ecopuntosService.getEntregasDetallePorId(ecopuntoId, 10).subscribe({
            next: (rows) => {
              console.log('[EncargadoHome] entregas detalle (fallback rows):', rows);
              this.registrosRecientes = rows || [];
            },
            error: (err) => {
              console.error('[EncargadoHome] error entregas detalle(fallback id):', err);
              this.registrosRecientes = [];
            }
          });
        }
      }
    });
  }
}
