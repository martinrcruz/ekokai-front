import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {

  private baseUrl = environment.apiUrl + '/estadisticas';
  
  constructor(private http: HttpClient) {}

  getTotalKilos(ecopuntoId?: string): Observable<any> {
    const url = ecopuntoId
      ? `${this.baseUrl}/total-kilos?ecopuntoId=${encodeURIComponent(ecopuntoId)}`
      : `${this.baseUrl}/total-kilos`;
    return this.http.get<any>(url);
  }

  getSucursalTop(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sucursal-top`);
  }

  getKilosPorMes(ecopuntoId?: string): Observable<any[]> {
    const url = ecopuntoId
      ? `${this.baseUrl}/kilos-por-mes?ecopuntoId=${encodeURIComponent(ecopuntoId)}`
      : `${this.baseUrl}/kilos-por-mes`;
    return this.http.get<any[]>(url);
  }

  getMetaMensual(ecopuntoId?: string): Observable<any> {
    const url = ecopuntoId
      ? `${this.baseUrl}/meta-mensual?ecopuntoId=${encodeURIComponent(ecopuntoId)}`
      : `${this.baseUrl}/meta-mensual`;
    return this.http.get<any>(url);
  }
} 