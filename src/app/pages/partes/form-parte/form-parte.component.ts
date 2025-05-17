import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PartesService } from 'src/app/services/partes.service';
import { RutasService } from 'src/app/services/rutas.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Articulo } from 'src/app/models/articulo.model';

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
  articulos: Articulo[] = [];

  // Listas para selects
  customersList: any[] = [];   // "Customer" unificado
  rutasDisponibles: any[] = [];

  customers: any[] = []; // lista de clientes
  minDate: string = '';  // p.ej. '2023-08-01'

  clientModalOpen = false;
  filteredCustomers: any[] = [];
  searchClientTxt: string = '';

  // Variables para el modal de artículos
  articulosModalOpen = false;
  filteredArticulos: Articulo[] = [];
  searchArticuloTxt: string = '';
  articulosSeleccionados: Articulo[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _parte: PartesService,
    private _rutas: RutasService,
    private _customer: CustomerService,
    private _articulos: ArticuloService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRutas();
    this.loadCustomers();
    this.loadArticulos();

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
      categoria: ['Extintores', Validators.required],
      date: ['', Validators.required],
      customer: ['', Validators.required],
      ruta: [''],
      coordinationMethod: ['Coordinar según horarios'],
      gestiona: [0],
      periodico: [false],
      frequency: ['Mensual'],
      endDate: [''],
      articulos: this.fb.array([])
    });
  }

  get articulosFormArray() {
    return this.parteForm.get('articulos') as FormArray;
  }

  crearArticuloFormGroup() {
    return this.fb.group({
      cantidad: [1, Validators.required],
      codigo: ['', Validators.required],
      grupo: ['', Validators.required],
      familia: ['', Validators.required],
      descripcionArticulo: ['', Validators.required],
      precioVenta: [0, Validators.required],
      articuloId: [''] // Campo para guardar referencia al artículo original
    });
  }

  agregarArticulo() {
    this.articulosFormArray.push(this.crearArticuloFormGroup());
  }

  agregarArticuloExistente(articulo: Articulo) {
    const articuloForm = this.crearArticuloFormGroup();
    articuloForm.patchValue({
      cantidad: 1,
      codigo: articulo.codigo,
      grupo: articulo.grupo,
      familia: articulo.familia,
      descripcionArticulo: articulo.descripcionArticulo,
      precioVenta: articulo.precioVenta,
      articuloId: articulo._id
    });
    this.articulosFormArray.push(articuloForm);
  }

  eliminarArticulo(index: number) {
    this.articulosFormArray.removeAt(index);
  }

  async loadArticulos() {
    const req = await this._articulos.getArticulos();
    req.subscribe((res: any) => {
      if (res.ok && res.articulos) {
        this.articulos = res.articulos;
        this.filteredArticulos = [...this.articulos];
      }
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
      if (!res) return;

      const p = res;                         // alias corto
      const fechaIso = p.date ? this.isoDateOnly(p.date) : '';

      console.log(p)

      /* ----------- rellenar FormGroup ----------- */
      this.parteForm.patchValue({
        description: p.description,
        facturacion: p.facturacion,
        state: p.state,
        type: p.type,
        categoria: p.categoria,
        date: fechaIso,
        customer: p.customer?._id ?? '',
        ruta: p.ruta?._id ?? p.ruta ?? '',
        coordinationMethod: p.coordinationMethod,
        gestiona: p.gestiona,
        periodico: p.periodico,
        frequency: p.frequency ?? 'Mensual',
        endDate: p.endDate ? this.isoDateOnly(p.endDate) : ''
      });

      /* mostrar el nombre del cliente en el input de búsqueda */
      this.searchClientTxt = p.customer?.name ?? '';

      /* ----------- cargar artículos si existen ----------- */
      if (p.articulos?.length) {
        /* vaciamos el array por si ya hay items */
        while (this.articulosFormArray.length) this.articulosFormArray.removeAt(0);

        p.articulos.forEach((a: any) => {
          const g = this.crearArticuloFormGroup();
          g.patchValue({
            cantidad: a.cantidad,
            codigo: a.codigo,
            grupo: a.grupo,
            familia: a.familia,
            descripcionArticulo: a.descripcionArticulo,
            precioVenta: a.precioVenta,
            articuloId: a.articuloId || ''
          });
          this.articulosFormArray.push(g);
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
      const body = { ...this.parteForm.value };   // en edición
      if (!body.ruta) delete body.ruta;          // <-- evita "" en la petición
      if (!body.endDate) delete body.endDate;
      if (!body.frequency) delete body.frequency;
      // Crear parte
      const req = await this._parte.createParte(data);
      req.subscribe((resp: any) => {
        if (resp.ok) {
          this.navCtrl.navigateRoot('/partes');
        }
      });
    } else {
      // Actualizar parte
      const body = { ...this.parteForm.value, _id: this.parteId };   // en edición
      if (!body.ruta) delete body.ruta;          // <-- evita "" en la petición
      if (!body.endDate) delete body.endDate;
      if (!body.frequency) delete body.frequency;
      const req = await this._parte.updateParte(body);
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

  private isoDateOnly(dateStr: string): string {
    return new Date(dateStr).toISOString().substring(0, 10);
  }

  openArticulosModal() {
    this.articulosModalOpen = true;
    this.filteredArticulos = [...this.articulos];
  }

  closeArticulosModal() {
    this.articulosModalOpen = false;
  }

  filterArticulos(event: any) {
    const txt = this.searchArticuloTxt.toLowerCase().trim();
    this.filteredArticulos = this.articulos.filter(a => 
      a.codigo.toLowerCase().includes(txt) || 
      a.descripcionArticulo.toLowerCase().includes(txt) ||
      a.familia.toLowerCase().includes(txt) ||
      a.grupo.toLowerCase().includes(txt)
    );
  }

  selectArticulo(articulo: Articulo) {
    this.agregarArticuloExistente(articulo);
    // Opcional: puedes cerrar el modal al seleccionar un artículo
    // o dejarlo abierto para permitir seleccionar varios
    // this.closeArticulosModal();
  }

  selectMultipleArticulos() {
    for (const articulo of this.articulosSeleccionados) {
      this.agregarArticuloExistente(articulo);
    }
    this.articulosSeleccionados = [];
    this.closeArticulosModal();
  }

  toggleArticuloSelection(articulo: Articulo, event: any) {
    const isChecked = event.detail.checked;
    
    if (isChecked) {
      this.articulosSeleccionados.push(articulo);
    } else {
      this.articulosSeleccionados = this.articulosSeleccionados.filter(a => a._id !== articulo._id);
    }
  }
}
