import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListContratoComponent } from './list-contrato/list-contrato.component';
import { FormContratoComponent } from './form-contrato/form-contrato.component';

const routes: Routes = [
  {
    path: '',
    component: ListContratoComponent
  },
  {
    path: 'create',
    component: FormContratoComponent
  },
  {
    path: 'edit/:id',
    component: FormContratoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRoutingModule { } 