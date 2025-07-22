import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReciclarComponent } from './reciclar.component';

const routes: Routes = [
  { path: '', component: ReciclarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReciclarRoutingModule {} 