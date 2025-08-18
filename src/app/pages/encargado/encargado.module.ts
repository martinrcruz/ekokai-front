// src/app/pages/encargado/encargado.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { EncargadoRoutingModule } from './encargado-routing.module';

// Declaraciones (componentes del área Encargado)
import { EncargadoHomeComponent } from './encargado-home/encargado-home.component';
import { MarketplaceComponent as EncargadoMarketplaceComponent } from './marketplace/marketplace.component';
import { ReciclarComponent as EncargadoReciclarComponent } from './reciclar/reciclar.component';
import { TiposResiduoGestionComponent as EncargadoTiposResiduosComponent } from './tipos-residuo-gestion/tipos-residuo-gestion.component';

@NgModule({
  declarations: [
    EncargadoHomeComponent,
    EncargadoMarketplaceComponent,
    EncargadoReciclarComponent,
    EncargadoTiposResiduosComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,        // baseChart (ng2-charts)
    EncargadoRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ayuda si algún ion-* no es reconocido
})
export class EncargadoModule {}
