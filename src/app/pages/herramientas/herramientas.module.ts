import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHerramientaComponent } from './form-herramienta/form-herramienta.component';
import { ListHerramientaComponent } from './list-herramienta/list-herramienta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HerramientasRoutingModule } from './herramientas-routing.module';



@NgModule({
  declarations: [FormHerramientaComponent, ListHerramientaComponent],
  imports: [
    CommonModule,
    IonicModule,
    HerramientasRoutingModule,
    ReactiveFormsModule
  ]
})
export class HerramientasModule { }
