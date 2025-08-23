import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadComponent: () => import('./lista-usuarios/lista-usuarios.component').then(m => m.ListaUsuariosComponent)
  },
  {
    path: 'crear',
    component: FormUsuarioComponent
  },
  {
    path: 'editar/:id',
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
