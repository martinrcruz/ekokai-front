import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ListClienteComponent } from './list-cliente/list-cliente.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListClienteComponent, FormClienteComponent],
  imports: [
    CommonModule,
    IonicModule,
    ClientesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ClientesModule { }
