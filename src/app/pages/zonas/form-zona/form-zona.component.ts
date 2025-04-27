import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
@Component({
  selector: 'app-form-zona',
  standalone: false,
  templateUrl: './form-zona.component.html',
  styleUrls: ['./form-zona.component.scss'],
})
export class FormZonaComponent  implements OnInit {

  zonaForm!: FormGroup;
  isEdit = false;
  zonaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _zona: ZonasService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.zonaId = params.get('id');
      if (this.zonaId) {
        this.isEdit = true;
        this.cargarZona(this.zonaId);
      }
    });
  }

  initForm() {
    this.zonaForm = this.fb.group({
      name:  ['', Validators.required],
      code:  ['', Validators.required],
      codezip: [''] // ID de Zipcode (opcional)
    });
  }

  async cargarZona(id: string) {
    try {
      const req = await this._zona.getZoneById(id);
      req.subscribe((res: any) => {
        if (res.ok && res.zone) {
          this.zonaForm.patchValue({
            name:   res.zone.name,
            code:   res.zone.code,
            codezip: res.zone.codezip
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar zona:', error);
    }
  }

  async guardar() {
    if (this.zonaForm.invalid) return;

    const data = this.zonaForm.value;
    try {
      if (!this.isEdit) {
        // Crear
        const req = await this._zona.createZone(data);
        req.subscribe(() => {
          this.navCtrl.navigateRoot('/zonas');
        });
      } else {
        // Editar
        data._id = this.zonaId;
        const req = await this._zona.updateZone(this.zonaId!, data);
        req.subscribe(() => {
          this.navCtrl.navigateRoot('/zonas');
        });
      }
    } catch (error) {
      console.error('Error guardando zona:', error);
    }
  }

  cancel() {
    // Volver a la lista de zonas
    this.navCtrl.navigateBack('/zonas');
  }
}
