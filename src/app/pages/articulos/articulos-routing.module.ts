import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListArticuloComponent } from './list-articulo/list-articulo.component';
import { FormArticuloComponent } from './form-articulo/form-articulo.component';

const routes: Routes = [
  {
    path: '',
    component: ListArticuloComponent
  },
  {
    path: 'create',
    component: FormArticuloComponent
  },
  {
    path: 'edit/:id',
    component: FormArticuloComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticulosRoutingModule { } 