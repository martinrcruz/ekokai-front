import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RutasService } from '../../../services/rutas.service';
import { CalendarioService } from '../../../services/calendario.service';
import { VehiculosService, Vehicle } from '../../../services/vehiculos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Ruta } from '../../../models/ruta.model';
import { Parte } from '../../../models/parte.model';
import { ApiResponse } from '../../../models/api-response.model';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-crear-ruta-calendario',
  standalone: false,
  templateUrl: './crear-ruta-calendario.component.html',
  styleUrls: ['./crear-ruta-calendario.component.scss']
})
export class CrearRutaCalendarioComponent implements OnInit {
  date: string = '';
  rutaNId: string = '';
  type: string = '';
  state: string = 'Pendiente'; // default
  selectedVehicle: string = '';
  selectedUsers: string[] = [];

  // Listas para selects
  rutasN: any[] = [];
  vehicles: Vehicle[] = [];
  users: any[] = [];
  // Partes no asignados
  partesNoAsignados: Parte[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private rutasService: RutasService,
    private calendarioService: CalendarioService,
    private vehiculosService: VehiculosService,
    private usuariosService: UsuariosService
  ) {}

  async ngOnInit() {
    // Obtenemos la fecha desde la URL (param: 'date')
    this.date = this.route.snapshot.paramMap.get('date') || '';

    // Cargar RutaN
    const rnReq = await this.rutasService.getRutasN();
    rnReq.subscribe((res: any) => {
      if (res.ok && res.rutas) {
        this.rutasN = res.rutas;
      }
    });

    try {
      // Cargar Vehicles
      this.vehiculosService.getVehicles().subscribe(
        (response: ApiResponse<Vehicle[]>) => {
          if (response.ok && response.data) {
            // Filtrar vehículos no eliminados y disponibles
            this.vehicles = response.data.filter(v => 
              !v.eliminado && 
              (!v.status || v.status === 'Disponible')
            );
          } else {
            console.error('No se pudieron cargar los vehículos:', response.message);
          }
        },
        (error) => {
          console.error('Error al cargar vehículos:', error);
          // Mostrar mensaje de error al usuario si es necesario
        }
      );

      // Cargar Users
      const usrReq = await this.usuariosService.getUsers();
      usrReq.subscribe((res: any) => {
        if (res.ok && res.users) {
          this.users = res.users;
        }
      });

      // Cargar Partes No Asignados del mes actual y meses anteriores
      await this.loadPartesNoAsignados();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async loadPartesNoAsignados() {
    try {
      // Obtener fecha actual y los últimos 3 meses
      const dates = this.getLastMonths(3);
      
      // Crear un array de observables para cada mes
      const requests = dates.map(date => 
        this.calendarioService.getPartesNoAsignadosEnMes(date)
      );

      // Ejecutar todas las peticiones en paralelo
      forkJoin(requests).subscribe(
        (responses) => {
          // Combinar todos los partes no asignados y eliminar duplicados por _id
          const partesMap = new Map<string, Parte>();
          responses
            .filter(res => res.ok)
            .forEach(res => {
              res.partes.forEach(parte => {
                if (!partesMap.has(parte._id)) {
                  partesMap.set(parte._id, parte);
                }
              });
            });
          
          // Convertir el Map a array y ordenar por fecha
          this.partesNoAsignados = Array.from(partesMap.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        },
        (error) => {
          console.error('Error al cargar partes no asignados:', error);
          this.partesNoAsignados = [];
        }
      );
    } catch (error) {
      console.error('Error:', error);
      this.partesNoAsignados = [];
    }
  }

  // Obtener array con fechas de los últimos n meses en formato YYYY-MM-DD
  private getLastMonths(months: number): string[] {
    const dates: string[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < months; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  async createRuta() {
    try {
      if (!this.rutaNId) {
        console.error('No se seleccionó un RutaN');
        return;
      }

      const selectedRutaN = this.rutasN.find(r => r._id === this.rutaNId);
      if (!selectedRutaN) {
        console.error('RutaN no encontrada');
        return;
      }

      const selectedVehicle = this.vehicles.find(v => v._id === this.selectedVehicle);
      const selectedUsers = this.users.filter(u => this.selectedUsers.includes(u._id));

      // Mapear el vehículo a la estructura esperada por la interfaz Ruta
      const mappedVehicle = selectedVehicle ? {
        _id: selectedVehicle._id!,
        fuel: selectedVehicle.fuel,
        type: selectedVehicle.type,
        modelo: selectedVehicle.modelo,
        brand: selectedVehicle.brand,
        photo: selectedVehicle.photo || '',
        matricula: selectedVehicle.matricula,
        createdDate: selectedVehicle.createdDate || new Date().toISOString(),
        __v: selectedVehicle.__v || 0
      } : undefined;

      // Obtener los partes seleccionados
      const selectedPartes = this.partesNoAsignados.filter(p => p.selected);

      const data: Partial<Ruta> = {
        date: this.date,
        name: {
          _id: this.rutaNId,
          name: selectedRutaN.name,
          __v: 0
        },
        type: this.type,
        state: this.state,
        vehicle: mappedVehicle,
        users: selectedUsers,
        comentarios: '',
        herramientas: [],
        eliminado: false
      };

      // Crear la ruta y luego asignar los partes
      const req = await this.rutasService.createRuta(data);
      req.pipe(
        switchMap((response: ApiResponse<Ruta>) => {
          if (response.ok && response.data && selectedPartes.length > 0) {
            // Si hay partes seleccionados y la ruta se creó correctamente, asignarlos
            return this.rutasService.asignarPartesARuta(
              response.data._id,
              selectedPartes.map(p => p._id)
            );
          }
          return new Observable(subscriber => subscriber.next(response));
        })
      ).subscribe(
        (response: any) => {
          if (response.ok) {
            this.navCtrl.navigateBack('/calendario');
          } else {
            console.error('Error al crear ruta o asignar partes:', response.error);
          }
        },
        (error) => {
          console.error('Error al crear ruta o asignar partes:', error);
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }

  cancelar() {
    this.navCtrl.back();
  }
}
