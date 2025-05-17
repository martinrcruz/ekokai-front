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
@Injectable({ providedIn: 'root' })
export class FacturacionService {
  private apiUrl = `${environment.apiUrl}/facturacion`;

  constructor(private http: HttpClient) {}

  getFacturacion() {
    return this.http.get<any>(this.apiUrl);
  }

  getFacturacionById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createFacturacion(facturacion: Partial<Facturacion>) {
    return this.http.post<any>(`${this.apiUrl}/create`, facturacion);
  }

  updateFacturacion(id: string, facturacion: Partial<Facturacion>) {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, facturacion);
  }

  deleteFacturacion(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getFacturacionByRuta(rutaId: string) {
    return this.http.get<any>(`${this.apiUrl}/ruta/${rutaId}`);
  }
}
