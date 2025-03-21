import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsuarioComponent } from './list-usuario/list-usuario.component';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: ListUsuarioComponent
  },
  {
    path: 'create',
    component: FormUsuarioComponent
  },
  {
    path: 'edit/:id',
    component: FormUsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }