import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ZonasRoutingModule } from './zonas-routing.module';
import { ListZonaComponent } from './list-zona/list-zona.component';
import { FormZonaComponent } from './form-zona/form-zona.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListZonaComponent, FormZonaComponent],
  imports: [
    CommonModule,
    IonicModule,
    ZonasRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class ZonasModule { }
