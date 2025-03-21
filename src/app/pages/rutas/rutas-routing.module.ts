import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRutaComponent } from './list-ruta/list-ruta.component';
import { FormRutaComponent } from './form-ruta/form-ruta.component';

const routes: Routes = [
  {
    path: '',
    component: ListRutaComponent
  },
  {
    path: 'create',
    component: FormRutaComponent
  },
  {
    path: 'edit/:id',
    component: FormRutaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }