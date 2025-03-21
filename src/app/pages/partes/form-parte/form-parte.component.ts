import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-parte',
  standalone: false,
  templateUrl: './form-parte.component.html',
  styleUrls: ['./form-parte.component.scss'],
})
export class FormParteComponent  implements OnInit {

  parteForm!: FormGroup;
  isEdit = false;
  parteId: string | null = null;
  documentos: File[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.parteId = params.get('id');
      if (this.parteId) {
        this.isEdit = true;
        this.cargarParte(this.parteId);
      }
    });
  }

  initForm() {
    this.parteForm = this.fb.group({
      // Ajusta los campos según tu modelo
      description: ['', Validators.required],
      facturacion: [0],
      state:       ['Pendiente', Validators.required],
      type:        ['Mantenimiento', Validators.required],
      categoria:   ['Extintores', Validators.required],
      asignado:    [false],
      date:        ['', Validators.required],
      zone:        ['', Validators.required],
      customer:    ['', Validators.required],
      ruta:        ['']
    });
  }

  async cargarParte(id: string) {
    // try {
    //   const req = await this.apiService.getParteById(id);
    //   req.subscribe((res: any) => {
    //     if (res.ok && res.parte) {
    //       this.parteForm.patchValue({
    //         description: res.parte.description,
    //         facturacion: res.parte.facturacion,
    //         state:       res.parte.state,
    //         type:        res.parte.type,
    //         categoria:   res.parte.categoria,
    //         asignado:    res.parte.asignado,
    //         date:        res.parte.date,
    //         zone:        res.parte.zone,
    //         customer:    res.parte.customer,
    //         ruta:        res.parte.ruta
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error al cargar parte:', error);
    // }
  }

  async guardar() {
    if (this.parteForm.invalid) return;

    const data = this.parteForm.value;
    
    try {
      if (!this.isEdit) {
        // Crear parte
        const req = await this.apiService.createParte(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/partes');
          }
        });
      } else {
        // Actualizar parte
        data._id = this.parteId;
        const req = await this.apiService.updateParte(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/partes');
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar parte:', error);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let f of files) {
      this.documentos.push(f);
    }
  }
  
  removeDoc(doc: File) {
    this.documentos = this.documentos.filter(d => d !== doc);
  }
}
