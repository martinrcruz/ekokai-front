import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {

  private baseUrl = environment.apiUrl + '/estadisticas';
  
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