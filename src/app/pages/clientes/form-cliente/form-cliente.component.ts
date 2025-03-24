import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-cliente',
  standalone: false,
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss'],
})
export class FormClienteComponent implements OnInit {

  customerForm!: FormGroup;
  customerId!: any;
  zones: any[] = [];
  selectedFile!: File | null;
  previewImage: any = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');

    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nifCif: ['', Validators.required],
      address: [''],
      zone: ['', Validators.required],
      phone: [''],
      contactName: [''],
      code: [''],
      photo: ['']
    });

    if (this.customerId) {
      const customer = await this.apiService.getCustomerById(this.customerId);
      customer.subscribe((client: any) => {
        const zoneId = typeof client.customer.zone === 'object' ? client.customer.zone._id : client.customer.zone;
        this.customerForm.patchValue({ ...client.customer, zone: zoneId });

        this.previewImage = client.customer.photo || null;
      });
    }

    this.loadZones();
  }

  async loadZones() {
    const zones = await this.apiService.getZones();
    zones.subscribe((res: any) => {
      this.zones = res.zone;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  async saveCustomer() {
    // if (this.customerForm.invalid) return;

    // const customerData = new FormData();

    // Object.entries(this.customerForm.value).forEach(([key, value]) => {
    //   customerData.append(key, value as string);
    // });

    // if (this.selectedFile) {
    //   customerData.append('photo', this.selectedFile);
    // }

    // if (this.customerId) {
    //   const res = await this.apiService.updateCustomer(this.customerId, customerData);
    //   res.subscribe(async () => {
    //     const toast = await this.toastCtrl.create({ message: 'Cliente actualizado', duration: 2000 });
    //     toast.present();
    //     this.router.navigate(['/list-customer']);
    //   });
    // } else {
    //   const res = await this.apiService.createCustomer(customerData);
    //   res.subscribe(async () => {
    //     const toast = await this.toastCtrl.create({ message: 'Cliente creado', duration: 2000 });
    //     toast.present();
    //     this.router.navigate(['/list-customer']);
    //   });
    // }
  }

}
