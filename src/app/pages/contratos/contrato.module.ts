import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListContratoComponent } from './list-contrato/list-contrato.component';
import { FormContratoComponent } from './form-contrato/form-contrato.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContratoRoutingModule } from './contrato-routing.module';



@NgModule({
  declarations: [ListContratoComponent, FormContratoComponent],
  imports: [
    CommonModule,
    IonicModule,
    ContratoRoutingModule,
    ReactiveFormsModule
  ]
})
export class ContratoModule { }
