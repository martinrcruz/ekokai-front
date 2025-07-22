import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CanjeService } from 'src/app/services/canje.service';

@Component({
  selector: 'app-reciclar',
  templateUrl: './reciclar.component.html',
  styleUrls: ['./reciclar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ReciclarComponent implements OnInit {
  vecinos: any[] = [];
  vecinoSeleccionado: any = null;
  peso: number | null = null;
  conectando = false;
  canjeando = false;
  error: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private canjeService: CanjeService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe(vecinos => {
      this.vecinos = vecinos.filter(v => v.rol === 'vecino');
    });
  }

  async conectarBalanza() {
    this.error = '';
    this.peso = null;
    this.conectando = true;

    try {
      const scan = await navigator.bluetooth.requestLEScan({
        acceptAllAdvertisements: true,
        keepRepeatedDevices: true
      });
      console.log('🔍 Escaneando… súbete a la balanza 😊');

      navigator.bluetooth.addEventListener('advertisementreceived', event => {
        const md = event.manufacturerData.get(0x0157);
        if (!md) return;

        const bytes = new Uint8Array(md.buffer);
        const flags = bytes[10];
        const stable = (flags & 0x20) !== 0;
        const raw = bytes[11] | (bytes[12] << 8);
        const weightKg = raw / 200;

        if (stable) {
          this.peso = parseFloat(weightKg.toFixed(2));
          scan.stop();
          this.conectando = false;
        }
      });

      // Timeout como fallback
      setTimeout(() => {
        if (this.conectando) {
          scan.stop();
          this.conectando = false;
          this.error = 'No se detectó peso. ¿Estás en la báscula?';
        }
      }, 20000);

    } catch (err) {
      console.error(err);
      this.error = 'Error de Bluetooth: ' + err;
      this.conectando = false;
    }
  }

  decodeWeight(dataView: DataView): number {
    // Decodificación básica para balanza Xiaomi (puede requerir ajuste según protocolo exacto)
    // Peso en kg, 2 bytes a partir del byte 1 (little endian)
    // Referencia: Bluetooth SIG Weight Scale
    if (dataView.byteLength < 3) return 0;
    const weightKg = dataView.getUint16(1, true) / 200;
    return Math.round(weightKg * 100) / 100;
  }

  generarCanje() {
    if (!this.vecinoSeleccionado || !this.peso) {
      this.showToast('Seleccione un vecino y obtenga el peso.');
      return;
    }
    this.canjeando = true;
    // Aquí se asume 1kg = 10 tokens (ajustar según lógica real)
    const tokens = Math.round(this.peso * 10);
    const canje = {
      usuario: this.vecinoSeleccionado._id,
      tokens,
      peso: this.peso
    };
    this.canjeService.registrarCanje(canje).subscribe({
      next: () => {
        this.showToast('Canje registrado correctamente');
        this.peso = null;
        this.vecinoSeleccionado = null;
        this.canjeando = false;
      },
      error: (err) => {
        this.showToast('Error al registrar el canje');
        this.canjeando = false;
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }
} 