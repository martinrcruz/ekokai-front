import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { WorkerGuard } from './guards/worker.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  // ---------------------------------
  // Rutas de autenticación
  // ---------------------------------
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then(m => m.AuthModule),
  },

  // ---------------------------------
  // Rutas protegidas (requieren AuthGuard)
  // ---------------------------------
  
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },

  // ---------------------------------
  // Rutas específicas por rol (componentes standalone)
  // ---------------------------------
  {
    path: 'encargado-home',
    loadComponent: () =>
      import('./pages/home/encargado-home/encargado-home.component').then(m => m.EncargadoHomeComponent),
    canActivate: [AuthGuard, WorkerGuard]
  },
  
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  
  {
    path: 'vecinos',
    loadChildren: () => import('./pages/vecinos/vecinos.module').then(m => m.VecinosModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  
  // ---------------------------------
  // Nuevas páginas standalone
  // ---------------------------------
  {
    path: 'ecopuntos',
    loadComponent: () =>
      import('./pages/ecopuntos/ecopuntos.component').then(m => m.EcopuntosComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'usuarios-gestion',
    loadComponent: () =>
      import('./pages/usuarios-gestion/usuarios-gestion.component').then(m => m.UsuariosGestionComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'marketplace',
    loadComponent: () =>
      import('./pages/marketplace/marketplace.component').then(m => m.MarketplaceComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'configuracion',
    loadComponent: () =>
      import('./pages/configuracion/configuracion.component').then(m => m.ConfiguracionComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'cupones-gestion',
    loadComponent: () => import('./pages/cupones-gestion/cupones-gestion.component').then(m => m.CuponesGestionComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'tipos-residuo-gestion',
    loadComponent: () =>
      import('./pages/tipos-residuo-gestion/tipos-residuo-gestion.component').then(m => m.TiposResiduoGestionComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'reciclar',
    loadComponent: () =>
      import('./pages/reciclar/reciclar.component').then(m => m.ReciclarComponent),
    canActivate: [AuthGuard, AdminGuard]
  },

  // ---------------------------------
  // Ruta comodín
  // ---------------------------------
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
