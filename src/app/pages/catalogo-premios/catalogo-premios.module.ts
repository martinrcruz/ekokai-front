import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogoPremiosComponent } from './catalogo-premios.component';
import { CatalogoPremiosRoutingModule } from './catalogo-premios-routing.module';

@NgModule({
  declarations: [
    CatalogoPremiosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogoPremiosRoutingModule
  ]
})
export class CatalogoPremiosModule {}

