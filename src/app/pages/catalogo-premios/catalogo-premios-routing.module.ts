import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoPremiosComponent } from './catalogo-premios.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogoPremiosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoPremiosRoutingModule {}


