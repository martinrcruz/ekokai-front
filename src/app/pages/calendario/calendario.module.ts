import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonSearchbar } from '@ionic/angular';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ListCalendarioComponent } from './list-calendario/list-calendario.component';
import { FormCalendarioComponent } from './form-calendario/form-calendario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CrearRutaCalendarioComponent } from './crear-ruta-calendario/crear-ruta-calendario.component';
@NgModule({
  declarations: [ListCalendarioComponent, FormCalendarioComponent, CrearRutaCalendarioComponent],
  imports: [
    CommonModule,
    IonicModule,
    CalendarioRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
  ],
  exports: [ListCalendarioComponent, FormCalendarioComponent, CrearRutaCalendarioComponent]
})
export class CalendarioModule { }
