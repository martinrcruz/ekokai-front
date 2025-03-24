import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-cliente',
  standalone: false,
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
})
export class ListClienteComponent implements OnInit {

  customers: any[] = [];
  loading: boolean = false;

  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];

  // Búsqueda
  searchText: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadClientes();
  }

  async loadClientes() {
    this.loading = true;
    const res = await this.apiService.getCustomers();
    res.subscribe({
      next: (data: any) => {
        console.log(data);
        this.customers = data.customers; // data debería ser directamente un arreglo
        this.loading = false;
        this.filterCustomers(); // Inicializa paginación al cargar datos
      },
      error: async () => {
        this.loading = false;
        const toast = await this.toastCtrl.create({ message: 'Error al cargar los customers', duration: 2500 });
        toast.present();
      }
    });
  }

  filterCustomers() {
    this.currentPage = 1;
    const text = this.searchText.toLowerCase().trim();

    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(text) ||
      c.email.toLowerCase().includes(text) ||
      c.nifCif.toLowerCase().includes(text) ||
      (c.zone?.name || '').toLowerCase().includes(text)
    );

    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    this.updatePaginatedCustomers();
  }

  updatePaginatedCustomers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCustomers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCustomers();
    }
  }

  editCliente(id: number) {
    this.router.navigate(['/clientes/edit/' + id]);
  }

  createCliente() {
    this.router.navigate(['/clientes/create']);
  }

  async deleteCliente(id: number) {
    // const alert = await this.alertCtrl.create({
    //   header: 'Confirmar eliminación',
    //   message: '¿Seguro que deseas eliminar este cliente?',
    //   buttons: [
    //     { text: 'Cancelar', role: 'cancel' },
    //     {
    //       text: 'Eliminar',
    //       handler: () => {
    //         this.apiService.deleteCustomer(id).subscribe({
    //           next: async () => {
    //             const toast = await this.toastCtrl.create({
    //               message: 'Cliente eliminado correctamente',
    //               duration: 2000
    //             });
    //             toast.present();
    //             this.loadClientes(); // Recargar clientes después de eliminar
    //           },
    //           error: async () => {
    //             const toast = await this.toastCtrl.create({
    //               message: 'Error al eliminar cliente',
    //               duration: 2000
    //             });
    //             toast.present();
    //           }
    //         });
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

}
