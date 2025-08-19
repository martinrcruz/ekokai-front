// src/app/pages/administrador/administrador.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AdministradorRoutingModule } from './administrador-routing.module';

// Declaraciones (componentes del área Administrador)
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { CuponesGestionComponent } from './cupones-gestion/cupones-gestion.component';
import { EcopuntosComponent } from './ecopuntos/ecopuntos.component';
import { MarketplaceComponent as AdminMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as AdminReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as AdminTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosGestionComponent } from './usuarios-gestion/usuarios-gestion.component';
import { HomeAdminModule } from './home-admin/home-admin.module';

@NgModule({
  declarations: [

    ConfiguracionComponent,
    CuponesGestionComponent,
    EcopuntosComponent,
    AdminMarketplaceComponent,
    AdminTiposResiduosComponent,
   // UsuariosComponent,
    UsuariosGestionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    AdministradorRoutingModule,
    HomeAdminModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdministradorModule {}
