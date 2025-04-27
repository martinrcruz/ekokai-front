import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Alerta } from '../models/alerta.model';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Metodo auxiliar para adjuntar cabeceras con el x-token
   */
  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  // -----------------------------------------------------
  // ALERTAS
  // -----------------------------------------------------

  /**
   * Obtener alertas (GET /alertas)
   */
  async getAlertas(): Promise<Observable<Alerta[]>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<Alerta[]>>(`${this.baseUrl}/alertas`, opts).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Error al obtener las alertas');
      })
    );
  }

  /**
   * Actualizar alerta (PUT /alertas/:id)
   */
  async updateAlerta(alertaId: string, data: Partial<Alerta>): Promise<Observable<Alerta>> {
    const opts = await this.getHeaders();
    return this.http.put<ApiResponse<Alerta>>(`${this.baseUrl}/alertas/${alertaId}`, data, opts).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Error al actualizar la alerta');
      })
    );
  }
}
