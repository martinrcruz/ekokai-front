import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListParteComponent } from './list-parte/list-parte.component';
import { FormParteComponent } from './form-parte/form-parte.component';

const routes: Routes = [
  {
    path: '',
    component: ListParteComponent
  },
    {
      path: 'create',
      component: FormParteComponent
    },
    {
      path: 'edit/:id',
      component: FormParteComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartesRoutingModule { }