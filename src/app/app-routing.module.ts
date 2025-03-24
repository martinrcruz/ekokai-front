import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
  {
    path: 'partes',
    loadChildren: () =>
      import('./pages/partes/partes.module').then(m => m.PartesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rutas',
    loadChildren: () =>
      import('./pages/rutas/rutas.module').then(m => m.RutasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturacion',
    loadChildren: () =>
      import('./pages/facturacion/facturacion.module').then(m => m.FacturacionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'calendario',
    loadChildren: () =>
      import('./pages/calendario/calendario.module').then(m => m.CalendarioModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./pages/clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },

  // ---------------------------------
  // Módulos nuevos
  // ---------------------------------
  {
    path: 'contratos',
    loadChildren: () =>
      import('./pages/contratos/contrato.module').then(m => m.ContratoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'materiales',
    loadChildren: () =>
      import('./pages/materiales/materiales.module').then(m => m.MaterialesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos',
    loadChildren: () =>
      import('./pages/vehiculos/vehiculos.module').then(m => m.VehiculosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'herramientas',
    loadChildren: () =>
      import('./pages/herramientas/herramientas.module').then(m => m.HerramientasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'zonas',
    loadChildren: () =>
      import('./pages/zonas/zonas.module').then(m => m.ZonasModule),
    canActivate: [AuthGuard]
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
