import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-material',
  standalone: false,
  templateUrl: './form-material.component.html',
  styleUrls: ['./form-material.component.scss'],
})
export class FormMaterialComponent  implements OnInit {

  materialForm!: FormGroup;
  isEdit = false;
  materialId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.materialId = params.get('id');
      if (this.materialId) {
        this.isEdit = true;
        this.cargarMaterial(this.materialId);
      }
    });
  }

  initForm() {
    this.materialForm = this.fb.group({
      name:        ['', Validators.required],
      code:        ['', Validators.required],
      description: [''],
      type:        ['']
    });
  }

  async cargarMaterial(id: string) {
    // try {
    //   const req = await this.apiService.getMaterialById(id); // Ajusta si tu APIService lo define
    //   req.subscribe((res: any) => {
    //     if (res.ok && res.material) {
    //       this.materialForm.patchValue({
    //         name:        res.material.name,
    //         code:        res.material.code,
    //         description: res.material.description,
    //         type:        res.material.type
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error al cargar material:', error);
    // }
  }

  async guardar() {
    if (this.materialForm.invalid) return;
    const data = this.materialForm.value;
  //   try {
  //     if (!this.isEdit) {
  //       // Crear
  //       const req = await this.apiService.createMaterial(data);
  //       req.subscribe(() => {
  //         this.navCtrl.navigateRoot('/materials');
  //       });
  //     } else {
  //       // Editar
  //       data._id = this.materialId;
  //       const req = await this.apiService.updateMaterial(data);
  //       req.subscribe(() => {
  //         this.navCtrl.navigateRoot('/materials');
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error al guardar material:', error);
  //   }
  }
}
