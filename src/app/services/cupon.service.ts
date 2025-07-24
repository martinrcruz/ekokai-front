import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Cupon } from '../models/cupon.model';
import { BaseService } from './base.service';

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
} 