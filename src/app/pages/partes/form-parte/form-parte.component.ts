import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartesService } from 'src/app/services/partes.service';
import { RutasService } from 'src/app/services/rutas.service';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-form-parte',
  standalone: false,
  templateUrl: './form-parte.component.html',
  styleUrls: ['./form-parte.component.scss']
})
export class FormParteComponent implements OnInit {

  parteForm!: FormGroup;
  isEdit = false;
  parteId: string | null = null;
  documentos: File[] = [];

  // Listas para selects
  customersList: any[] = [];   // “Customer” unificado
  rutasDisponibles: any[] = [];

  customers: any[] = []; // lista de clientes
  minDate: string = '';  // p.ej. '2023-08-01'

  clientModalOpen = false;
  filteredCustomers: any[] = [];
  searchClientTxt: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _parte: PartesService,
    private _rutas: RutasService,
    private _customer: CustomerService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadRutas();
    this.loadCustomers();

    this.route.paramMap.subscribe(params => {
      this.parteId = params.get('id');
      if (this.parteId) {
        this.isEdit = true;
        this.loadParte(this.parteId);
      }
    });
  }

  initForm() {
    this.parteForm = this.fb.group({
  description: ['', Validators.required],
      facturacion: [0],
      state: ['Pendiente', Validators.required],
      type: ['Mantenimiento', Validators.required],
      categoria: ['Extintores', Validators.required], // añade “Venta”
      date: ['', Validators.required],
      customer: ['', Validators.required],
      ruta: [''],
      coordinationMethod: ['Coordinar según horarios'],
      gestiona: [0],
      // Parte periódico
      periodico:    [false],
      frequency:    ['Mensual'], // default
      endDate:      ['']
    });
  }

  async loadCustomers() {
    const req = await this._customer.getCustomers();
    req.subscribe((resp: any) => {
      if (resp.ok) {
        this.customersList = resp.customers;
        this.filteredCustomers = [...this.customersList];
      }
    });
  }

  async loadRutas() {
    // Generamos la fecha "YYYY-MM-01" para el mes actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const firstDayOfMonth = `${year}-${month}-01`;

    // Llamamos a getRutasDisponibles(firstDayOfMonth)
    const rReq = await this._rutas.getRutasDisponibles(firstDayOfMonth);
    rReq.subscribe((res: any) => {
      if (res.ok && res.rutas) {
        this.rutasDisponibles = res.rutas;
      }
    });
  }

  async loadParte(id: string) {
    const req = await this._parte.getParteById(id);
    req.subscribe((res: any) => {
      if (res.ok && res.parte) {
        this.parteForm.patchValue({
          description: res.parte.description,
          facturacion: res.parte.facturacion,
          state:       res.parte.state,
          type:        res.parte.type,
          categoria:   res.parte.categoria,
          asignado:    res.parte.asignado,
          date:        res.parte.date, // 1er día del mes
          customer:    res.parte.customer, // _id
          ruta:        res.parte.ruta,
          periodico:   res.parte.periodico,
          frequency:   res.parte.frequency,
          endDate:     res.parte.endDate
        });
      }
    });
  }

  async onSave() {
    if (this.parteForm.invalid) return;

    const data = this.parteForm.value;
    // Verificar en front date >= minDate
    if (new Date(data.date) < new Date(this.minDate)) {
      console.error('Fecha anterior al mes actual');
      return;
    }

    if (!this.isEdit) {
      // Crear parte
      const req = await this._parte.createParte(data);
      req.subscribe((resp: any) => {
        if (resp.ok) {
          this.navCtrl.navigateRoot('/partes');
        }
      });
    } else {
      // Actualizar parte
      const req = await this._parte.updateParte(this.parteId!, data);
      req.subscribe((resp: any) => {
        if (resp.ok) {
          this.navCtrl.navigateRoot('/partes');
        }
      });
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

  openClientModal() {
    this.clientModalOpen = true;
  }
  closeClientModal() {
    this.clientModalOpen = false;
  }

  filterCustomers(event: any) {
    const txt = this.searchClientTxt.toLowerCase().trim();
    this.filteredCustomers = this.customersList.filter(c =>
      c.name.toLowerCase().includes(txt) ||
      c.nifCif.toLowerCase().includes(txt)
    );
  }

  selectCustomer(c: any) {
    // Asignamos al form
    this.parteForm.patchValue({ customer: c._id });
    this.searchClientTxt = c.name; // para mostrarlo en el IonInput
    this.clientModalOpen = false;
  }

  cancel() {
    this.navCtrl.back();
  }
}
