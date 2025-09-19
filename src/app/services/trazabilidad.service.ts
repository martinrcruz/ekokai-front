import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

export interface TrazabilidadEvento {
  _id: string;
  phoneNumber: string;
  userId: string;
  step: string;
  timestamp: Date;
  qr_code?: string;
  canjeReciclajeId?: string;
  coupon_id?: string;
  exchange_id?: string;
  image_path?: string;
  validation_result?: any;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  metadata?: any;
  error_info?: any;
}

export interface TrazabilidadEstadisticas {
  resumen: {
    totalEventos: number;
    usuariosUnicos: number;
    qrsUnicos: number;
    telefonosUnicos: number;
  };
  porStep: any[];
  porDia: any[];
  periodo: {
    fechaInicio: Date;
    fechaFin: Date;
  };
}

@Injectable({ providedIn: 'root' })
export class TrazabilidadService extends BaseService {
  private readonly endpoint = '/trazabilidad';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  // Registrar evento de trazabilidad
  registrarEvento(evento: Partial<TrazabilidadEvento>): Observable<TrazabilidadEvento> {
    console.log('[TrazabilidadService] Registrando evento:', evento);
    return this.post<TrazabilidadEvento>(`${this.endpoint}/registro`, evento).pipe(
      tap(eventoRegistrado => console.log('[TrazabilidadService] Evento registrado:', eventoRegistrado)),
      catchError(error => {
        console.error('[TrazabilidadService] Error al registrar evento:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener trazabilidad de un usuario
  obtenerTrazabilidadUsuario(userId: string, limite: number = 50, step?: string): Observable<{
    usuario: any;
    eventos: TrazabilidadEvento[];
    estadisticas: any[];
  }> {
    console.log('[TrazabilidadService] Obteniendo trazabilidad para usuario:', userId);
    const params = new URLSearchParams();
    params.append('limite', limite.toString());
    if (step) params.append('step', step);
    
    return this.get<{
      usuario: any;
      eventos: TrazabilidadEvento[];
      estadisticas: any[];
    }>(`${this.endpoint}/usuario/${userId}?${params.toString()}`).pipe(
      tap(data => console.log('[TrazabilidadService] Trazabilidad de usuario obtenida:', data.eventos?.length || 0, 'eventos')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener trazabilidad de usuario:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener trazabilidad por teléfono
  obtenerTrazabilidadPorTelefono(phoneNumber: string, limite: number = 50, step?: string): Observable<{
    phoneNumber: string;
    eventos: TrazabilidadEvento[];
    totalEventos: number;
  }> {
    console.log('[TrazabilidadService] Obteniendo trazabilidad por teléfono:', phoneNumber);
    const params = new URLSearchParams();
    params.append('limite', limite.toString());
    if (step) params.append('step', step);
    
    return this.get<{
      phoneNumber: string;
      eventos: TrazabilidadEvento[];
      totalEventos: number;
    }>(`${this.endpoint}/phone/${phoneNumber}?${params.toString()}`).pipe(
      tap(data => console.log('[TrazabilidadService] Trazabilidad por teléfono obtenida:', data.totalEventos, 'eventos')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener trazabilidad por teléfono:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener trazabilidad de un código QR
  obtenerTrazabilidadPorQR(qrCode: string): Observable<{
    qrCode: string;
    eventos: TrazabilidadEvento[];
    estadisticas: any[];
    totalEventos: number;
  }> {
    console.log('[TrazabilidadService] Obteniendo trazabilidad por QR:', qrCode);
    return this.get<{
      qrCode: string;
      eventos: TrazabilidadEvento[];
      estadisticas: any[];
      totalEventos: number;
    }>(`${this.endpoint}/qr/${qrCode}`).pipe(
      tap(data => console.log('[TrazabilidadService] Trazabilidad por QR obtenida:', data.totalEventos, 'eventos')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener trazabilidad por QR:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener trazabilidad de un canje específico
  obtenerTrazabilidadCanje(canjeId: string): Observable<{
    canje: any;
    eventos: TrazabilidadEvento[];
    totalEventos: number;
  }> {
    console.log('[TrazabilidadService] Obteniendo trazabilidad de canje:', canjeId);
    return this.get<{
      canje: any;
      eventos: TrazabilidadEvento[];
      totalEventos: number;
    }>(`${this.endpoint}/canje/${canjeId}`).pipe(
      tap(data => console.log('[TrazabilidadService] Trazabilidad de canje obtenida:', data.totalEventos, 'eventos')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener trazabilidad de canje:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener estadísticas generales de trazabilidad
  obtenerEstadisticas(fechaInicio?: Date, fechaFin?: Date): Observable<TrazabilidadEstadisticas> {
    console.log('[TrazabilidadService] Obteniendo estadísticas de trazabilidad');
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params.append('fechaFin', fechaFin.toISOString());
    
    return this.get<TrazabilidadEstadisticas>(`${this.endpoint}/estadisticas?${params.toString()}`).pipe(
      tap(estadisticas => console.log('[TrazabilidadService] Estadísticas obtenidas:', estadisticas.resumen.totalEventos, 'eventos totales')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener estadísticas:', error);
        return throwError(() => error);
      })
    );
  }

  // Listar eventos con filtros
  listarEventos(filtros: {
    step?: string;
    phoneNumber?: string;
    userId?: string;
    qr_code?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    limite?: number;
    pagina?: number;
  } = {}): Observable<{
    data: TrazabilidadEvento[];
    pagination: {
      total: number;
      pagina: number;
      limite: number;
      totalPaginas: number;
    };
  }> {
    console.log('[TrazabilidadService] Listando eventos con filtros:', filtros);
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key as keyof typeof filtros];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return this.get<{
      data: TrazabilidadEvento[];
      pagination: {
        total: number;
        pagina: number;
        limite: number;
        totalPaginas: number;
      };
    }>(`${this.endpoint}/eventos?${params.toString()}`).pipe(
      tap(response => console.log('[TrazabilidadService] Eventos listados:', response.data?.length || 0, 'eventos')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al listar eventos:', error);
        return throwError(() => error);
      })
    );
  }

  // Limpiar eventos antiguos (solo administradores)
  limpiarEventosAntiguos(diasAntiguedad: number = 90): Observable<{
    eventosEliminados: number;
    fechaLimite: Date;
  }> {
    console.log('[TrazabilidadService] Limpiando eventos antiguos:', diasAntiguedad, 'días');
    return this.delete<{
      eventosEliminados: number;
      fechaLimite: Date;
    }>(`${this.endpoint}/limpiar?diasAntiguedad=${diasAntiguedad}`).pipe(
      tap(resultado => console.log('[TrazabilidadService] Eventos limpiados:', resultado.eventosEliminados, 'eventos eliminados')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al limpiar eventos:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener sesiones de reciclaje con trazabilidad completa
  obtenerSesionesReciclaje(filtros: {
    phoneNumber?: string;
    userId?: string;
    qrCode?: string;
    estado?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    limite?: number;
    pagina?: number;
  } = {}): Observable<{
    data: any[];
    estadisticas: {
      totalSesiones: number;
      sesionesExitosas: number;
      sesionesFallidas: number;
      sesionesIniciadas: number;
      usuariosUnicos: number;
      telefonosUnicos: number;
      tasaExito: number;
    };
    pagination: {
      total: number;
      pagina: number;
      limite: number;
      totalPaginas: number;
    };
  }> {
    console.log('[TrazabilidadService] Obteniendo sesiones de reciclaje con filtros:', filtros);
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key as keyof typeof filtros];
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return this.get<{
      data: any[];
      estadisticas: {
        totalSesiones: number;
        sesionesExitosas: number;
        sesionesFallidas: number;
        sesionesIniciadas: number;
        usuariosUnicos: number;
        telefonosUnicos: number;
        tasaExito: number;
      };
      pagination: {
        total: number;
        pagina: number;
        limite: number;
        totalPaginas: number;
      };
    }>(`${this.endpoint}/reciclaje/sesiones?${params.toString()}`).pipe(
      tap(response => console.log('[TrazabilidadService] Sesiones de reciclaje obtenidas:', response.data?.length || 0, 'sesiones')),
      catchError(error => {
        console.error('[TrazabilidadService] Error al obtener sesiones de reciclaje:', error);
        return throwError(() => error);
      })
    );
  }
}
