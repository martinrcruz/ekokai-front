import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-ruta',
  standalone: false,
  templateUrl: './form-ruta.component.html',
  styleUrls: ['./form-ruta.component.scss'],
})
export class FormRutaComponent implements OnInit {
  rutaForm!: FormGroup;
  isEdit = false;
  rutaId: string | null = null;
  users: any[] = [];

  listaRutaN: any[] = [];
  listaVehicles: any[] = [];
  listaClientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.initForm();
    this.cargarListas();
    this.loadUsers();

    this.route.paramMap.subscribe(params => {
      this.rutaId = params.get('id');
      if (this.rutaId) {
        this.isEdit = true;
        this.cargarRuta(this.rutaId);
      }
    });
  }

  async loadUsers() {
    const req = await this.apiService.getUsers();
    req.subscribe((resp: any) => {
      if (resp.ok) {
        this.users = resp.users;
      }
    });
  }

  async cargarListas() {
    const rnReq = await this.apiService.getRutasN();
    rnReq.subscribe((res: any) => {
      if (res.ok) {
        this.listaRutaN = res.rutas; // ajusta según JSON
      }
    });
    // GET /vehicle => [{ _id, brand, ...}, ...]
    const vReq = await this.apiService.getVehicles();
    vReq.subscribe((res: any) => {
      if (res.ok) {
        this.listaVehicles = res.vehicles;
      }
    });

    const cReq = await this.apiService.getCustomers();
    cReq.subscribe((res: any) => {
      console.log(res)
      if (res.ok) {
        this.listaClientes = res.customers;
      }
    });
  }

  initForm() {
    this.rutaForm = this.fb.group({
      // Ajusta campos según tu modelo de Rutas
      name: ['', Validators.required],   // o ID a RutaN
      date: ['', Validators.required],   // Ej: Fecha
      state: ['Pendiente', Validators.required],
      vehicle: [''],  // Podrías usar un select para vehicles
      users: [[]],
      comentarios: [''],
      encargado: ['', Validators.required],
      herramientas: [[]]
    });
  }

  async cargarRuta(id: string) {
    try {
      const req = await this.apiService.getRutaById(id);
      req.subscribe((res: any) => {
        if (res.ok && res.ruta) {
          this.rutaForm.patchValue({
            name: res.ruta.name?._id || res.ruta.name,
            date: res.ruta.date,
            state: res.ruta.state,
            vehicle: res.ruta.vehicle,
            users: res.ruta.users,
            comentarios: res.ruta.comentarios,
            encargado: res.ruta.encargado,
            herramientas: res.ruta.herramientas
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar ruta:', error);
    }
  }

  async onSave() {
    if (this.rutaForm.invalid) return;
    const data = this.rutaForm.value;
    // Check encargado
    if (!data.encargado) {
      console.error('Encargado es obligatorio');
      return;
    }

    if (!this.isEdit) {
      // createRuta
      const req = await this.apiService.createRuta(data);
      req.subscribe((resp: any) => {
        if (resp.ok) {
          this.navCtrl.navigateRoot('/rutas');
        }
      });
    } else {
      // updateRuta
      data._id = this.rutaId;
      const req = await this.apiService.updateRuta(data);
      req.subscribe((resp: any) => {
        if (resp.ok) {
          this.navCtrl.navigateRoot('/rutas');
        }
      });
    }
  }

  cancel() {
    this.navCtrl.back();
  }
}
