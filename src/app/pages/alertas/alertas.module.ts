import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAlertaComponent } from './list-alerta/list-alerta.component';
import { FormAlertaComponent } from './form-alerta/form-alerta.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ListAlertaComponent, FormAlertaComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AlertasModule { }
