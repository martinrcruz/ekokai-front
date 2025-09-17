import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QRWhatsappComponent } from './qr-whatsapp.component';

const routes: Routes = [
  {
    path: '',
    component: QRWhatsappComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QRWhatsappRoutingModule {}
