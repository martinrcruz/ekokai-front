import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ConfiguracionComponent implements OnInit {
  configuracion = {
    general: {
      nombreEmpresa: 'Ekokai',
      emailContacto: 'contacto@ekokai.com',
      telefono: '+34 123 456 789',
      direccion: 'Calle Principal 123, Madrid'
    },
    tokens: {
      tokensPorKilo: 10,
      tokensMinimosRetiro: 100,
      maxTokensPorDia: 500
    },
    notificaciones: {
      emailActivo: true,
      pushActivo: true,
      recordatorios: true,
      reportes: false
    },
    seguridad: {
      sesionTimeout: 30,
      intentosMaximos: 3,
      passwordMinLength: 8,
      requiereMayusculas: true,
      requiereNumeros: true
    },
    ecopuntos: {
      radioMaximo: 5,
      horarioApertura: '08:00',
      horarioCierre: '20:00',
      maxUsuariosPorEcopunto: 100
    }
  };

  constructor() {}

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    // Aquí se cargaría la configuración desde el backend
    console.log('[Configuración] Cargando configuración del sistema');
  }

  guardarConfiguracion() {
    console.log('[Configuración] Guardando configuración:', this.configuracion);
    // Aquí se enviaría la configuración al backend
  }

  resetearConfiguracion() {
    console.log('[Configuración] Reseteando configuración');
    // Aquí se resetearía la configuración
  }

  exportarConfiguracion() {
    console.log('[Configuración] Exportando configuración');
    // Aquí se exportaría la configuración
  }

  importarConfiguracion() {
    console.log('[Configuración] Importando configuración');
    // Aquí se importaría la configuración
  }

  generarBackup() {
    console.log('[Configuración] Generando backup');
    // Aquí se generaría un backup
  }

  restaurarBackup() {
    console.log('[Configuración] Restaurando backup');
    // Aquí se restauraría un backup
  }
} 