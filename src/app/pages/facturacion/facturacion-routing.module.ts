import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFacturacionComponent } from './list-facturacion/list-facturacion.component';
import { FormFacturacionComponent } from './form-facturacion/form-facturacion.component';

const routes: Routes = [
  {
    path: '',
    component: ListFacturacionComponent
  },
  {
    path: 'create',
    component: FormFacturacionComponent
  },
  {
    path: 'edit/:id',
    component: FormFacturacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionRoutingModule { }