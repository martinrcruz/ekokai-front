import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  /**
   * Obtener partes asignados al worker (GET /worker/partes)
   */
  async getPartesAsignados() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/worker/partes`, opts);
  }

  /**
   * Obtener rutas asignadas al worker (GET /worker/rutas)
   */
  async getRutasAsignadas() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/worker/rutas`, opts);
  }

  /**
   * Actualizar estado de parte (PUT /worker/parte/:id/status)
   */
  async updateParteStatus(parteId: string, status: string) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/worker/parte/${parteId}/status`, { status }, opts);
  }

  /**
   * Obtener partes del día (GET /worker/partes/dia)
   */
  async getPartesDelDia() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/worker/partes/dia`, opts);
  }

  /**
   * Obtener rutas del día (GET /worker/rutas/dia)
   */
  async getRutasDelDia() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/worker/rutas/dia`, opts);
  }
} 