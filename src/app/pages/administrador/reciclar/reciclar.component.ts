import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CanjeService } from 'src/app/services/canje.service';
/// <reference types="web-bluetooth" />


@Component({
  selector: 'app-reciclar',
  templateUrl: './reciclar.component.html',
  styleUrls: ['./reciclar.component.scss'],
   standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class ReciclarComponent implements OnInit {
   
  // UI / estado
  buscando = false;
  conectando = false;
  canjeando = false;
  error = '';

  // Datos
  vecinos: any[] = [];
  vecinoSeleccionado: any = null;

  // Formularios
  formId!: FormGroup;
  formReciclaje!: FormGroup;

  now = new Date();

  tiposResiduo = [
    { value: 'papel_carton', label: 'Papel / Cartón' },
    { value: 'plastico',     label: 'Plástico' },
    { value: 'vidrio',       label: 'Vidrio' },
    { value: 'metal',        label: 'Metal' },
    { value: 'organico',     label: 'Orgánico' },
    { value: 'raee',         label: 'RAEE (electrónicos)' },
    { value: 'otros',        label: 'Otros' },
  ];

  // Signals útiles
  tokensEstimados = computed(() => {
    const peso = Number(this.formReciclaje?.value?.pesoKg || 0);
    return Math.max(0, Math.round(peso));
  });

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private canjeService: CanjeService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    // Cargar vecinos (fallback para filtro local si no hay endpoint de búsqueda)
    this.usuariosService.getUsuarios().subscribe(vecinos => {
      this.vecinos = (vecinos || []).filter((v: any) => v.rol === 'vecino');
    });

    // Form identificación
    this.formId = this.fb.group({
      vecino: ['', [Validators.required]],
    });

    // Form reciclaje
    this.formReciclaje = this.fb.group({
      tipoResiduo:   [{value: '', disabled: false}, [Validators.required]],
      pesoKg:        [{value: '', disabled: false}, [Validators.required, Validators.min(0.01)]],
    });

    // Bloquear campos hasta validar vecino (sin deshabilitar para mantener estilo; validación se hace al guardar)
    this.bloquearDetalle(true);
  }

  // ---- LÓGICA DE NEGOCIO ----

  async buscarVecino(): Promise<void> {
    this.error = '';
    this.busquedaFallida = false;
    this.buscando = true;
    this.vecinoSeleccionado = null;
    try {
      const { telefono, dni } = this.formId.value;
      const vecino = this.vecinos.find(v =>
        (v.telefono?.toString().includes(telefono?.toString())) &&
        (v.dni?.toString().replace(/\D/g, '') === dni?.toString().replace(/\D/g, ''))
      );

      if (vecino) {
        this.vecinoSeleccionado = vecino;
        this.bloquearDetalle(false);
        if (!this.formReciclaje.value.codigoCupon) {
          this.generarCupon(); // sugerir cupon al validar
        }
        this.toast('Vecino validado');
      } else {
        this.busquedaFallida = true;
        this.bloquearDetalle(true);
      }
    } catch (e: any) {
      this.error = 'Error buscando vecino';
      this.busquedaFallida = true;
    } finally {
      this.buscando = false;
    }
  }
  busquedaFallida = false;

  bloquearDetalle(bloq: boolean) {
    if (bloq) {
      this.formReciclaje.disable({ emitEvent: false });
    } else {
      this.formReciclaje.enable({ emitEvent: false });
    }
  }

  generarCupon() {
    const code = this.generarCodigoCupon();
    this.formReciclaje.patchValue({ codigoCupon: code });
  }

  private generarCodigoCupon(): string {
    // Código legible: 4+4+4 base36 timestamp + aleatorio
    const t = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).substring(2, 10).toUpperCase();
    // Ej: CPN-<T4>-<R4>-<R4>
    return `CPN-${t.slice(-4)}-${r.slice(0,4)}-${r.slice(4,8)}`;
  }

  async conectarBalanza() {
    this.error = '';
    this.conectando = true;

    try {
      // 0x181D = "weight_scale" | 0x2A9D = "weight_measurement"
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['weight_scale'] }],
        optionalServices: ['weight_scale']
      });

      device.addEventListener('gattserverdisconnected', () => {
        this.conectando = false;
        this.toast('Balanza desconectada', 'medium');
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('No se pudo conectar al GATT');

      const service = await server.getPrimaryService('weight_scale');
      const characteristic = await service.getCharacteristic('weight_measurement');

      await characteristic.startNotifications();

      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (!value) return;

        // Decodificación estándar
        const flags = value.getUint8(0);
        const isKg = (flags & 0x01) === 0;
        const weightRaw = value.getUint16(1, true);

        const weight = isKg ? weightRaw * 0.005 : weightRaw * 0.01;
        const kg = Math.round(weight * 100) / 100;

        this.formReciclaje.patchValue({ pesoKg: kg });
        this.conectando = false;
      });

      this.toast('Conectado a la balanza', 'success');

    } catch (err: any) {
      this.error = 'Error de Bluetooth: ' + (err?.message ?? err);
      this.conectando = false;
    }
  }

  generarCanje() {
    if (!this.vecinoSeleccionado) {
      this.toast('Primero valida al vecino', 'warning');
      return;
    }
    if (this.formReciclaje.invalid) {
      this.formReciclaje.markAllAsTouched();
      this.toast('Completa los campos requeridos', 'warning');
      return;
    }

    this.canjeando = true;
    const fecha = new Date().toISOString(); // Fecha auto
    const { tipoResiduo, volumenLitros, descripcion, codigoCupon, pesoKg } = this.formReciclaje.value;
    const tokens = Math.round(Number(pesoKg) * 10);

    const payload = {
      usuario: this.vecinoSeleccionado._id,
      tipoResiduo,
      volumenLitros,
      descripcion: (descripcion || '').trim(),
      codigoCupon,
      pesoKg: Number(pesoKg),
      tokens,
      fecha // se puede calcular en backend también
    };

    this.canjeService.registrarCanje(payload).subscribe({
      next: () => {
        this.toast('Reciclaje registrado correctamente');
        // Reset "limpio" pero manteniendo foco de UX
        this.formReciclaje.reset({ tipoResiduo: '', volumenLitros: 50, descripcion: '', codigoCupon: '', pesoKg: '' });
        this.formId.reset();
        this.vecinoSeleccionado = null;
        this.bloquearDetalle(true);
        this.canjeando = false;
        this.now = new Date();
      },
      error: (e) => {
        this.toast('Error al registrar el reciclaje', 'danger');
        this.canjeando = false;
      }
    });
  }

  // ---- Utilidades ----
  private async toast(message: string, color: 'success'|'danger'|'warning'|'medium'|'primary' = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await t.present();
  }

}