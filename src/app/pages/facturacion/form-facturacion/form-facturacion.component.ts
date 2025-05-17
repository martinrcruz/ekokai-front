import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';
import { RutasService } from 'src/app/services/rutas.service';
import { PartesService } from 'src/app/services/partes.service';

@Component({
  selector: 'app-form-facturacion',
  standalone: false,
  templateUrl: './form-facturacion.component.html',
  styleUrls: ['./form-facturacion.component.scss']
})
export class FormFacturacionComponent implements OnInit {

  facturacionForm!: FormGroup;
  isEdit = false;
  facturacionId: string | null = null;

  // Listas para selectores
  rutasDisponibles: any[] = [];
  partesDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _facturacion: FacturacionService,
    private _rutas: RutasService,
    private _partes: PartesService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarRutasYPartes();
    this.route.paramMap.subscribe(params => {
      this.facturacionId = params.get('id');
      if (this.facturacionId) {
        this.isEdit = true;
        this.cargarFacturacion(this.facturacionId);
      }
    });
  }

  initForm() {
    this.facturacionForm = this.fb.group({
      facturacion:  [0, Validators.required],
      ruta:         ['', Validators.required],
      parte:        ['', Validators.required]
    });
  }

  async cargarRutasYPartes() {
    try {
      // Cargar rutas
      const reqRutas = await this._rutas.getRutas();
      reqRutas.subscribe((res: any) => {
        if (res.ok && res.rutas) {
          this.rutasDisponibles = res.rutas;
        }
      });

      // Cargar partes
      const reqPartes = await this._partes.getPartes();
      reqPartes.subscribe((res: any) => {
        console.log(res);
        this.partesDisponibles = res.partes;
      });
    } catch (error) {
      console.error('Error al cargar rutas y partes:', error);
    }
  }

 async cargarFacturacion(id: string) {
  const req = await this._facturacion.getFacturacionById(id);
  req.subscribe(res => {
    console.log(res)
    if (!(res?.ok && res.data?.facturacion)) return;

    const f = res.data.facturacion;

    /* ▸ Garantizar que la ruta y el parte existan en sus arrays
       (por si aún no se han cargado desde el backend) */
    if (!this.rutasDisponibles.some(r => r._id === f.ruta._id)) {
      this.rutasDisponibles.push(f.ruta);
    }
    if (!this.partesDisponibles.some(p => p._id === f.parte._id)) {
      this.partesDisponibles.push(f.parte);
    }

    /* ▸ Cargar datos en el formulario */
    this.facturacionForm.patchValue({
      facturacion: f.facturacion,
      ruta:        f.ruta._id,   // solo el _id
      parte:       f.parte._id   // solo el _id
    });
  });
}

async guardar() {
  if (this.facturacionForm.invalid) return;

  try {
    const data = this.facturacionForm.value;

    if (!this.isEdit) {
      const req = await this._facturacion.createFacturacion(data);
      req.subscribe(resp => {
        if (resp.ok) this.navCtrl.navigateRoot('/facturacion');
      });
    } else if (this.facturacionId) {
      const req = await this._facturacion.updateFacturacion(this.facturacionId, data);
      req.subscribe(resp => {
        if (resp.ok) this.navCtrl.navigateRoot('/facturacion');
      });
    }
  } catch (error) {
    console.error('Error guardando facturación:', error);
  }
}
}
