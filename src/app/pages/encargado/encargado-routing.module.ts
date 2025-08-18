// src/app/pages/encargado/encargado-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// IMPORTS de componentes del área Encargado
import { EncargadoHomeComponent } from './encargado-home/encargado-home.component';
import { MarketplaceComponent as EncargadoMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as EncargadoReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as EncargadoTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
import { VecinosComponent } from './vecinos/vecinos.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: EncargadoHomeComponent },
  { path: 'marketplace', component: EncargadoMarketplaceComponent },
  { path: 'reciclar', component: EncargadoReciclarComponent },
  { path: 'tiposresiduos', component: EncargadoTiposResiduosComponent },
  { path: 'vecinos', component: VecinosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncargadoRoutingModule {}
