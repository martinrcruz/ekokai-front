import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
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
      ruta:         [''],
      parte:        ['']
    });
  }

  async cargarFacturacion(id: string) {
    // try {
    //   const req = await this.apiService.getFacturacion(id); // Ajusta si tu apiService tiene getFacturacionById
    //   req.subscribe((res: any) => {
    //     if (res.ok && res.facturacion) {
    //       this.facturacionForm.patchValue({
    //         facturacion: res.facturacion.facturacion,
    //         ruta:        res.facturacion.ruta,
    //         parte:       res.facturacion.parte
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error al cargar facturación:', error);
    // }
  }

  async guardar() {
    // if (this.facturacionForm.invalid) return;

    // const data = this.facturacionForm.value;
    // try {
    //   if (!this.isEdit) {
    //     // Crear
    //     const req = await this.apiService.createFacturacion(data);
    //     req.subscribe((resp: any) => {
    //       if (resp.ok) {
    //         this.navCtrl.navigateRoot('/facturacion');
    //       }
    //     });
    //   } else {
    //     // Actualizar
    //     data._id = this.facturacionId;
    //     const req = await this.apiService.updateContract(data); // Ajusta si tu API define un update
    //     req.subscribe((resp: any) => {
    //       if (resp.ok) {
    //         this.navCtrl.navigateRoot('/facturacion');
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.error('Error guardando facturación:', error);
    // }
  }
}
