import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { VecinosComponent } from './vecinos.component';

const routes: Routes = [
  { path: '', component: VecinosComponent }
];

@NgModule({
  declarations: [VecinosComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class VecinosModule {} 