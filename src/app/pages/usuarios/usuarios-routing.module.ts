import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'crear',
    pathMatch: 'full'
  },
  {
    path: 'crear',
    component: FormUsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }