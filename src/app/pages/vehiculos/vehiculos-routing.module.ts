import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListVehiculoComponent } from './list-vehiculo/list-vehiculo.component';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';

const routes: Routes = [
  {
    path: '',
    component: ListVehiculoComponent
  },
    {
      path: 'create',
      component: FormVehiculoComponent
    },
    {
      path: 'edit/:id',
      component: FormVehiculoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculosRoutingModule { }