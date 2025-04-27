import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerDashboardComponent } from './worker-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: WorkerDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerDashboardRoutingModule { } 