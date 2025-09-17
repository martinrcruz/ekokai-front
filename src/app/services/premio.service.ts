import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Premio {
  id?: string;
  nombre: string;
  descripcion: string;
  imagen?: string;
  cuponesRequeridos: number;
  stock: number;
  categoria: string;
  activo: boolean;
  destacado: boolean;
  orden: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PremiosResponse {
  ok: boolean;
  premios: Premio[];
}

export interface PremioResponse {
  ok: boolean;
  premio: Premio;
}

@Injectable({
  providedIn: 'root'
})
export class PremioService extends BaseService {
  private readonly endpoint = '/premios';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }

  // Métodos públicos para el catálogo (no requieren autenticación)
  getPremiosActivos(): Observable<PremiosResponse> {
    return this.http.get<PremiosResponse>(`${environment.apiUrl}${this.endpoint}/catalogo`);
  }

  getPremiosDestacados(): Observable<PremiosResponse> {
    return this.http.get<PremiosResponse>(`${environment.apiUrl}${this.endpoint}/catalogo/destacados`);
  }

  getPremiosPorCategoria(categoria: string): Observable<PremiosResponse> {
    return this.http.get<PremiosResponse>(`${environment.apiUrl}${this.endpoint}/catalogo/categoria/${categoria}`);
  }

  buscarPremios(termino: string): Observable<PremiosResponse> {
    return this.http.get<PremiosResponse>(`${environment.apiUrl}${this.endpoint}/catalogo/buscar?q=${encodeURIComponent(termino)}`);
  }

  getPremioPorId(id: string): Observable<PremioResponse> {
    return this.http.get<PremioResponse>(`${environment.apiUrl}${this.endpoint}/catalogo/${id}`);
  }

  // Métodos protegidos para administradores
  getAllPremios(): Observable<PremiosResponse> {
    return this.get<PremiosResponse>(this.endpoint);
  }

  createPremio(data: Partial<Premio>): Observable<any> {
    return this.post<any>(this.endpoint, data);
  }

  updatePremio(id: string, data: Partial<Premio>): Observable<any> {
    return this.put<any>(`${this.endpoint}/${id}`, data);
  }

  deletePremio(id: string): Observable<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}

