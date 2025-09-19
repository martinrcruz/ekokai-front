// src/app/pages/administrador/administrador.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Declaraciones (componentes del área Administrador)
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { PremiosGestionComponent } from './premios-gestion/premios-gestion.component';
import { HistorialReciclajeComponent } from './historial-reciclaje/historial-reciclaje.component';
import { HistorialCanjesComponent } from './historial-canjes/historial-canjes.component';
import { CuponesActivosComponent } from './cupones-activos/cupones-activos.component';
import { ReciclajesFotosComponent } from './reciclajes-fotos/reciclajes-fotos.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { TrazabilidadReciclajeComponent } from './trazabilidad-reciclaje/trazabilidad-reciclaje.component';
import { EcopuntosComponent } from './ecopuntos/ecopuntos.component';
import { MarketplaceComponent as AdminMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as AdminReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as AdminTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';
//import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosGestionComponent } from './usuarios-gestion/usuarios-gestion.component';
import { UsuariosVecinosComponent } from './usuarios-vecinos/usuarios-vecinos.component';
import { UsuariosStaffComponent } from './usuarios-staff/usuarios-staff.component';
import { UsuariosModule } from './usuarios/usuarios.module';
import { HomeAdminModule } from './home-admin/home-admin.module';
import { AdminGuard } from '../../guards/admin.guard';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    PremiosGestionComponent,
    HistorialReciclajeComponent,
    HistorialCanjesComponent,
    CuponesActivosComponent,
    ReciclajesFotosComponent,
    TrazabilidadComponent,
    TrazabilidadReciclajeComponent,
    EcopuntosComponent,
    AdminMarketplaceComponent,
    AdminTiposResiduosComponent,
   // UsuariosComponent,
    UsuariosGestionComponent,
    UsuariosVecinosComponent,
    UsuariosStaffComponent
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
