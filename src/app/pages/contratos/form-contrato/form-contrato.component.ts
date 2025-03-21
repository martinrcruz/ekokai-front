import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-contrato',
  standalone: false,
  templateUrl: './form-contrato.component.html',
  styleUrls: ['./form-contrato.component.scss'],
})
export class FormContratoComponent  implements OnInit {

  contractForm!: FormGroup;
  isEdit = false;
  contractId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.isEdit = true;
        this.cargarContrato(this.contractId);
      }
    });
  }

  initForm() {
    this.contractForm = this.fb.group({
      code:              ['', Validators.required],
      customerId:        ['', Validators.required],
      name:              ['', Validators.required],
      startDate:         ['', Validators.required],
      endDate:           ['', Validators.required],
      type:              ['F'],    // F, E, R, C ...
      averageTime:       [0],
      delegation:        [''],
      revisionFrequency: [''],
      address:           [''],
      zone:              [''],     // zone _id
      total:             [0]
    });
  }

  async cargarContrato(id: string) {
    try {
      const req = await this.apiService.getContractById(id);
      req.subscribe((res: any) => {
        // Ajusta según tu backend
        if (res) {
          this.contractForm.patchValue({
            code:       res.code,
            customerId: res.customerId,
            name:       res.name,
            startDate:  res.startDate,
            endDate:    res.endDate,
            type:       res.type,
            averageTime: res.averageTime,
            delegation: res.delegation,
            revisionFrequency: res.revisionFrequency,
            address:    res.address,
            zone:       res.zone,
            total:      res.total
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar contrato:', error);
    }
  }

  async guardar() {
    if (this.contractForm.invalid) return;

    const data = this.contractForm.value;
    try {
      if (!this.isEdit) {
        // Crear contrato
        const req = await this.apiService.createContract(data);
        req.subscribe((resp: any) => {
          // Ajusta si tu API retorna ok, etc.
          this.navCtrl.navigateRoot('/contracts');
        });
      } else {
        // Editar contrato
        data._id = this.contractId;
        const req = await this.apiService.updateContract(this.contractId as string, data);
        req.subscribe((resp: any) => {
          this.navCtrl.navigateRoot('/contracts');
        });
      }
    } catch (error) {
      console.error('Error al guardar contrato:', error);
    }
  }
}
