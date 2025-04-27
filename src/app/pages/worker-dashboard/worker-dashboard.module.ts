import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WorkerDashboardRoutingModule } from './worker-dashboard-routing.module';
import { WorkerDashboardComponent } from './worker-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WorkerDashboardComponent],
  imports: [
    CommonModule,
    IonicModule,
    WorkerDashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [WorkerDashboardComponent]
})
export class WorkerDashboardModule { } 