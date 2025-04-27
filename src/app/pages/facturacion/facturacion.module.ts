import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ListFacturacionComponent } from './list-facturacion/list-facturacion.component';
import { FormFacturacionComponent } from './form-facturacion/form-facturacion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListFacturacionComponent, FormFacturacionComponent],
  imports: [
    CommonModule,
    IonicModule,
    FacturacionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ListFacturacionComponent, FormFacturacionComponent]
})
export class FacturacionModule { }
