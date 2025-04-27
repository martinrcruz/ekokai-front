import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private async getHeaders() {
    return await this.authService.getHeaders();
  }

  /**
   * Obtener lista completa de usuarios (GET /user/list)
   */
  async getUsers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/list`, opts);
  }

  /**
   * Obtener lista de usuarios con role: worker (GET /user/worker)
   */
  async getWorkers() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/worker`, opts);
  }

  /**
   * Obtener datos de un usuario por ID (GET /user/:id)
   */
  async getUserById(id: string) {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user/${id}`, opts);
  }

  /**
   * Actualizar un usuario (PUT /user/update)
   */
  async updateUser(data: any) {
    const opts = await this.getHeaders();
    return this.http.put(`${this.baseUrl}/user/update`, data, opts);
  }

  /**
   * Obtener datos de usuario logueado (GET /user)
   */
  async getMyUser() {
    const opts = await this.getHeaders();
    return this.http.get(`${this.baseUrl}/user`, opts);
  }
} 