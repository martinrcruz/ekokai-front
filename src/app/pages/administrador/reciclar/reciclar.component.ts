import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CanjeService } from 'src/app/services/canje.service';
/// <reference types="web-bluetooth" />


@Component({
  selector: 'app-reciclar',
  templateUrl: './reciclar.component.html',
  styleUrls: ['./reciclar.component.scss'],
  standalone: false
})
export class ReciclarComponent implements OnInit {
  vecinos: any[] = [];
  vecinoSeleccionado: any = null;
  peso: number | null = null;
  conectando = false;
  canjeando = false;
  error: string = '';

  private readonly MI_UUID = 0xFE95;   // Para el filtro
  private readonly XIAOMI_ID = 0x0153;   // Manufacturer Data
  private readonly TIMEOUT_MS = 30_000;   // corta tras 30 s  private dev?: BluetoothDevice;
  private dev?: BluetoothDevice;
  private dispositivo?: BluetoothDevice;

  constructor(
    private usuariosService: UsuariosService,
    private canjeService: CanjeService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe(vecinos => {
      this.vecinos = vecinos.filter(v => v.rol === 'vecino');
    });
    
  }
  async startBleScan() {
    console.log("Entra")
    this.dispositivo = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Xiaomi Scale' }],
    });
    
    /* 2. Listener: escucha todo y filtra dentro  */
    const onAdv = (ev: BluetoothAdvertisingEvent) => {
      const md = ev.manufacturerData.get(this.XIAOMI_ID);      // 0x0153
      if (!md) return;                                         // paquete que no es peso

      const flags = md.getUint8(0);
      if ((flags & 0x80) || md.byteLength < 13) return;        // usuario se bajó

      const raw = md.getUint16(11, true);                   // bytes 11‑12
      const weight = +(raw / 200).toFixed(2);
      this.peso = weight;
      console.log('⚖️', weight, 'kg');
    };

    this.dispositivo.addEventListener('advertisementreceived', onAdv);

    await this.dispositivo.watchAdvertisements({
      acceptAllAdvertisements: true,     // ← deja pasar manufacturerData
      keepRepeatedDevices: true,
    });
  }


  private async show(msg: string) {
    (await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom' })).present();
  }


  logDataView(labelOfDataSource: string, key: string, valueDataView: DataView) {
    const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
      return b.toString(16).padStart(2, '0');
    }).join(' ');
    const textDecoder = new TextDecoder('ascii');
    const asciiString = textDecoder.decode(valueDataView.buffer);
    console.log(`  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);
  };


  async conectarBalanza() {
    this.error = '';
    this.peso = null;
    this.conectando = true;

    try {
      console.log('🔍 1.- Escaneando… súbete a la balanza 😊');
      console.log('🔍 navigator:', navigator);
      console.log(navigator);
      const scan = await navigator.bluetooth.requestLEScan({
        acceptAllAdvertisements: true,
        keepRepeatedDevices: true
      });
      console.log('🔍 scan:', scan);
      console.log('🔍 navigator:', navigator);
      console.log('🔍 2.- Escaneando… súbete a la balanza 😊');

      navigator.bluetooth.addEventListener('advertisementreceived', event => {
        console.log('escuchando');
        console.log('event', event);
        console.log('Advertisement received.');
        console.log('Device Name: ' + event.device.name);
        console.log('Device ID: ' + event.device.id);
        console.log('RSSI: ' + event.rssi);
        console.log('TX Power: ' + event.txPower);
        console.log('UUIDs: ' + event.uuids);
        event.manufacturerData.forEach((valueDataView, key) => {
          console.log('Manufacturer', key, valueDataView);
        });
        event.serviceData.forEach((valueDataView, key) => {
          console.log('Service', key, valueDataView);
        });
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
