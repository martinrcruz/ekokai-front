import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CanjeService } from 'src/app/services/canje.service';
import { TiposResiduoService } from 'src/app/services/tipos-residuo.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstadisticasUsuarioService, EstadisticasUsuario } from 'src/app/services/estadisticas-usuario.service';
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
  busquedaFallida = false;

  // Datos
  vecinos: any[] = [];
  vecinoSeleccionado: any = null;
  tiposResiduo: any[] = [];

  // Usuario logueado y estadísticas
  usuarioLogueado: any = null;
  estadisticasUsuario: EstadisticasUsuario = {
    kilosHoy: 0,
    metaDiaria: 0,
    porcentajeMeta: 0,
    kilosRestantes: 0
  };

  // Formularios
  formId!: FormGroup;
  formReciclaje!: FormGroup;

  now = new Date();

  // Signals útiles
  tokensEstimados = computed(() => {
    const peso = Number(this.formReciclaje?.value?.pesoKg || 0);
    return Math.max(0, Math.ceil(peso * 2)); // Multiplicador de 2 para mantener la lógica especificada
  });

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private canjeService: CanjeService,
    private tiposResiduoService: TiposResiduoService,
    private authService: AuthService,
    private estadisticasUsuarioService: EstadisticasUsuarioService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
    this.cargarTiposResiduo();
    this.inicializarFormularios();
  }

  private async cargarUsuarioLogueado() {
    try {
      await this.authService.ensureUserFromToken();
      this.usuarioLogueado = this.authService.getUser();
      if (this.usuarioLogueado) {
        this.cargarEstadisticasUsuario();
      }
    } catch (error) {
      console.error('Error cargando usuario logueado:', error);
    }
  }

  private async cargarEstadisticasUsuario() {
    try {
      this.estadisticasUsuarioService.getEstadisticasUsuarioHoy().subscribe({
        next: (estadisticas: EstadisticasUsuario) => {
          this.estadisticasUsuario = estadisticas;
          console.log('Estadísticas del usuario cargadas:', estadisticas);
        },
        error: (err: any) => {
          console.error('Error cargando estadísticas del usuario:', err);
          // Usar valores por defecto en caso de error
          this.estadisticasUsuario = {
            kilosHoy: 0,
            metaDiaria: 100, // Meta por defecto
            porcentajeMeta: 0,
            kilosRestantes: 100
          };
        }
      });
    } catch (error) {
      console.error('Error en cargarEstadisticasUsuario:', error);
    }
  }

  private async cargarTiposResiduo() {
    try {
      this.tiposResiduoService.getTiposResiduo().subscribe({
        next: (tipos: any[]) => {
          this.tiposResiduo = tipos.filter((t: any) => t.activo);
          console.log('Tipos de residuo cargados:', this.tiposResiduo);
        },
        error: (err: any) => {
          console.error('Error cargando tipos de residuo:', err);
          this.toast('Error cargando tipos de residuo', 'danger');
        }
      });
    } catch (error) {
      console.error('Error en cargarTiposResiduo:', error);
    }
  }

  private inicializarFormularios() {
    // Form identificación
    this.formId = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7)]],
      telefono: ['', [Validators.required, Validators.minLength(10)]],
      nombre: ['', [Validators.minLength(2)]]
    });

    // Form reciclaje
    this.formReciclaje = this.fb.group({
      tipoResiduo: ['', [Validators.required]],
      pesoKg: ['', [Validators.required, Validators.min(0.01)]],
      descripcion: ['']
    });

    // Bloquear campos hasta validar vecino
    this.bloquearDetalle(true);
  }

  // ---- LÓGICA DE NEGOCIO ----

  async buscarVecino(): Promise<void> {
    this.error = '';
    this.busquedaFallida = false;
    this.buscando = true;
    this.vecinoSeleccionado = null;

    try {
      const { dni, telefono, nombre } = this.formId.value;
      
      // Validar que al menos DNI o teléfono estén presentes
      if (!dni && !telefono) {
        this.error = 'Debe ingresar al menos DNI o teléfono';
        this.busquedaFallida = true;
        return;
      }

      // Buscar vecino en el backend
      const vecinos = await this.usuariosService.buscarVecinos({ dni, telefono, nombre }).toPromise();
      
      if (vecinos && vecinos.length > 0) {
        this.vecinoSeleccionado = vecinos[0]; // Tomar el primero si hay múltiples
        this.bloquearDetalle(false);
        this.toast(`Vecino encontrado: ${this.vecinoSeleccionado.nombre} ${this.vecinoSeleccionado.apellido}`, 'success');
      } else {
        this.busquedaFallida = true;
        this.bloquearDetalle(true);
        this.toast('No se encontró ningún vecino con esos datos', 'warning');
      }
    } catch (e: any) {
      console.error('Error buscando vecino:', e);
      this.error = 'Error en la búsqueda: ' + (e.error?.message || e.message || 'Error desconocido');
      this.busquedaFallida = true;
    } finally {
      this.buscando = false;
    }
  }

  async registrarVecinoExpress(): Promise<void> {
    this.error = '';
    
    try {
      const { dni, telefono, nombre } = this.formId.value;
      
      if (!dni || !telefono || !nombre) {
        this.toast('Complete todos los campos para el registro express', 'warning');
        return;
      }

      // Separar nombre y apellido
      const nombres = nombre.trim().split(' ');
      const primerNombre = nombres[0];
      const apellido = nombres.slice(1).join(' ') || primerNombre;

      const datosVecino = {
        nombre: primerNombre,
        apellido: apellido,
        dni: dni.toString(),
        telefono: telefono.toString(),
        email: `${dni}@express.ekokai.com`, // Email temporal
        ecopuntoId: null // Se asignará desde el backend según el rol del usuario
      };

      const nuevoVecino = await this.usuariosService.registrarVecino(datosVecino).toPromise();
      
      this.vecinoSeleccionado = nuevoVecino;
      this.bloquearDetalle(false);
      this.toast(`Vecino registrado exitosamente: ${nuevoVecino.nombre} ${nuevoVecino.apellido}`, 'success');
      
    } catch (e: any) {
      console.error('Error registrando vecino:', e);
      this.error = 'Error en el registro: ' + (e.error?.message || e.message || 'Error desconocido');
      this.toast('Error al registrar vecino', 'danger');
    }
  }

  bloquearDetalle(bloq: boolean) {
    if (bloq) {
      this.formReciclaje.disable({ emitEvent: false });
    } else {
      this.formReciclaje.enable({ emitEvent: false });
    }
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

  async generarCanje() {
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
    const { tipoResiduo, pesoKg, descripcion } = this.formReciclaje.value;
    
    // Obtener el ecopunto del usuario autenticado (asumiendo que es el ecopunto actual)
    const ecopuntoId = this.vecinoSeleccionado.ecopuntoId || 'default-ecopunto-id';

    const payload = {
      usuarioId: this.vecinoSeleccionado._id,
      ecopuntoId: ecopuntoId,
      tipoResiduoId: tipoResiduo,
      pesoKg: Number(pesoKg),
      descripcion: (descripcion || '').trim()
    };

    try {
      const resultado = await this.canjeService.registrarCanje(payload).toPromise();
      
      this.toast(`Reciclaje registrado: ${resultado.cuponesGenerados} cupones generados`, 'success');
      
      // Reset del formulario
      this.formReciclaje.reset();
      this.formId.reset();
      this.vecinoSeleccionado = null;
      this.bloquearDetalle(true);
      this.now = new Date();
      
      // Recargar estadísticas del usuario después de registrar reciclaje
      this.cargarEstadisticasUsuario();
      
    } catch (e: any) {
      console.error('Error al registrar reciclaje:', e);
      this.toast('Error al registrar el reciclaje: ' + (e.error?.message || 'Error desconocido'), 'danger');
    } finally {
      this.canjeando = false;
    }
  }

  // ---- Utilidades ----
  private async toast(message: string, color: 'success'|'danger'|'warning'|'medium'|'primary' = 'success') {
    const t = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await t.present();
  }

  limpiarBusqueda() {
    this.formId.reset();
    this.vecinoSeleccionado = null;
    this.busquedaFallida = false;
    this.error = '';
    this.bloquearDetalle(true);
  }

  // Obtener nombre completo del usuario logueado
  getNombreUsuarioLogueado(): string {
    if (!this.usuarioLogueado) return 'Usuario';
    const nombre = this.usuarioLogueado.nombre || '';
    const apellido = this.usuarioLogueado.apellido || '';
    return `${nombre} ${apellido}`.trim() || this.usuarioLogueado.email || 'Usuario';
  }
}