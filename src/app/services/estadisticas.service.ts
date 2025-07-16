import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private baseUrl = 'http://localhost:3000/estadisticas';

  constructor(private http: HttpClient) {}

  getTotalKilos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/total-kilos`);
  }

  getSucursalTop(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sucursal-top`);
  }

  getKilosPorMes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/kilos-por-mes`);
  }

  getMetaMensual(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/meta-mensual`);
  }
} 