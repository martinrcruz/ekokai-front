import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RutasRoutingModule } from './rutas-routing.module';
import { ListRutaComponent } from './list-ruta/list-ruta.component';
import { FormRutaComponent } from './form-ruta/form-ruta.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RutaDetalleComponent } from './ruta-detalle/ruta-detalle.component';

@NgModule({
  declarations: [ListRutaComponent, FormRutaComponent, RutaDetalleComponent],
  imports: [
    CommonModule,
    IonicModule,
    RutasRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ListRutaComponent, FormRutaComponent]
})
export class RutasModule { }
