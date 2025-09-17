import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { QRWhatsappComponent } from './qr-whatsapp.component';
import { QRWhatsappModalComponent } from './qr-whatsapp-modal/qr-whatsapp-modal.component';
import { QRWhatsappRoutingModule } from './qr-whatsapp-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRWhatsappRoutingModule
  ],
  declarations: [
    QRWhatsappComponent,
    QRWhatsappModalComponent
  ]
})
export class QRWhatsappModule {}
