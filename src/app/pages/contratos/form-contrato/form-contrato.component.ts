import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ContratoService } from 'src/app/services/contrato.service';
import { ClientesService, Cliente } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-form-contrato',
  standalone: false,
  templateUrl: './form-contrato.component.html',
  styleUrls: ['./form-contrato.component.scss'],
})
export class FormContratoComponent implements OnInit {

  contractForm!: FormGroup;
  isEdit = false;
  contractId: string | null = null;
  clientes: Cliente[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _contrato: ContratoService,
    private clientesService: ClientesService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initForm();
    this.contractId = this.route.snapshot.paramMap.get('id');
    if (this.contractId) {
      this.isEdit = true;
      this.cargarContrato(this.contractId);
    }
    this.loadClientes();
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
      const req = await this._contrato.getContractById(id);
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
        const req = await this._contrato.createContract(data);
        req.subscribe((resp: any) => {
          // Cambiado de '/contracts' a '/contratos'
          this.navCtrl.navigateRoot('/contratos');
        });
      } else {
        // Editar contrato
        data._id = this.contractId;
        const req = await this._contrato.updateContract(this.contractId as string, data);
        req.subscribe((resp: any) => {
          // Cambiado de '/contracts' a '/contratos'
          this.navCtrl.navigateRoot('/contratos');
        });
      }
    } catch (error) {
      console.error('Error al guardar contrato:', error);
    }
  }

  cancel() {
    // Cambiado de '/contracts' a '/contratos'
    this.navCtrl.navigateBack('/contratos');
  }

  loadClientes() {
    this.loading = true;
    this.clientesService.getCustomers().subscribe({
      next: (response: any) => {
        if (response && response.ok && response.data) {
          this.clientes = response.data.customers;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar clientes', error);
        this.loading = false;
      }
    });
  }
  
  onClientSelected(client: any) {
    console.log('Cliente seleccionado:', client);
    this.contractForm.get('customerId')?.setValue(client._id);
    this.contractForm.get('customerId')?.markAsDirty();
  }
}
