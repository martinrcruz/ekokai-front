import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ClientesService, Cliente, ClientesResponse } from '../../../services/clientes.service';
import { ZonasService, Zona, ZonasResponse } from '../../../services/zonas.service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../interfaces/api-response.interface';

@Component({
  selector: 'app-list-cliente',
  standalone: false,
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
})
export class ListClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  zonas: Zona[] = [];
  errorMessage: string = '';
  searchText: string = '';
  selectedZone: string = '';
  selectedType: string = '';

  constructor(
    private clientesService: ClientesService,
    private zonasService: ZonasService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarZonas();
  }

  async cargarClientes() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando clientes...'
    });
    await loading.present();

    try {
      const response = await firstValueFrom(this.clientesService.getCustomers());
      if (response && response.ok && response.data) {
        this.clientes = response.data.customers;
        this.filteredClientes = [...this.clientes];
      } else {
        this.clientes = [];
        this.filteredClientes = [];
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.errorMessage = 'Error al cargar los clientes. Por favor, intente nuevamente.';
      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
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
      const toast = await this.toastCtrl.create({
        message: 'Error al cargar las zonas',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  filterCustomers() {
    this.filteredClientes = this.clientes.filter(cliente => {
      const matchesSearch = cliente.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                          cliente.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                          cliente.nifCif?.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesZone = !this.selectedZone || cliente.zone?._id === this.selectedZone;
      
      const matchesType = !this.selectedType || cliente.tipo === this.selectedType;
      
      return matchesSearch && matchesZone && matchesType;
    });
  }

  nuevoCliente() {
    this.router.navigate(['/clientes/create']);
  }

  editarCliente(id: string) {
    this.router.navigate(['/clientes/edit', id]);
  }

  async eliminarCliente(id: string) {
    const toast = await this.toastCtrl.create({
      message: '¿Está seguro de eliminar este cliente?',
      position: 'bottom',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const response = await firstValueFrom(this.clientesService.deleteCustomer(id));
              if (response && response.ok) {
                this.clientes = this.clientes.filter(c => c._id !== id);
                this.filterCustomers();
                const successToast = await this.toastCtrl.create({
                  message: 'Cliente eliminado correctamente',
                  duration: 2000,
                  position: 'bottom',
                  color: 'success'
                });
                await successToast.present();
              } else {
                throw new Error(response?.error || 'Error al eliminar el cliente');
              }
            } catch (error) {
              console.error('Error al eliminar cliente:', error);
              const errorToast = await this.toastCtrl.create({
                message: 'Error al eliminar el cliente',
                duration: 2000,
                position: 'bottom',
                color: 'danger'
              });
              await errorToast.present();
            }
          }
        }
      ]
    });
    await toast.present();
  }
}
