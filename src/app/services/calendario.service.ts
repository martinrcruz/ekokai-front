import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { map, catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService  {
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  // Obtiene las rutas programadas para una fecha específica
  getRutasByDate(date: string): Observable<ApiResponse<any>> {
    return this.http.get<any>(`${environment.apiUrl}/partes/calendario/${date}/rutas`).pipe(
      retry(1),
      map(response => {
        return {
          ok: true,
          data: { rutas: response.rutas }
        };
      }),
      catchError(error => {
        console.error('Error en getRutasByDate:', error);
        return of({
          ok: false,
          error: error.message || 'Error al obtener rutas',
          data: { rutas: [] }
        });
      })
    );
  }

  // Obtiene los partes no asignados en un mes
  getPartesNoAsignadosEnMes(date: string): Observable<{ok: boolean, partes: any[]}> {
    return this.http.get<{ok: boolean, partes: any[]}>(`${environment.apiUrl}/partes/calendario/${date}/partes-no-asignados`).pipe(
      retry(1),
      map(response => {
        // Asegurarnos de que la respuesta tenga la estructura correcta
        return {
          ok: response.ok,
          partes: response.partes || []
        };
      }),
      catchError(error => {
        console.error('Error en getPartesNoAsignadosEnMes:', error);
        return of({
          ok: false,
          partes: []
        });
      })
    );
  }

  // Obtiene los partes finalizados en un mes (para facturación)
  getPartesFinalizadasMonth(date: string): Observable<ApiResponse<any>> {
    return this.http.get<any>(`${environment.apiUrl}/partes/calendario/${date}/partes-finalizados`).pipe(
      retry(1), // Reintentar 1 vez si hay un error de red
      map(response => {
        // Normalizar la respuesta para que siempre tenga una estructura consistente
        if (!response.partes && response.ok) {
          return {
            ok: true,
            data: { partes: [] }
          };
        } else if (response.partes) {
          return {
            ok: true,
            data: { partes: response.partes }
          };
        }
        // Retornar la respuesta original si no cumple con los criterios anteriores
        return response;
      }),
      catchError(error => {
        console.error('Error en getPartesFinalizadasMonth:', error);
        return of({
          ok: false,
          error: error.message || 'Error al obtener partes finalizados',
          data: { partes: [] }
        });
      })
    );
  }
} 