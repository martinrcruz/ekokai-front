// src/app/pages/administrador/administrador.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Declaraciones (componentes del área Administrador)E
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PremiosGestionComponent } from './premios-gestion/premios-gestion.component';
import { HistorialReciclajeComponent } from './historial-reciclaje/historial-reciclaje.component';
import { EcopuntosComponent } from './ecopuntos/ecopuntos.component';
import { MarketplaceComponent as AdminMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as AdminReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as AdminTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosGestionComponent } from './usuarios-gestion/usuarios-gestion.component';
import { UsuariosModule } from './usuarios/usuarios.module';
import { HomeAdminModule } from './home-admin/home-admin.module';
import { AdminGuard } from '../../guards/admin.guard';

@NgModule({
  declarations: [

    ConfiguracionComponent,
    PremiosGestionComponent,
    HistorialReciclajeComponent,
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
    UsuariosModule,
    HomeAdminModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AdminGuard]
})
export class AdministradorModule {}
