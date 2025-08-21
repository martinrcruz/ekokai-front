import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface EstadisticasUsuario {
  kilosHoy: number;
  metaDiaria: number;
  porcentajeMeta: number;
  kilosRestantes: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasUsuarioService {
  private baseUrl = environment.apiUrl + '/estadisticas';

  constructor(private http: HttpClient) {}

  // Obtener estadísticas del usuario logueado para el día actual
  getEstadisticasUsuarioHoy(): Observable<EstadisticasUsuario> {
    const url = `${this.baseUrl}/usuario-hoy`;
    return this.http.get<EstadisticasUsuario>(url);
  }

  // Obtener kilos reciclados hoy por el usuario logueado
  getKilosUsuarioHoy(): Observable<{ kilosHoy: number }> {
    const url = `${this.baseUrl}/usuario-hoy/kilos`;
    return this.http.get<{ kilosHoy: number }>(url);
  }

  // Obtener meta diaria del usuario logueado
  getMetaDiariaUsuario(): Observable<{ metaDiaria: number }> {
    const url = `${this.baseUrl}/usuario-hoy/meta`;
    return this.http.get<{ metaDiaria: number }>(url);
  }
}
