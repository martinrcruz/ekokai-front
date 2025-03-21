import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAlertaComponent } from './list-alerta/list-alerta.component';
import { FormAlertaComponent } from './form-alerta/form-alerta.component';

const routes: Routes = [
  {
    path: '',
    component: ListAlertaComponent
  },
  {
    path: 'create',
    component: FormAlertaComponent
  },
  {
    path: 'edit/:id',
    component: FormAlertaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertasRoutingModule { }