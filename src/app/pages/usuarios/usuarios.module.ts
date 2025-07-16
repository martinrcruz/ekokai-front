import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

@NgModule({
  declarations: [
    FormUsuarioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
