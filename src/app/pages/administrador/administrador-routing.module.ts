// src/app/pages/administrador/administrador-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';

// IMPORTS de componentes del área Administrador
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import{CuponesGestionComponent as CuponesComponent} from './cupones-gestion/cupones-gestion.component';
import { EcopuntosComponent } from './ecopuntos/ecopuntos.component';
import { MarketplaceComponent as AdminMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as AdminReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as AdminTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosGestionComponent } from './usuarios-gestion/usuarios-gestion.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full'
    // Removido canActivate: [AdminGuard] - ya se aplica en el routing principal
  },

  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'configuracion', 
    component: ConfiguracionComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'cupones', 
    component: CuponesComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'ecopuntos', 
    component: EcopuntosComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'marketplace', 
    component: AdminMarketplaceComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'reciclar', 
    component: AdminReciclarComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'tiposresiduos', 
    component: AdminTiposResiduosComponent,
    canActivate: [AdminGuard]
  },
  //{ path: 'usuarios', component: UsuariosComponent },
  { 
    path: 'usuarios-gestion', 
    component: UsuariosGestionComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios', 
    loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule {}
