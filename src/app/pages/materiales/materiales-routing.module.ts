import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMaterialComponent } from './list-material/list-material.component';
import { FormMaterialComponent } from './form-material/form-material.component';

const routes: Routes = [
  {
    path: '',
    component: ListMaterialComponent
  },
    {
      path: 'create',
      component: FormMaterialComponent
    },
    {
      path: 'edit/:id',
      component: FormMaterialComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }