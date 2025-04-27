import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListContratoComponent } from './list-contrato/list-contrato.component';
import { FormContratoComponent } from './form-contrato/form-contrato.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContratosRoutingModule } from './contratos-routing.module';

@NgModule({
  declarations: [ListContratoComponent, FormContratoComponent],
  imports: [
    CommonModule,
    IonicModule,
    ContratosRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ListContratoComponent, FormContratoComponent]
})
export class ContratosModule { } 