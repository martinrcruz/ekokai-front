import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialesRoutingModule } from './materiales-routing.module';
import { ListMaterialComponent } from './list-material/list-material.component';
import { FormMaterialComponent } from './form-material/form-material.component';



@NgModule({
  declarations: [ListMaterialComponent, FormMaterialComponent],
  imports: [
    CommonModule,
    IonicModule,
    MaterialesRoutingModule,
    ReactiveFormsModule
  ]
})
export class MaterialesModule { }
