import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Cupon, Canje } from '../models/cupon.model';
import { BaseService } from './base.service';

// Re-exportar las interfaces para que estén disponibles
export { Cupon, Canje } from '../models/cupon.model';

@Injectable({ providedIn: 'root' })
export class CuponService extends BaseService {
  private readonly endpoint = '/cupones';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  listar(): Observable<Cupon[]> {
    console.log('[CuponService] Listando cupones...');
    return this.get<Cupon[]>(this.endpoint).pipe(
      tap(cupones => console.log('[CuponService] Cupones obtenidos:', cupones?.length || 0)),
      catchError(error => {
        console.error('[CuponService] Error al listar cupones:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerPorId(id: string): Observable<Cupon> {
    console.log('[CuponService] Obteniendo cupón por ID:', id);
    return this.get<Cupon>(`${this.endpoint}/${id}`).pipe(
      tap(cupon => console.log('[CuponService] Cupón obtenido:', cupon)),
      catchError(error => {
        console.error('[CuponService] Error al obtener cupón:', error);
        return throwError(() => error);
      })
    );
  }

  crear(cupon: Cupon): Observable<Cupon> {
    console.log('[CuponService] Creando cupón:', cupon);
    return this.post<Cupon>(this.endpoint, cupon).pipe(
      tap(cuponCreado => console.log('[CuponService] Cupón creado:', cuponCreado)),
      catchError(error => {
        console.error('[CuponService] Error al crear cupón:', error);
        return throwError(() => error);
      })
    );
  }

  actualizar(id: string, cupon: Cupon): Observable<Cupon> {
    console.log('[CuponService] Actualizando cupón:', id, cupon);
    return this.put<Cupon>(`${this.endpoint}/${id}`, cupon).pipe(
      tap(cuponActualizado => console.log('[CuponService] Cupón actualizado:', cuponActualizado)),
      catchError(error => {
        console.error('[CuponService] Error al actualizar cupón:', error);
        return throwError(() => error);
      })
    );
  }

  eliminar(id: string): Observable<any> {
    console.log('[CuponService] Eliminando cupón:', id);
    return this.delete<any>(`${this.endpoint}/${id}`).pipe(
      tap(resultado => console.log('[CuponService] Cupón eliminado:', resultado)),
      catchError(error => {
        console.error('[CuponService] Error al eliminar cupón:', error);
        return throwError(() => error);
      })
    );
  }

  activar(id: string): Observable<Cupon> {
    console.log('[CuponService] Activando cupón:', id);
    return this.put<Cupon>(`${this.endpoint}/${id}/activar`, { activo: true }).pipe(
      tap(cupon => console.log('[CuponService] Cupón activado:', cupon)),
      catchError(error => {
        console.error('[CuponService] Error al activar cupón:', error);
        return throwError(() => error);
      })
    );
  }

  desactivar(id: string): Observable<Cupon> {
    console.log('[CuponService] Desactivando cupón:', id);
    return this.put<Cupon>(`${this.endpoint}/${id}/desactivar`, { activo: false }).pipe(
      tap(cupon => console.log('[CuponService] Cupón desactivado:', cupon)),
      catchError(error => {
        console.error('[CuponService] Error al desactivar cupón:', error);
        return throwError(() => error);
      })
    );
  }

  listarActivos(): Observable<Cupon[]> {
    console.log('[CuponService] Listando cupones activos...');
    return this.get<Cupon[]>(`${this.endpoint}/activos`).pipe(
      tap(cupones => console.log('[CuponService] Cupones activos obtenidos:', cupones?.length || 0)),
      catchError(error => {
        console.error('[CuponService] Error al listar cupones activos:', error);
        return throwError(() => error);
      })
    );
  }

  buscarPorNombre(nombre: string): Observable<Cupon[]> {
    console.log('[CuponService] Buscando cupones por nombre:', nombre);
    return this.get<Cupon[]>(`${this.endpoint}/buscar?nombre=${encodeURIComponent(nombre)}`).pipe(
      tap(cupones => console.log('[CuponService] Cupones encontrados:', cupones?.length || 0)),
      catchError(error => {
        console.error('[CuponService] Error al buscar cupones:', error);
        return throwError(() => error);
      })
    );
  }

  // Nuevas funcionalidades
  generarCuponesMasivos(cuponData: Partial<Cupon>, cantidad: number): Observable<{cupones: Cupon[], cantidad: number}> {
    console.log('[CuponService] Generando cupones masivos:', cantidad);
    return this.post<{cupones: Cupon[], cantidad: number}>(`${this.endpoint}/generar-masivos`, { ...cuponData, cantidad }).pipe(
      tap(resultado => console.log('[CuponService] Cupones masivos generados:', resultado.cantidad)),
      catchError(error => {
        console.error('[CuponService] Error al generar cupones masivos:', error);
        return throwError(() => error);
      })
    );
  }

  asociarUsuario(cuponId: string, usuarioId: string): Observable<Cupon> {
    console.log('[CuponService] Asociando usuario al cupón:', usuarioId);
    return this.post<Cupon>(`${this.endpoint}/${cuponId}/asociar-usuario`, { usuarioId }).pipe(
      tap(cupon => console.log('[CuponService] Usuario asociado al cupón')),
      catchError(error => {
        console.error('[CuponService] Error al asociar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  desasociarUsuario(cuponId: string, usuarioId: string): Observable<Cupon> {
    console.log('[CuponService] Desasociando usuario del cupón:', usuarioId);
    return this.delete<Cupon>(`${this.endpoint}/${cuponId}/asociar-usuario/${usuarioId}`).pipe(
      tap(cupon => console.log('[CuponService] Usuario desasociado del cupón')),
      catchError(error => {
        console.error('[CuponService] Error al desasociar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  asociarComercio(cuponId: string, comercioId: string): Observable<Cupon> {
    console.log('[CuponService] Asociando comercio al cupón:', comercioId);
    return this.post<Cupon>(`${this.endpoint}/${cuponId}/asociar-comercio`, { comercioId }).pipe(
      tap(cupon => console.log('[CuponService] Comercio asociado al cupón')),
      catchError(error => {
        console.error('[CuponService] Error al asociar comercio:', error);
        return throwError(() => error);
      })
    );
  }

  desasociarComercio(cuponId: string, comercioId: string): Observable<Cupon> {
    console.log('[CuponService] Desasociando comercio del cupón:', comercioId);
    return this.delete<Cupon>(`${this.endpoint}/${cuponId}/asociar-comercio/${comercioId}`).pipe(
      tap(cupon => console.log('[CuponService] Comercio desasociado del cupón')),
      catchError(error => {
        console.error('[CuponService] Error al desasociar comercio:', error);
        return throwError(() => error);
      })
    );
  }

  canjearCupon(cuponId: string, usuarioId: string, comercioId?: string, tokensGastados?: number): Observable<{cupon: Cupon, canje: Canje}> {
    console.log('[CuponService] Canjeando cupón:', cuponId);
    return this.post<{cupon: Cupon, canje: Canje}>(`${this.endpoint}/${cuponId}/canjear`, { 
      usuarioId, 
      comercioId, 
      tokensGastados 
    }).pipe(
      tap(resultado => console.log('[CuponService] Cupón canjeado exitosamente')),
      catchError(error => {
        console.error('[CuponService] Error al canjear cupón:', error);
        return throwError(() => error);
      })
    );
  }

  listarCanjes(filtros?: any): Observable<Canje[]> {
    console.log('[CuponService] Listando canjes con filtros:', filtros);
    const params = new URLSearchParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params.append(key, filtros[key]);
      });
    }
    
    return this.get<Canje[]>(`${this.endpoint}/canjes?${params.toString()}`).pipe(
      tap(canjes => console.log('[CuponService] Canjes obtenidos:', canjes?.length || 0)),
      catchError(error => {
        console.error('[CuponService] Error al listar canjes:', error);
        return throwError(() => error);
      })
    );
  }

  aprobarCanje(canjeId: string, observaciones?: string): Observable<Canje> {
    console.log('[CuponService] Aprobando canje:', canjeId);
    return this.put<Canje>(`${this.endpoint}/canjes/${canjeId}/aprobar`, { observaciones }).pipe(
      tap(canje => console.log('[CuponService] Canje aprobado')),
      catchError(error => {
        console.error('[CuponService] Error al aprobar canje:', error);
        return throwError(() => error);
      })
    );
  }

  rechazarCanje(canjeId: string, observaciones?: string): Observable<Canje> {
    console.log('[CuponService] Rechazando canje:', canjeId);
    return this.put<Canje>(`${this.endpoint}/canjes/${canjeId}/rechazar`, { observaciones }).pipe(
      tap(canje => console.log('[CuponService] Canje rechazado')),
      catchError(error => {
        console.error('[CuponService] Error al rechazar canje:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerEstadisticas(): Observable<any> {
    console.log('[CuponService] Obteniendo estadísticas de cupones');
    return this.get<any>(`${this.endpoint}/estadisticas`).pipe(
      tap(estadisticas => console.log('[CuponService] Estadísticas obtenidas')),
      catchError(error => {
        console.error('[CuponService] Error al obtener estadísticas:', error);
        return throwError(() => error);
      })
    );
  }
} 