import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArticulosRoutingModule } from './articulos-routing.module';
import { ListArticuloComponent } from './list-articulo/list-articulo.component';
import { FormArticuloComponent } from './form-articulo/form-articulo.component';

@NgModule({
  declarations: [ListArticuloComponent, FormArticuloComponent],
  imports: [
    CommonModule,
    IonicModule,
    ArticulosRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ArticulosModule { } 