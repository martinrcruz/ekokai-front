import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HerramientasRoutingModule } from './herramientas-routing.module';
import { ListHerramientaComponent } from './list-herramienta/list-herramienta.component';
import { FormHerramientaComponent } from './form-herramienta/form-herramienta.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListHerramientaComponent, FormHerramientaComponent],
  imports: [
    CommonModule,
    IonicModule,
    HerramientasRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ListHerramientaComponent, FormHerramientaComponent]
})
export class HerramientasModule { }
