import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface EntregaResiduo {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  ecopunto: {
    _id: string;
    nombre: string;
    direccion: string;
  };
  tipoResiduo: {
    _id: string;
    nombre: string;
    descripcion: string;
  };
  pesoKg: number;
  cuponesGenerados: number;
  cuponGenerado: string;
  descripcion: string;
  fecha: Date;
  encargado: {
    _id: string;
    nombre: string;
    apellido: string;
  };
  estado: string;
  observaciones: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface HistorialResponse {
  ok: boolean;
  historial: EntregaResiduo[];
  total: number;
}

export interface EstadisticasResponse {
  ok: boolean;
  estadisticas: {
    totalEntregas: number;
    totalPeso: number;
    totalCupones: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EntregaResiduoService {
  private readonly endpoint = '/entregas';

  constructor(private http: HttpClient) {}

  // Obtener historial completo con filtros
  obtenerHistorialCompleto(filtros: any = {}): Observable<HistorialResponse> {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.ecopuntoId) params.append('ecopuntoId', filtros.ecopuntoId);
    if (filtros.tipoResiduoId) params.append('tipoResiduoId', filtros.tipoResiduoId);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

    const url = `${environment.apiUrl}${this.endpoint}/historial?${params.toString()}`;
    return this.http.get<HistorialResponse>(url);
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    const url = `${environment.apiUrl}${this.endpoint}/estadisticas`;
    return this.http.get<EstadisticasResponse>(url);
  }

  // Obtener historial de un usuario específico
  obtenerHistorialUsuario(usuarioId: string): Observable<EntregaResiduo[]> {
    const url = `${environment.apiUrl}${this.endpoint}/usuario/${usuarioId}`;
    return this.http.get<EntregaResiduo[]>(url);
  }
}

