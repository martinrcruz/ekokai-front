import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { ListVehiculoComponent } from './list-vehiculo/list-vehiculo.component';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListVehiculoComponent, FormVehiculoComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    VehiculosRoutingModule, 
    FormsModule,
    SharedModule
  ],
  exports: [ListVehiculoComponent]
})
export class VehiculosModule { }
