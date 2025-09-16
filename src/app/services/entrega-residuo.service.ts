import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';

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
  createdAt: Date;
  updatedAt: Date;
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
export class EntregaResiduoService extends BaseService {
  private readonly endpoint = '/entregas';

  constructor(protected override http: HttpClient, protected override authService: AuthService) {
    super(http, authService);
  }

  // Obtener historial completo con filtros
  obtenerHistorialCompleto(filtros: any = {}): Observable<HistorialResponse> {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.ecopuntoId) params.append('ecopuntoId', filtros.ecopuntoId);
    if (filtros.tipoResiduoId) params.append('tipoResiduoId', filtros.tipoResiduoId);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

    const url = `${this.endpoint}/historial?${params.toString()}`;
    return this.get<HistorialResponse>(url);
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    const url = `${this.endpoint}/estadisticas`;
    return this.get<EstadisticasResponse>(url);
  }

  // Obtener historial de un usuario específico
  obtenerHistorialUsuario(usuarioId: string): Observable<EntregaResiduo[]> {
    const url = `${this.endpoint}/usuario/${usuarioId}`;
    return this.get<EntregaResiduo[]>(url);
  }
}


