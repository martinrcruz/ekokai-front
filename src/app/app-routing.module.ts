// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Auth (ya funcionando). Si Auth ya tiene su módulo, deja su loadChildren aquí:
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then(m => m.AuthModule)
  },

  // Área Encargado (lazy)
  {
    path: 'encargado',
    loadChildren: () =>
      import('./pages/encargado/encargado.module').then(m => m.EncargadoModule)
  },

  // Área Administrador (lazy)
  {
    path: 'administrador',
    loadChildren: () =>
      import('./pages/administrador/administrador.module').then(m => m.AdministradorModule)
  },

  // Wildcard
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
