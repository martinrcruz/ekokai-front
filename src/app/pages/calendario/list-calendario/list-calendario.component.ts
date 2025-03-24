import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarMonthViewDay, CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { subMonths, addMonths, subYears, addYears } from 'date-fns';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-calendario',
  standalone: false,
  templateUrl: './list-calendario.component.html',
  styleUrls: ['./list-calendario.component.scss']
})
export class ListCalendarioComponent implements OnInit {

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  @ViewChild('monthCellTemplate', { static: true }) monthCellTemplate!: TemplateRef<any>;

  // Variables para la lógica
  selectedDay: Date | null = null;
  rutasDelDia: any[] = [];          // Al hacer click en día => se cargan las rutas
  rutaSeleccionada: any = null;     // Ruta cuyo detalle se muestra
  partesNoAsignados: any[] = [];    // Partes no asignados del mes o del día
  partesAsignadosARuta: any[] = []; // Partes de la rutaSeleccionada
  enableCheckParts = false;         // Flag para mostrar checkboxes y botón de asignar

  constructor(private apiService: ApiService, private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  ionViewDidEnter(){
    this.loadEvents();
    this.selectedDay = null;
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
  nextMonth() { this.viewDate = addMonths(this.viewDate, 1); }
  previousYear() { this.viewDate = subYears(this.viewDate, 1); }
  nextYear() { this.viewDate = addYears(this.viewDate, 1); }
  goToday() { this.viewDate = new Date(); }

  /**
   * Al hacer click en un día vacío
   * Debe mostrar la lista de rutas de ese día
   */
  dayClicked(day: CalendarMonthViewDay): void {
    this.selectedDay = day.date;
    const dateStr = this.toDateString(day.date);
    // Buscar las rutas de ese día => se guardan en rutasDelDia
    this.cargarRutasDelDia(dateStr);

    // Cargar partes no asignados en mes
    this.cargarPartesNoAsignadosEnMes(dateStr);

    // Limpiar la rutaSeleccionada
    this.rutaSeleccionada = null;
    this.partesAsignadosARuta = [];
    this.enableCheckParts = false;
  }

  /**
   * Al hacer click en un evento => ver DETALLE de la ruta
   */
  handleEventClick(event: CalendarEvent, $event: MouseEvent) {
    $event.stopPropagation();
    const ruta = event.meta.ruta;
    this.selectedDay = event.start;

    // Asumimos que si hay un event => 1 ruta
    this.rutasDelDia = [ruta]; // o podrías tener más de una

    // Ruta seleccionada => su detalle
    this.mostrarDetalleRuta(ruta);

    // Cargar partes no asignados
    const dateStr = this.toDateString(event.start);
    this.cargarPartesNoAsignadosEnMes(dateStr);
  }

  /**
   * Cargar todas las rutas de un día
   */
  async cargarRutasDelDia(dateStr: string) {
    const req = await this.apiService.getRutasPorFecha(dateStr);
    // => un endpoint: /rutas/porFecha/:fecha => retorna { ok:true, rutas:[...] }
    req.subscribe((res: any) => {
      if (res.ok) {
        this.rutasDelDia = res.rutas;
      } else {
        this.rutasDelDia = [];
      }
    });
  }

  /**
   * Mostrar detalle de la ruta => se setea en rutaSeleccionada
   * y se cargan sus partes
   */
  mostrarDetalleRuta(ruta: any) {
    this.rutaSeleccionada = ruta;
    this.cargarPartesDeLaRuta(ruta._id);
    this.enableCheckParts = false; // ocultar check
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
      }
    });
  }

  createRutaParaDia() {
    if (!this.selectedDay) return;
    const dateStr = this.toDateString(this.selectedDay);
    // Navegamos a /crear-ruta/:date
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
        // removerlos de partesNoAsignados
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

  parseDateAsUTC(dateStr: string): Date {
    const d = new Date(dateStr); // Esto parsea en local, pero...
    // Extraemos el año, mes y día en UTC:
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    // Creamos un Date local con esos valores, sin shift de zona horaria
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
      case 'Correctivo': return 'tag-corr';
      case 'Visitas': return 'tag-visit';
      default: return 'tag-other';
    }
  }
}
