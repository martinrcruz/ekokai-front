import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListUsuarioComponent } from './list-usuario/list-usuario.component';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioDetalleComponent } from './usuario-detalle/usuario-detalle.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListUsuarioComponent,
    FormUsuarioComponent,
    UsuarioDetalleComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class UsuariosModule { }
