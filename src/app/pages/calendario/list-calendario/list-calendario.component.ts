import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { CalendarMonthViewDay, CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { subMonths, addMonths, subYears, addYears } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-calendario',
  standalone: false,
  templateUrl: './list-calendario.component.html',
  styleUrls: ['./list-calendario.component.scss']
})
export class ListCalendarioComponent implements OnInit {

  @ViewChild('monthCellTemplate', { static: true }) monthCellTemplate!: TemplateRef<any>;

  // (4) interfaz worker => si role=worker => no puede crear rutas ni asignar partes
  @Input() isWorker: boolean = false;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  // Para mostrar sumatoria de facturación finalizada
  factSumDay: { [key: string]: number } = {};

  // Variables existentes
  selectedDay: Date | null = null;
  rutasDelDia: any[] = [];
  rutaSeleccionada: any = null;
  partesNoAsignados: any[] = [];
  partesAsignadosARuta: any[] = [];
  enableCheckParts = false;

  // Filtro en partes no asignados
  filterZona: string = '';
  filterTipo: string = '';
  filterFactRange: string = '';
  // Lista de zonas (para select de zona)
  zonas: any[] = []; 

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.loadEvents();
    this.loadZones();  // cargar la lista de zonas
    this.cargarFacturacionFinalMes(); // cargar sumatoria de facturación final
  }

  ionViewDidEnter(){
    this.loadEvents();
    this.selectedDay = null;
  }

  // (3) Cargar la sumatoria de facturación finalizada
  async cargarFacturacionFinalMes() {
    const dateStr = this.viewDate.toISOString().split('T')[0];
    const req = await this.apiService.getPartesFinalizadasMonth(dateStr);
    req.subscribe((res: any) => {
      if (res.ok) {

        const partes = res.partes;
        partes.forEach((p: any) => {
          const d = new Date(p.date);
          const dayStr = this.toDateString(d);
          if (!this.factSumDay[dayStr]) this.factSumDay[dayStr] = 0;
          this.factSumDay[dayStr] += (p.facturacion || 0);
        });
      }
    });
  }

  async loadZones() {
    // Podrías tener un endpoint: GET /zone
    const req = await this.apiService.getZones();
    req.subscribe((res: any) => {
      if (res.ok) {
        this.zonas = res.zone; 
      }
    });
  }

  async loadEvents() {
    const req = await this.apiService.getRutas();
    req.subscribe((res: any) => {
      if (res.ok) {
        this.events = res.rutas.map((ruta: any) => ({
          start: this.parseDateAsUTC(ruta.date),
          title: '',
          meta: { ruta }
        }));
        this.refresh.next(null);
      }
    });
  }

  previousMonth() { this.viewDate = subMonths(this.viewDate, 1); }
  nextMonth()     { this.viewDate = addMonths(this.viewDate, 1); }
  previousYear()  { this.viewDate = subYears(this.viewDate, 1); }
  nextYear()      { this.viewDate = addYears(this.viewDate, 1); }
  goToday()       { this.viewDate = new Date(); }

  dayClicked(day: CalendarMonthViewDay): void {
    this.selectedDay = day.date;
    const dateStr = this.toDateString(day.date);
    // Cargar rutas, partes no asignados
    this.cargarRutasDelDia(dateStr);
    this.cargarPartesNoAsignadosEnMes(dateStr);

    this.rutaSeleccionada = null;
    this.partesAsignadosARuta = [];
    this.enableCheckParts = false;
  }

  handleEventClick(event: CalendarEvent, $event: MouseEvent) {
    $event.stopPropagation();
    const ruta = event.meta.ruta;
    this.selectedDay = event.start;
    this.rutasDelDia = [ruta];
    this.mostrarDetalleRuta(ruta);

    const dateStr = this.toDateString(event.start);
    this.cargarPartesNoAsignadosEnMes(dateStr);
  }

  async cargarRutasDelDia(dateStr: string) {
    const req = await this.apiService.getRutasPorFecha(dateStr);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.rutasDelDia = res.rutas;
      } else {
        this.rutasDelDia = [];
      }
    });
  }

  mostrarDetalleRuta(ruta: any) {
    this.rutaSeleccionada = ruta;
    this.cargarPartesDeLaRuta(ruta._id);
    this.enableCheckParts = false;
  }

  async cargarPartesDeLaRuta(rutaId: string) {
    const req = await this.apiService.getPartesDeRuta(rutaId);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.partesAsignadosARuta = res.partes;
      }
    });
  }

  async cargarPartesNoAsignadosEnMes(dateStr: string) {
    const req = await this.apiService.getPartesNoAsignadosEnMes(dateStr);
    req.subscribe((res: any) => {
      if (res.ok) {
        this.partesNoAsignados = res.partes;
        // Aplicar filtro
        this.filtrarPartesPendientes();
      }
    });
  }

  createRutaParaDia() {
    if (!this.selectedDay) return;
    const dateStr = this.toDateString(this.selectedDay);
    this.navCtrl.navigateForward(['/calendario/crear-ruta', dateStr]);
  }

  enableAssignPartes() {
    this.enableCheckParts = true;
    // Desmarcar todo
    this.partesNoAsignados.forEach(p => p.selected = false);
  }

  async asignarPartesARuta(parteSeleccionados: any[]) {
    if (!this.rutaSeleccionada || parteSeleccionados.length === 0) return;
    const req = await this.apiService.asignarPartesARuta(
      this.rutaSeleccionada._id,
      parteSeleccionados.map((p: any) => p._id)
    );
    req.subscribe((res: any) => {
      if (res.ok) {
        // Removerlos de partesNoAsignados
        this.partesNoAsignados = this.partesNoAsignados.filter((p: any) => !p.selected);
        // agregarlos a partesAsignadosARuta
        this.partesAsignadosARuta.push(...parteSeleccionados);
        this.enableCheckParts = false;
      }
    });
  }

  toggleRuta(ruta: any) {
    if (this.rutaSeleccionada === ruta) {
      this.rutaSeleccionada = null;
    } else {
      this.mostrarDetalleRuta(ruta);
    }
  }

  getSelectedNoAsignados(): any[] {
    return this.partesNoAsignados?.filter((p) => p.selected) || [];
  }

  filtrarPartesPendientes() {
    // Aplica el filtro localmente
    let temp = [...this.partesNoAsignados];

    // Filtro por zona (p.customer.zone == filterZona)
    if (this.filterZona) {
      temp = temp.filter(p => p.customer?.zone === this.filterZona);
    }
    // Filtro por tipo
    if (this.filterTipo) {
      temp = temp.filter(p => p.type === this.filterTipo);
    }
    // Filtro por facturación
    if (this.filterFactRange) {
      temp = temp.filter(p => {
        const f = p.facturacion || 0;
        if (this.filterFactRange === 'lt100') return f < 100;
        if (this.filterFactRange === 'bt100_500') return (f >= 100 && f <= 500);
        if (this.filterFactRange === 'gt500') return f > 500;
        return true;
      });
    }
    this.partesNoAsignados = temp;
  }

  parseDateAsUTC(dateStr: string): Date {
    const d = new Date(dateStr);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    return new Date(year, month, day, 0, 0, 0);
  }

  toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTipoRutaClass(tipo: string): string {
    switch (tipo) {
      case 'Mantenimiento': return 'tag-mant';
      case 'Correctivo':    return 'tag-corr';
      case 'Visitas':       return 'tag-visit';
      default:              return 'tag-other';
    }
  }

  getFactSum(d: Date): number {
    if (!d) return 0; // o chequeo extra si fuera necesario
    const dayStr = this.toDateString(d); // asumes ya tienes un método toDateString(d)
    return this.factSumDay[dayStr] || 0; 
  }
}
