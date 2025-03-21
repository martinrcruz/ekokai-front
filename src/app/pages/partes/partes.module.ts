import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PartesRoutingModule } from './partes-routing.module';
import { ListParteComponent } from './list-parte/list-parte.component';
import { FormParteComponent } from './form-parte/form-parte.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PartesTabsComponent } from './partes-tabs/partes-tabs.component';

@NgModule({
  declarations: [ListParteComponent, FormParteComponent, PartesTabsComponent],
  imports: [
    CommonModule,
    IonicModule,
    PartesRoutingModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class PartesModule { }
