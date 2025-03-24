import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

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
  vehicles: any[] = [];
  users: any[] = [];
  // Partes no asignados
  partesNoAsignados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    // Obtenemos la fecha desde la URL (param: 'date')
    this.date = this.route.snapshot.paramMap.get('date') || '';

    // Cargar RutaN
    const rnReq = await this.apiService.getRutasN();
    rnReq.subscribe((res: any) => {
      if (res.ok && res.rutas) {
        this.rutasN = res.rutas;
      }
    });

    // Cargar Vehicles
    const vehReq = await this.apiService.getVehicles();
    vehReq.subscribe((res: any) => {
      if (res.ok && res.vehicles) {
        this.vehicles = res.vehicles;
      }
    });

    // Cargar Users
    const usrReq = await this.apiService.getUsers();
    usrReq.subscribe((res: any) => {
      if (res.ok && res.users) {
        this.users = res.users;
      }
    });

    // Cargar Partes No Asignados
    const partesReq = await this.apiService.getPartesNoAsignados();
    partesReq.subscribe((res: any) => {
      if (res.ok && res.partes) {
        // partes no asignados
        this.partesNoAsignados = res.partes.map((p: any) => {
          return { ...p, selected: false };
        });
      }
    });
  }

  async onCreateRuta() {
    try {
      if (!this.rutaNId) {
        console.error('No se seleccionó un RutaN');
        return;
      }

      // Paso 1: Crear la ruta
      const data = {
        date: this.date,
        name: this.rutaNId,
        type: this.type,
        state: this.state,
        vehicle: this.selectedVehicle || null,
        users: this.selectedUsers || []
      };

      const req = await this.apiService.createRuta(data);
      req.subscribe(async (res: any) => {
        if (res.ok && res.ruta) {
          // Ruta creada con éxito
          const newRutaId = res.ruta._id;

          // Paso 2: Asignar partes seleccionados a la nueva ruta
          const partesAsignar = this.partesNoAsignados
            .filter(p => p.selected)
            .map(p => p._id);

          if (partesAsignar.length > 0) {
            const asignReq = await this.apiService.asignarPartesARuta(newRutaId, partesAsignar);
            asignReq.subscribe((resp: any) => {
              if (resp.ok) {
                console.log('Partes asignados correctamente');
              } else {
                console.warn('No se pudieron asignar partes:', resp);
              }
              // Finalmente, navegar al calendario
              this.navCtrl.navigateRoot('/calendario');
            });
          } else {
            // Si no hay partes que asignar, directo al calendario
            this.navCtrl.navigateRoot('/calendario');
          }

        } else {
          console.error('Error al crear la ruta:', res?.message);
        }
      });

    } catch (error) {
      console.error('Error al crear la ruta:', error);
    }
  }

  cancelar() {
    this.navCtrl.back();
  }
}
