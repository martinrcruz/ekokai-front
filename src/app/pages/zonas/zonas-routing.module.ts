import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListZonaComponent } from './list-zona/list-zona.component';
import { FormZonaComponent } from './form-zona/form-zona.component';

const routes: Routes = [
  {
    path: '',
    component: ListZonaComponent
  },
    {
      path: 'create',
      component: FormZonaComponent
    },
    {
      path: 'edit/:id',
      component: FormZonaComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonasRoutingModule { }