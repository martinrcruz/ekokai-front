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
  },
  {
    path: 'historial/:id',
    loadComponent: () => import('./historial-usuario/historial-usuario.component').then(m => m.HistorialUsuarioComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
