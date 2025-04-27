import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ClientesService } from '../../../services/clientes.service';
import { ZonasService } from '../../../services/zonas.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-cliente',
  standalone: false,
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss'],
})
export class FormClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  isEdit = false;
  customerId: string | null = null;
  zonas: any[] = [];
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService,
    private zonasService: ZonasService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarZonas();
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('id');
      if (this.customerId) {
        this.isEdit = true;
        this.cargarCliente(this.customerId);
      }
    });
  }

  initForm() {
    this.clienteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nifCif: ['', Validators.required],
      phone: [''],
      address: [''],
      zone: [''],
      code: [''],
      contactName: [''],
      MI: [0],
      tipo: ['Normal']
    });
  }

  async cargarZonas() {
    try {
      const response = await firstValueFrom(this.zonasService.getZones());
      if (response && response.ok && response.data) {
        this.zonas = response.data.zones;
      } else {
        this.zonas = [];
      }
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    }
  }

  async cargarCliente(id: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando cliente...'
    });
    await loading.present();

    try {
      const response = await firstValueFrom(this.clientesService.getCustomerById(id));
      if (response && response.ok && response.data) {
        this.clienteForm.patchValue({
          name: response.data.name,
          email: response.data.email,
          nifCif: response.data.nifCif,
          phone: response.data.phone,
          address: response.data.address,
          zone: response.data.zone,
          code: response.data.code,
          contactName: response.data.contactName,
          MI: response.data.MI,
          tipo: response.data.tipo
        });
        this.previewImage = response.data.photo || null;
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al cargar el cliente',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.previewImage = null;
  }

  async guardar() {
    if (this.clienteForm.invalid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cliente...'
    });
    await loading.present();

    try {
      const formData = new FormData();
      Object.keys(this.clienteForm.value).forEach(key => {
        formData.append(key, this.clienteForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      if (this.isEdit && this.customerId) {
        await firstValueFrom(this.clientesService.updateCustomer(this.customerId, formData));
      } else {
        await firstValueFrom(this.clientesService.createCustomer(formData));
      }

      const toast = await this.toastCtrl.create({
        message: `Cliente ${this.isEdit ? 'actualizado' : 'creado'} correctamente`,
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/clientes']);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar el cliente',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
