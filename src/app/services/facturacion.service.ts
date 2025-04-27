import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface Facturacion {
  _id: string;
  ruta: {
    _id: string;
    name: {
      name: string;
    };
  };
  parte: {
    _id: string;
    description: string;
  };
  facturacion: number;
  createdDate: string;
}

export interface FacturacionResponse {
  facturacion: Facturacion[];
}

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {
  private apiUrl = `${environment.apiUrl}/facturacion`;

  constructor(private http: HttpClient) { }

  getFacturacion(): Observable<ApiResponse<FacturacionResponse>> {
    return this.http.get<ApiResponse<FacturacionResponse>>(this.apiUrl);
  }

  getFacturacionById(id: string): Observable<ApiResponse<Facturacion>> {
    return this.http.get<ApiResponse<Facturacion>>(`${this.apiUrl}/${id}`);
  }

  createFacturacion(facturacion: Partial<Facturacion>): Observable<ApiResponse<Facturacion>> {
    return this.http.post<ApiResponse<Facturacion>>(`${this.apiUrl}/create`, facturacion);
  }

  updateFacturacion(id: string, facturacion: Partial<Facturacion>): Observable<ApiResponse<Facturacion>> {
    return this.http.put<ApiResponse<Facturacion>>(`${this.apiUrl}/update`, { ...facturacion, _id: id });
  }

  deleteFacturacion(id: string): Observable<ApiResponse<Facturacion>> {
    return this.http.delete<ApiResponse<Facturacion>>(`${this.apiUrl}/${id}`);
  }

  getFacturacionByRuta(rutaId: string): Observable<ApiResponse<FacturacionResponse>> {
    return this.http.get<ApiResponse<FacturacionResponse>>(`${this.apiUrl}/ruta/${rutaId}`);
  }
} 