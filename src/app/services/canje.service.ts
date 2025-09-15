import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

export interface CanjeReciclaje {
  _id: string;
  usuarioId: string;
  usuario?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  ecopuntoId: string;
  ecopunto?: {
    _id: string;
    nombre: string;
    direccion: string;
  };
  tipoResiduoId: string;
  tipoResiduo?: {
    _id: string;
    nombre: string;
    descripcion: string;
  };
  pesoKg: number;
  tokensGenerados: number;
  estado: 'pendiente' | 'completado' | 'fallido';
  fechaInicio: Date;
  fechaCompletado?: Date;
  observaciones?: string;
  qrCode?: string;
  phoneNumber?: string;
  imagePath?: string;
}

export interface CanjeRecompensa {
  _id: string;
  usuarioId: string;
  usuario?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  premioId: string;
  premio?: {
    _id: string;
    nombre: string;
    descripcion: string;
    imagen?: string;
  };
  tokensGastados: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaCanje: Date;
  fechaAprobacion?: Date;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class CanjeService extends BaseService {
  private readonly endpoint = '/canjes';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  // Registrar canje de reciclaje
  registrarCanjeReciclaje(canje: Partial<CanjeReciclaje>): Observable<CanjeReciclaje> {
    console.log('[CanjeService] Registrando canje de reciclaje:', canje);
    return this.post<CanjeReciclaje>(this.endpoint, canje).pipe(
      tap(canjeRegistrado => console.log('[CanjeService] Canje de reciclaje registrado:', canjeRegistrado)),
      catchError(error => {
        console.error('[CanjeService] Error al registrar canje de reciclaje:', error);
        return throwError(() => error);
      })
    );
  }

  // Registrar canje de recompensa
  registrarCanjeRecompensa(canje: Partial<CanjeRecompensa>): Observable<CanjeRecompensa> {
    console.log('[CanjeService] Registrando canje de recompensa:', canje);
    return this.post<CanjeRecompensa>(`${this.endpoint}/recompensa`, canje).pipe(
      tap(canjeRegistrado => console.log('[CanjeService] Canje de recompensa registrado:', canjeRegistrado)),
      catchError(error => {
        console.error('[CanjeService] Error al registrar canje de recompensa:', error);
        return throwError(() => error);
      })
    );
  }

  // Método genérico para registrar canje (usado por el componente reciclar)
  registrarCanje(payload: any): Observable<any> {
    console.log('[CanjeService] Registrando canje genérico:', payload);
    return this.post<any>(this.endpoint, payload).pipe(
      tap(resultado => console.log('[CanjeService] Canje genérico registrado:', resultado)),
      catchError(error => {
        console.error('[CanjeService] Error al registrar canje genérico:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener historial de canjes de reciclaje de un usuario
  obtenerHistorialCanjesReciclaje(usuarioId: string): Observable<CanjeReciclaje[]> {
    console.log('[CanjeService] Obteniendo historial de canjes de reciclaje para usuario:', usuarioId);
    return this.get<CanjeReciclaje[]>(`${this.endpoint}/usuario/${usuarioId}`).pipe(
      tap(canjes => console.log('[CanjeService] Historial de canjes de reciclaje obtenido:', canjes?.length || 0)),
      catchError(error => {
        console.error('[CanjeService] Error al obtener historial de canjes de reciclaje:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener historial de canjes de recompensas de un usuario
  obtenerHistorialCanjesRecompensa(usuarioId: string): Observable<CanjeRecompensa[]> {
    console.log('[CanjeService] Obteniendo historial de canjes de recompensa para usuario:', usuarioId);
    return this.get<CanjeRecompensa[]>(`${this.endpoint}/recompensa/usuario/${usuarioId}`).pipe(
      tap(canjes => console.log('[CanjeService] Historial de canjes de recompensa obtenido:', canjes?.length || 0)),
      catchError(error => {
        console.error('[CanjeService] Error al obtener historial de canjes de recompensa:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener historial completo de un usuario (ambos tipos de canjes)
  obtenerHistorialCompletoUsuario(usuarioId: string): Observable<{
    canjesReciclaje: CanjeReciclaje[];
    canjesRecompensa: CanjeRecompensa[];
  }> {
    console.log('[CanjeService] Obteniendo historial completo para usuario:', usuarioId);
    
    return new Observable(observer => {
      let canjesReciclaje: CanjeReciclaje[] = [];
      let canjesRecompensa: CanjeRecompensa[] = [];
      let completed = 0;

      const checkComplete = () => {
        completed++;
        if (completed === 2) {
          observer.next({ canjesReciclaje, canjesRecompensa });
          observer.complete();
        }
      };

      this.obtenerHistorialCanjesReciclaje(usuarioId).subscribe({
        next: (canjes) => {
          canjesReciclaje = canjes;
          checkComplete();
        },
        error: (error) => {
          console.error('Error obteniendo canjes de reciclaje:', error);
          checkComplete();
        }
      });

      this.obtenerHistorialCanjesRecompensa(usuarioId).subscribe({
        next: (canjes) => {
          canjesRecompensa = canjes;
          checkComplete();
        },
        error: (error) => {
          console.error('Error obteniendo canjes de recompensa:', error);
          checkComplete();
        }
      });
    });
  }
} 