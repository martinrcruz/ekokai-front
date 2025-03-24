import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClienteComponent } from './list-cliente/list-cliente.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ListClienteComponent
  },
    {
      path: 'create',
      component: FormClienteComponent
    },
    {
      path: 'edit/:id',
      component: FormClienteComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }