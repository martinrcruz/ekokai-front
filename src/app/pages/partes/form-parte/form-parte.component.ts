import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadLists();

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
      description:  ['', Validators.required],
      facturacion:  [0],
      state:        ['Pendiente', Validators.required],
      type:         ['Mantenimiento', Validators.required],
      categoria:    ['Extintores', Validators.required],
      asignado:     [false],
      date:         ['', Validators.required], // mes/año
      // Apunta al modelo unificado “Customer”.
      customer:     ['', Validators.required],
      // Ruta (opcional)
      ruta:         [''],
      // Parte periódico
      periodico:    [false],
      frequency:    ['Mensual'], // default
      endDate:      ['']
    });
  }

  async loadLists() {
    // 1. Cargar Customers unificados
    const cReq = await this.apiService.getCustomers(); 
    cReq.subscribe((res: any) => {
      if (res.ok && res.customers) {
        this.customersList = res.customers;
      }
    });

    // 2. Cargar Rutas disponibles
    const rReq = await this.apiService.getRutasDisponibles();
    rReq.subscribe((res: any) => {
      if (res.ok && res.rutas) {
        this.rutasDisponibles = res.rutas;
      }
    });
  }

  async loadParte(id: string) {
    const req = await this.apiService.getParteById(id);
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

  async guardar() {
    if (this.parteForm.invalid) return;

    const data = this.parteForm.value;
    // Forzar day=1 => no, el backend ya lo forza. 
    // Pero si deseas hacerlo en front, podrías parsear.

    try {
      if (!this.isEdit) {
        // Crear
        const req = await this.apiService.createParte(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/partes');
          }
        });
      } else {
        // Actualizar
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
