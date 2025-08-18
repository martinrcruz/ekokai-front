import { NgModule } from '@angular/core';
import { ReciclarComponent } from './reciclar.component';
import { ReciclarRoutingModule } from './reciclar-routing.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [ ReciclarRoutingModule, CommonModule, IonicModule, FormsModule],
})
export class ReciclarModule {}
