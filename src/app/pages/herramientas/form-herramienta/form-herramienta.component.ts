import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-herramienta',
  standalone: false,
  templateUrl: './form-herramienta.component.html',
  styleUrls: ['./form-herramienta.component.scss'],
})
export class FormHerramientaComponent  implements OnInit {

  herramientaForm!: FormGroup;
  isEdit = false;
  herramientaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.herramientaId = params.get('id');
      if (this.herramientaId) {
        this.isEdit = true;
        this.cargarHerramienta(this.herramientaId);
      }
    });
  }

  initForm() {
    this.herramientaForm = this.fb.group({
      name:        ['', Validators.required],
      code:        ['', Validators.required],
      description: ['']
    });
  }

  async cargarHerramienta(id: string) {
    try {
      // Ajusta si tu ApiService es getHerramientaById
      const req = await this.apiService.getHerramientaById(id);
      req.subscribe((res: any) => {
        if (res.ok && res.herramienta) {
          this.herramientaForm.patchValue({
            name:        res.herramienta.name,
            code:        res.herramienta.code,
            description: res.herramienta.description
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar herramienta:', error);
    }
  }

  async guardar() {
    if (this.herramientaForm.invalid) return;

    const data = this.herramientaForm.value;
    try {
      if (!this.isEdit) {
        // Crear
        const req = await this.apiService.createHerramienta(data);
        req.subscribe(() => {
          this.navCtrl.navigateRoot('/herramientas');
        });
      } else {
        // Editar
        data._id = this.herramientaId;
        const req = await this.apiService.updateHerramienta(data._id, data);
        req.subscribe(() => {
          this.navCtrl.navigateRoot('/herramientas');
        });
      }
    } catch (error) {
      console.error('Error al guardar herramienta:', error);
    }
  }
}
