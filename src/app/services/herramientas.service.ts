import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService extends BaseService {
  private readonly endpoint = '/herramientas';

  constructor(
    http: HttpClient,
    authService: AuthService
  ) {
    super(http, authService);
  }



  /**
   * Obtener todas las herramientas (GET /herramientas)
   */
  getHerramientas() :Observable<any> {
    return this.http.get(`${this.baseUrl}/herramientas`);
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