import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHerramientaComponent } from './list-herramienta/list-herramienta.component';
import { FormHerramientaComponent } from './form-herramienta/form-herramienta.component';

const routes: Routes = [
  {
    path: '',
    component: ListHerramientaComponent
  },
    {
      path: 'create',
      component: FormHerramientaComponent
    },
    {
      path: 'edit/:id',
      component: FormHerramientaComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HerramientasRoutingModule { }