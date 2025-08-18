// src/app/pages/administrador/administrador-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'cupones', component: CuponesComponent },
  { path: 'ecopuntos', component: EcopuntosComponent },
  { path: 'marketplace', component: AdminMarketplaceComponent },
  { path: 'reciclar', component: AdminReciclarComponent },
  { path: 'tiposresiduos', component: AdminTiposResiduosComponent },
  //{ path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios-gestion', component: UsuariosGestionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule {}
