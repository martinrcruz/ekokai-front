import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCalendarioComponent } from './list-calendario/list-calendario.component';
import { FormCalendarioComponent } from './form-calendario/form-calendario.component';
import { CrearRutaCalendarioComponent } from './crear-ruta-calendario/crear-ruta-calendario.component';

const routes: Routes = [
  {
    path: '',
    component: ListCalendarioComponent
  },
  {
    path: 'crear-ruta/:date',
    component: CrearRutaCalendarioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }