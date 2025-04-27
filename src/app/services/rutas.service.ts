import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Ruta } from '../models/ruta.model';
import { Parte } from '../models/parte.model';

export interface RutasResponse {
  rutas: Ruta[];
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  /**
   * Obtener todas las rutas (GET /rutas)
   */
  async getRutas(): Promise<Observable<ApiResponse<RutasResponse>>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<RutasResponse>>(`${this.baseUrl}/rutas`, opts);
  }

  /**
   * Crear ruta (POST /rutas/create)
   */
  async createRuta(data: Partial<Ruta>): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.post<ApiResponse<Ruta>>(`${this.baseUrl}/rutas/create`, data, opts);
  }

  /**
   * Obtener ruta por ID (GET /rutas/:id)
   */
  async getRutaById(id: string): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<Ruta>>(`${this.baseUrl}/rutas/${id}`, opts);
  }

  /**
   * Actualizar ruta (PUT /rutas/update/:id)
   */
  async updateRuta(id: string, data: Partial<Ruta>): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.put<ApiResponse<Ruta>>(`${this.baseUrl}/rutas/update/${id}`, data, opts);
  }

  /**
   * Eliminar ruta (DELETE /rutas/:id)
   */
  async deleteRuta(id: string): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.delete<ApiResponse<Ruta>>(`${this.baseUrl}/rutas/${id}`, opts);
  }

  /**
   * Obtener rutas por trabajador (GET /rutas/worker/:workerId)
   */
  async getRutasByWorker(workerId: string, date?: string): Promise<Observable<ApiResponse<RutasResponse>>> {
    const opts = await this.getHeaders();
    let url = `${this.baseUrl}/rutas/worker/${workerId}`;
    if (date) {
      url += `?date=${date}`;
    }
    return this.http.get<ApiResponse<RutasResponse>>(url, opts);
  }

  /**
   * Obtener partes de una ruta (GET /rutas/:id/partes)
   */
  async getPartesDeRuta(rutaId: string): Promise<Observable<ApiResponse<Parte[]>>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<Parte[]>>(`${this.baseUrl}/rutas/${rutaId}/partes`, opts);
  }

  /**
   * Asignar partes a una ruta (POST /rutas/:id/asignarPartes)
   */
  async asignarPartesARuta(rutaId: string, parteIds: string[]): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.post<ApiResponse<Ruta>>(`${this.baseUrl}/rutas/${rutaId}/asignarPartes`, 
      { parteIds }, 
      opts
    );
  }

  /**
   * Obtener rutas disponibles (GET /rutas/disponibles)
   */
  async getRutasDisponibles(dateStr: string): Promise<Observable<ApiResponse<RutasResponse>>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<RutasResponse>>(`${this.baseUrl}/rutas/disponibles?date=${dateStr}`, opts);
  }

  // -----------------------------------------------------
  // RUTAS N (RutaN)
  // -----------------------------------------------------

  /**
   * Obtener todas las rutas N (GET /rutasn)
   */
  async getRutasN(): Promise<Observable<ApiResponse<RutasResponse>>> {
    const opts = await this.getHeaders();
    return this.http.get<ApiResponse<RutasResponse>>(`${this.baseUrl}/rutasn`, opts);
  }

  /**
   * Crear RutaN (POST /rutasn/create)
   */
  async createRutaN(data: Partial<Ruta>): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.post<ApiResponse<Ruta>>(`${this.baseUrl}/rutasn/create`, data, opts);
  }

  /**
   * Eliminar RutaN por ID (DELETE /rutasn/:id)
   */
  async deleteRutaN(id: string): Promise<Observable<ApiResponse<Ruta>>> {
    const opts = await this.getHeaders();
    return this.http.delete<ApiResponse<Ruta>>(`${this.baseUrl}/rutasn/${id}`, opts);
  }
} 