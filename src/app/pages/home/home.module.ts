import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule,
    NgChartsModule,
    FormsModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
