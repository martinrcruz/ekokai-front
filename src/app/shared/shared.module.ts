import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { FormValidationDirective } from './directives/form-validation.directive';
import { ClientSelectorComponent } from './components/client-selector/client-selector.component';
import { FiltrosEstandarizadosComponent } from './components/global-filter/filtros-estandarizados.component';

@NgModule({
  declarations: [
    FormValidationDirective
  ],
  imports: [
    CommonModule,
    IonicModule,
    DatePickerComponent,
    ClientSelectorComponent,
    FiltrosEstandarizadosComponent
  ],
  exports: [
    CommonModule,
    IonicModule,
    DatePickerComponent,
    ClientSelectorComponent,
    FormValidationDirective,
    FiltrosEstandarizadosComponent
  ]
})
export class SharedModule { }
