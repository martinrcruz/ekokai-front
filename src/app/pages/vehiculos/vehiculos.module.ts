import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { ListVehiculoComponent } from './list-vehiculo/list-vehiculo.component';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';



@NgModule({
  declarations: [ListVehiculoComponent, FormVehiculoComponent],
  imports: [
    CommonModule,
    IonicModule,
    VehiculosRoutingModule,
    ReactiveFormsModule
  ]
})
export class VehiculosModule { }
