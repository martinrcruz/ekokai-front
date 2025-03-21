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
export class FormRutaComponent  implements OnInit {
  rutaForm!: FormGroup;
  isEdit = false;
  rutaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.rutaId = params.get('id');
      if (this.rutaId) {
        this.isEdit = true;
        this.cargarRuta(this.rutaId);
      }
    });
  }

  initForm() {
    this.rutaForm = this.fb.group({
      // Ajusta campos según tu modelo de Rutas
      name:      ['', Validators.required],   // o ID a RutaN
      date:      ['', Validators.required],   // Ej: Fecha
      state:     ['Pendiente', Validators.required],
      vehicle:   [''],  // Podrías usar un select para vehicles
      // users:   []  -> array de user IDs, depende de tu lógica
    });
  }

  async cargarRuta(id: string) {
    try {
      const req = await this.apiService.getRutaById(id);
      req.subscribe((res: any) => {
        if (res.ok && res.ruta) {
          this.rutaForm.patchValue({
            name:    res.ruta.name?._id || res.ruta.name, 
            date:    res.ruta.date,
            state:   res.ruta.state,
            vehicle: res.ruta.vehicle,
            // users: ...
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar ruta:', error);
    }
  }

  async guardar() {
    if (this.rutaForm.invalid) return;

    const data = this.rutaForm.value;
    try {
      if (!this.isEdit) {
        // Crear ruta
        const req = await this.apiService.createRuta(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/rutas');
          }
        });
      } else {
        // Actualizar ruta
        data._id = this.rutaId;
        const req = await this.apiService.updateRuta(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/rutas');
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar ruta:', error);
    }
  }
}
