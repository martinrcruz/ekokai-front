import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ZonasRoutingModule } from './zonas-routing.module';
import { ListZonaComponent } from './list-zona/list-zona.component';
import { FormZonaComponent } from './form-zona/form-zona.component';



@NgModule({
  declarations: [ListZonaComponent, FormZonaComponent],
  imports: [
    CommonModule,
    IonicModule,
    ZonasRoutingModule,
    ReactiveFormsModule
  ]
})
export class ZonasModule { }
