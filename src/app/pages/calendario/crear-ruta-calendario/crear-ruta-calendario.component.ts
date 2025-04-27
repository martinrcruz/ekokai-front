import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RutasService } from '../../../services/rutas.service';
import { PartesService } from '../../../services/partes.service';
import { VehiculosService } from '../../../services/vehiculos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Ruta } from '../../../models/ruta.model';
import { ApiResponse } from '../../../models/api-response.model';

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
    private rutasService: RutasService,
    private partesService: PartesService,
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
      const vehReq = await this.vehiculosService.getVehicles();
      vehReq.subscribe((res: any) => {
        console.log(res)
        if (res.ok && res.vehicles) {
          this.vehicles = res.vehicles;
        }
      });

      // Cargar Users
      const usrReq = await this.usuariosService.getUsers();
      usrReq.subscribe((res: any) => {
        if (res.ok && res.users) {
          this.users = res.users;
        }
      });

      // Cargar Partes No Asignados
      await this.loadPartesNoAsignados();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async loadPartesNoAsignados() {
    try {
      const req = await this.partesService.getPartesNoAsignados();
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.partesNoAsignados = res.partes;
          }
        },
        (error) => {
          console.error('Error al cargar partes no asignados:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
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

      const data: Partial<Ruta> = {
        date: this.date,
        name: {
          _id: this.rutaNId,
          name: selectedRutaN.name,
          __v: 0
        },
        type: this.type,
        state: this.state,
        vehicle: selectedVehicle || undefined,
        users: selectedUsers,
        comentarios: '',
        herramientas: [],
        eliminado: false
      };

      const req = await this.rutasService.createRuta(data);
      req.subscribe(
        (response: ApiResponse<Ruta>) => {
          if (response.ok) {
            this.navCtrl.navigateBack('/calendario');
          } else {
            console.error('Error al crear ruta:', response.error);
          }
        },
        (error) => {
          console.error('Error al crear ruta:', error);
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
