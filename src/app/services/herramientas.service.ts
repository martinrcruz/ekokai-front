import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  /**
   * Obtener todas las herramientas (GET /herramientas)
   */
  async getHerramientas() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/herramientas`, opts);
  }

  /**
   * Obtener herramienta por ID (GET /herramientas/:id)
   */
  async getHerramientaById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/herramientas/${id}`, opts);
  }

  /**
   * Crear herramienta (POST /herramientas/create)
   */
  async createHerramienta(data: any) {
    const opts = await this.getHeaders();
    return this.http.post(`${this.baseUrl}/herramientas/create`, data, opts);
  }

  /**
   * Actualizar herramienta (PUT /herramientas/update/:id)
   */
  async updateHerramienta(id: string, data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/herramientas/update/${id}`, data, opts);
  }

  /**
   * Eliminar herramienta (DELETE /herramientas/:id)
   */
  async deleteHerramienta(id: string) {
    const opts = await this.getHeaders();
    return this.http.delete(`${this.baseUrl}/herramientas/${id}`, opts);
  }
} 